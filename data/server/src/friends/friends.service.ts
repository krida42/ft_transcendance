import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { isUUID } from 'class-validator';
import { uuidv4 } from 'src/types';
import { ChanType } from 'src/types';
import { UserStatus } from 'src/types';

import { Friends } from 'db/models/friends';
import { UsersService } from '../users/users.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { FriendsGateway } from 'src/realtime/friends.gateway';

enum FriendStatus {
  Pending = 'Pending',
  Active = 'Active',
  Blocked = 'Blocked',
}

// POST createFriend(sender_id: uuidv4, receiver_id: uuidv4): Promise<PublicUserDto> OK
// PATCH acceptFriend(sender_id: uuidv4, receiver_id: uuidv4): Promise<PublicUserDto> OK
// DELETE deleteFriend(sender_id: uuidv4, receiver_id: uuidv4): Promise<PublicUserDto> OK

// ---------- BLOCK / UNBLOCK
// POST blockFriend(sender_id: uuidv4, receiver_id: uuidv4): Promise<PublicUserDto> OK
// DELETE unblockFriend(sender_id: uuidv4, receiver_id: uuidv4): Promise<PublicUserDto> OK

// ---------- GET
// GET getSentRequests(currentId: uuidv4): Promise<PublicUserDto[]> OK
// GET getSentRequests(currentId: uuidv4): Promise<PublicUserDto[]> OK
// GET getFriends(currentId: uuidv4): Promise<PublicUserDto[]> OK
// GET getBlocked(currentId: uuidv4): Promise<PublicUserDto[]> OK

// ---------- UTILS
// checkId(id: uuidv4): Promise<uuidv4> OK
// friendExists(user1_id: uuidv4, user2_id: uuidv4): Promise<boolean> OK
// getFriendship(user1_id: uuidv4, user2_id: uuidv4): Promise<Friends> OK
// youBlockIt(you_id: uuidv4, it_id: uuidv4): Promise<boolean> OK
// heBlockYou(you_id: uuidv4, it_id: uuidv4): Promise<boolean> OK
// isBlocked(you_id: uuidv4, he_id: uuidv4): Promise<boolean> OK
// fetchPublicUserDto(id: uuidv4): Promise<PublicUserDto> OK
// fetchUserDtoArrayFor(currentId: uuidv4, all: Friends[]): Promise<PublicUserDto[]> OK
// isFriendship(user1_id: uuidv4, user2_id: uuidv4): Promise<boolean> OK

@Injectable()
export class FriendsService {
  constructor(
    @Inject(forwardRef(() => FriendsGateway))
    private readonly friendsGateway: FriendsGateway,
    @InjectModel(Friends)
    private readonly friendsModel: typeof Friends,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  async createFriend(
    sender_id: uuidv4,
    receiver_id: uuidv4,
  ): Promise<PublicUserDto> {
    if ((await this.checkId(sender_id)) === (await this.checkId(receiver_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    if (await this.friendExists(sender_id, receiver_id)) {
      throw new HttpException('already added', HttpStatus.BAD_REQUEST);
    }
    if (await this.youBlockIt(sender_id, receiver_id)) {
      throw new HttpException('you blocked this user', HttpStatus.CONFLICT);
    }
    if (await this.heBlockYou(sender_id, receiver_id)) {
      throw new HttpException(
        'this user has blocked you',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      await this.friendsModel.create({
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: FriendStatus.Pending,
      });

      if (receiver_id)
        await this.friendsGateway.pingUserFriendsStateChanged(receiver_id);

      return await this.fetchPublicUserDto(receiver_id);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async acceptFriend(
    receiver_id: uuidv4,
    sender_id: uuidv4,
  ): Promise<PublicUserDto> {
    if ((await this.checkId(sender_id)) === (await this.checkId(receiver_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    const pendingFriend = await this.friendsModel.findOne({
      where: {
        sender_id: sender_id,
        receiver_id: receiver_id,
      },
    });
    if (!pendingFriend) {
      throw new HttpException('friend request not found', HttpStatus.NOT_FOUND);
    }
    if (pendingFriend.status === FriendStatus.Active) {
      throw new HttpException('friend already exist', HttpStatus.CONFLICT);
    }
    if (pendingFriend.status === FriendStatus.Blocked) {
      throw new HttpException('user is blocked', HttpStatus.CONFLICT);
    }

    pendingFriend.status = FriendStatus.Active;
    await pendingFriend.save();

    if (sender_id)
      await this.friendsGateway.pingUserFriendsStateChanged(sender_id); // c normal, is not currentId

    if (sender_id && receiver_id) {
      this.friendsGateway.bindUserToFriends(sender_id, [receiver_id]);
      this.friendsGateway.bindUserToFriends(receiver_id, [sender_id]);
    }

    this.createDirectChannel(sender_id, receiver_id);
    return await this.fetchPublicUserDto(sender_id);
  }

  async cancelFriend(
    currentId: uuidv4,
    friend_id: uuidv4,
  ): Promise<PublicUserDto> {
    if ((await this.checkId(currentId)) === (await this.checkId(friend_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    const friendship = await this.getPending(currentId, friend_id);
    if (!friendship) {
      throw new HttpException('relation not found', HttpStatus.NOT_FOUND);
    }
    await friendship.destroy();

    if (friend_id)
      await this.friendsGateway.pingUserFriendsStateChanged(friend_id);

    return await this.fetchPublicUserDto(friend_id);
  }

  async deleteFriend(
    currentId: uuidv4,
    friend_id: uuidv4,
  ): Promise<PublicUserDto> {
    if ((await this.checkId(currentId)) === (await this.checkId(friend_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    const friendship = await this.getFriendship(currentId, friend_id);
    if (!friendship) {
      throw new HttpException('relation not found', HttpStatus.NOT_FOUND);
    }
    await friendship.destroy();
    await this.deleteDirectChannel(currentId, friend_id);

    if (friend_id)
      await this.friendsGateway.pingUserFriendsStateChanged(friend_id);
    if (currentId && friend_id) {
      this.friendsGateway.unbindUserFromFriends(currentId, [friend_id]);
      this.friendsGateway.unbindUserFromFriends(friend_id, [currentId]);
    }

    return await this.fetchPublicUserDto(friend_id);
  }

  // ---------- BLOCK / UNBLOCK

  async blockFriend(
    sender_id: uuidv4,
    receiver_id: uuidv4,
  ): Promise<PublicUserDto> {
    if ((await this.checkId(sender_id)) === (await this.checkId(receiver_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    if (await this.youBlockIt(sender_id, receiver_id))
      if (await this.youBlockIt(sender_id, receiver_id))
        throw new HttpException('user already blocked', HttpStatus.BAD_REQUEST);

    try {
      let friendship = await this.getFriendship(sender_id, receiver_id);
      if (friendship) {
        friendship.sender_id = sender_id;
        friendship.receiver_id = receiver_id;
        friendship.status = FriendStatus.Blocked;
        await friendship.save();
        await this.deleteDirectChannel(sender_id, receiver_id);
      } else {
        await this.friendsModel.create({
          sender_id: sender_id,
          receiver_id: receiver_id,
          status: FriendStatus.Blocked,
        });
      }
    } catch (error) {
      throw new HttpException('blockFriend ' + error, HttpStatus.BAD_REQUEST);
    }
    if (receiver_id)
      await this.friendsGateway.pingUserFriendsStateChanged(receiver_id);
    if (sender_id && receiver_id) {
      this.friendsGateway.unbindUserFromFriends(sender_id, [receiver_id]);
      this.friendsGateway.unbindUserFromFriends(receiver_id, [sender_id]);
    }

    return await this.fetchPublicUserDto(receiver_id);
  }

  async unblockFriend(
    sender_id: uuidv4,
    receiver_id: uuidv4,
  ): Promise<PublicUserDto> {
    if ((await this.checkId(sender_id)) === (await this.checkId(receiver_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    const youBlock = await Friends.findOne({
      where: {
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: FriendStatus.Blocked,
      },
    });
    if (!youBlock)
      throw new HttpException('user not blocked', HttpStatus.NOT_FOUND);
    else await youBlock.destroy();
    if (receiver_id)
      await this.friendsGateway.pingUserFriendsStateChanged(receiver_id);

    return await this.fetchPublicUserDto(receiver_id);
  }

  // ---------- GET

  async getSentRequests(currentId: uuidv4): Promise<PublicUserDto[]> {
    await this.checkId(currentId);

    const all = await Friends.findAll({
      where: {
        sender_id: currentId,
        status: FriendStatus.Pending,
      },
    });
    return await this.fetchUserDtoArrayFor(currentId, all);
  }

  async getReceivedRequests(currentId: uuidv4): Promise<PublicUserDto[]> {
    await this.checkId(currentId);

    const all = await Friends.findAll({
      where: {
        receiver_id: currentId,
        status: FriendStatus.Pending,
      },
    });
    return await this.fetchUserDtoArrayFor(currentId, all);
  }

  async getFriends(currentId: uuidv4): Promise<PublicUserDto[]> {
    await this.checkId(currentId);
    const all = await Friends.findAll({
      where: {
        [Op.or]: [{ sender_id: currentId }, { receiver_id: currentId }],
        status: FriendStatus.Active,
      },
    });
    return await this.fetchUserDtoArrayFor(currentId, all);
  }

  async getBlocked(currentId: uuidv4): Promise<PublicUserDto[]> {
    await this.checkId(currentId);
    const all = await Friends.findAll({
      where: {
        sender_id: currentId,
        status: FriendStatus.Blocked,
      },
    });
    return await this.fetchUserDtoArrayFor(currentId, all);
  }

  async getBlockersOfUser(currentId: uuidv4): Promise<PublicUserDto[]> {
    await this.checkId(currentId);
    const all = await Friends.findAll({
      where: {
        receiver_id: currentId,
        status: FriendStatus.Blocked,
      },
    });
    return await this.fetchUserDtoArrayFor(currentId, all);
  }

  // ---------- UTILS

  async checkId(id: uuidv4): Promise<uuidv4> {
    if (!id) {
      throw new HttpException('null uuidv4', HttpStatus.BAD_REQUEST);
    }
    if (!isUUID(id, 4)) {
      throw new HttpException('format uuidv4', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException('user uuidv4 not found', HttpStatus.NOT_FOUND);
    }
    return id;
  }

  async friendExists(user1_id: uuidv4, user2_id: uuidv4): Promise<boolean> {
    const existingFriendship = await Friends.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { sender_id: user1_id, receiver_id: user2_id },
              { sender_id: user2_id, receiver_id: user1_id },
            ],
          },
          {
            [Op.or]: [
              { status: FriendStatus.Active },
              { status: FriendStatus.Pending },
            ],
          },
        ],
      },
    });

    if (existingFriendship) return true;
    else return false;
  }

  async getFriendship(
    user1_id: uuidv4,
    user2_id: uuidv4,
  ): Promise<Friends | null> {
    return await Friends.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { sender_id: user1_id, receiver_id: user2_id },
              { sender_id: user2_id, receiver_id: user1_id },
            ],
          },
          {
            [Op.or]: [
              { status: FriendStatus.Active },
              { status: FriendStatus.Pending },
            ],
          },
        ],
      },
    });
  }

  async getPending(
    user1_id: uuidv4,
    user2_id: uuidv4,
  ): Promise<Friends | null> {
    return await Friends.findOne({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { sender_id: user1_id, receiver_id: user2_id },
              { sender_id: user2_id, receiver_id: user1_id },
            ],
          },
          {
            status: FriendStatus.Pending,
          },
        ],
      },
    });
  }

  async youBlockIt(you_id: uuidv4, it_id: uuidv4): Promise<boolean> {
    const blocked = await Friends.findOne({
      where: {
        sender_id: you_id,
        receiver_id: it_id,
        status: FriendStatus.Blocked,
      },
    });
    if (blocked) return true;
    else return false;
  }
  async heBlockYou(you_id: uuidv4, it_id: uuidv4): Promise<boolean> {
    const blocked = await Friends.findOne({
      where: {
        sender_id: it_id,
        receiver_id: you_id,
        status: FriendStatus.Blocked,
      },
    });
    if (blocked) return true;
    else return false;
  }

  async isBlocked(you_id: uuidv4, he_id: uuidv4): Promise<boolean> {
    return (
      (await this.youBlockIt(you_id, he_id)) ||
      (await this.heBlockYou(you_id, he_id))
    );
  }

  async fetchPublicUserDto(id: uuidv4): Promise<PublicUserDto> {
    const user = await this.usersService.findById(id);
    const publicUserDto = new PublicUserDto(
      user.public_id,
      user.login,
      user.pseudo,
      user.avatar,
    );
    return publicUserDto;
  }

  async fetchUserDtoArrayFor(
    currentId: uuidv4,
    all: Friends[],
  ): Promise<PublicUserDto[]> {
    const publicUserDtoArray: PublicUserDto[] = [];
    for (const relation of all) {
      let other_user = await this.usersService.findById(relation.sender_id);
      if (relation.sender_id === currentId) {
        other_user = await this.usersService.findById(relation.receiver_id);
      }
      const publicUserDto = new PublicUserDto(
        other_user.public_id,
        other_user.login,
        other_user.pseudo,
        other_user.avatar,
      );
      publicUserDtoArray.push(publicUserDto);
    }
    return publicUserDtoArray;
  }

  async isFriendship(user1_id: uuidv4, user2_id: uuidv4): Promise<boolean> {
    const existingFriendship = await Friends.findOne({
      where: {
        status: FriendStatus.Active,
        [Op.or]: [
          { sender_id: user1_id, receiver_id: user2_id },
          { sender_id: user2_id, receiver_id: user1_id },
        ],
      },
    });

    if (existingFriendship) return true;
    else return false;
  }

  async createDirectChannel(user1_id: uuidv4, user2_id: uuidv4) {
    if ((await this.checkId(user1_id)) === (await this.checkId(user2_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }

    const name = [
      await this.usersService.findById(user1_id),
      await this.usersService.findById(user2_id),
    ];

    try {
      const chan = await this.channelModel.create({
        chanName: name[0].login + ' & ' + name[1].login,
        ownerId: user1_id,
        chanType: ChanType.Direct,
        chanPassword: 'nannan',
        nbUser: 2,
      });

      await this.channelUsersModel.create({
        chanId: chan.chanId,
        userId: user1_id,
        userStatus: UserStatus.Direct,
      });
      await this.channelUsersModel.create({
        chanId: chan.chanId,
        userId: user2_id,
        userStatus: UserStatus.Direct,
      });
    } catch (error) {
      throw new HttpException(
        'createDirectChannel ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteDirectChannel(user1_id: uuidv4, user2_id: uuidv4) {
    if ((await this.checkId(user1_id)) === (await this.checkId(user2_id))) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }

    try {
      const usersChan = await this.channelUsersModel.findAll({
        where: {
          userStatus: UserStatus.Direct,
          [Op.or]: [{ userId: user1_id }, { userId: user2_id }],
        },
      });

      const channelIds: uuidv4[] = [];
      let chanId: uuidv4 = null;
      for (const userChan of usersChan) {
        if (channelIds.includes(userChan.chanId)) chanId = userChan.chanId;
        channelIds.push(userChan.chanId);
      }

      const chan = await Channels.findOne({ where: { chanId: chanId } });
      if (!chan) {
        return;
      }

      const chanUser1 = await this.channelUsersModel.findOne({
        where: {
          chanId: chan.chanId,
          userId: user1_id,
          userStatus: UserStatus.Direct,
        },
      });
      const chanUser2 = await this.channelUsersModel.findOne({
        where: {
          chanId: chan.chanId,
          userId: user2_id,
          userStatus: UserStatus.Direct,
        },
      });
      chan.destroy();
      if (chanUser1) chanUser1.destroy();
      if (chanUser2) chanUser2.destroy();
    } catch (error) {
      throw new HttpException(
        'deleteDirectChannel ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
