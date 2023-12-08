import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { isUUID } from 'class-validator';
import { uuidv4 } from 'src/types';

import { Friends } from 'db/models/friends';
import { UsersService } from '../users/users.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';

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
// GET getSentRequests(current_id: uuidv4): Promise<PublicUserDto[]> OK
// GET getSentRequests(current_id: uuidv4): Promise<PublicUserDto[]> OK
// GET getFriends(current_id: uuidv4): Promise<PublicUserDto[]> OK
// GET getBlocked(current_id: uuidv4): Promise<PublicUserDto[]> OK

// ---------- UTILS
// checkId(id: uuidv4): Promise<uuidv4> OK
// friendExists(user1_id: uuidv4, user2_id: uuidv4): Promise<boolean> OK
// getFriendship(user1_id: uuidv4, user2_id: uuidv4): Promise<Friends> OK
// youBlockIt(you_id: uuidv4, it_id: uuidv4): Promise<boolean> OK
// heBlockYou(you_id: uuidv4, it_id: uuidv4): Promise<boolean> OK
// isBlocked(you_id: uuidv4, he_id: uuidv4): Promise<boolean> OK
// fetchPublicUserDto(id: uuidv4): Promise<PublicUserDto> OK
// fetchUserDtoArrayFor(current_id: uuidv4, all: Friends[]): Promise<PublicUserDto[]> OK

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends)
    private readonly friendsModel: typeof Friends,
    private readonly usersService: UsersService,
  ) {}

  async createFriend(
    sender_id: uuidv4,
    receiver_id: uuidv4,
  ): Promise<PublicUserDto> {
    if (this.checkId(sender_id) === this.checkId(receiver_id)) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    if (await this.friendExists(sender_id, receiver_id)) {
      throw new HttpException('already added', HttpStatus.CONFLICT);
    }
    if (await this.youBlockIt(sender_id, receiver_id)) {
      throw new HttpException('you blocked this user', HttpStatus.CONFLICT);
    }
    if (await this.heBlockYou(sender_id, receiver_id)) {
      // TEMP
      throw new HttpException('this user has blocked you', HttpStatus.CONFLICT);
    }
    try {
      await this.friendsModel.create({
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: FriendStatus.Pending,
      });
      return this.fetchPublicUserDto(receiver_id);
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
    if (this.checkId(sender_id) === this.checkId(receiver_id)) {
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
    return this.fetchPublicUserDto(sender_id);
  }

  async deleteFriend(
    current_id: uuidv4,
    friend_id: uuidv4,
  ): Promise<PublicUserDto> {
    if (this.checkId(current_id) === this.checkId(friend_id)) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    const friendship = await this.getFriendship(current_id, friend_id);
    if (!friendship) {
      throw new HttpException('relation not found', HttpStatus.NOT_FOUND);
    }
    await friendship.destroy();
    return this.fetchPublicUserDto(friend_id);
  }

  // ---------- BLOCK / UNBLOCK

  async blockFriend(
    sender_id: uuidv4,
    receiver_id: uuidv4,
  ): Promise<PublicUserDto> {
    if (this.checkId(sender_id) === this.checkId(receiver_id)) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    if (await this.youBlockIt(sender_id, receiver_id))
      throw new HttpException('user already blocked', HttpStatus.CONFLICT);

    try {
      let friendship = await this.getFriendship(sender_id, receiver_id);
      if (friendship) {
        friendship.sender_id = sender_id;
        friendship.receiver_id = receiver_id;
        friendship.status = FriendStatus.Blocked;
        await friendship.save();
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
    return this.fetchPublicUserDto(receiver_id);
  }

  async unblockFriend(
    sender_id: uuidv4,
    receiver_id: uuidv4,
  ): Promise<PublicUserDto> {
    if (this.checkId(sender_id) === this.checkId(receiver_id)) {
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
      throw new HttpException('user not blocked', HttpStatus.BAD_REQUEST);
    else await youBlock.destroy();
    return this.fetchPublicUserDto(receiver_id);
  }

  // ---------- GET

  async getSentRequests(current_id: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(current_id);

    const all = await Friends.findAll({
      where: {
        sender_id: current_id,
        status: FriendStatus.Pending,
      },
    });
    return this.fetchUserDtoArrayFor(current_id, all);
  }

  async getReceivedRequests(current_id: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(current_id);

    const all = await Friends.findAll({
      where: {
        receiver_id: current_id,
        status: FriendStatus.Pending,
      },
    });
    return this.fetchUserDtoArrayFor(current_id, all);
  }

  async getFriends(current_id: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(current_id);
    const all = await Friends.findAll({
      where: {
        [Op.or]: [{ sender_id: current_id }, { receiver_id: current_id }],
        status: FriendStatus.Active,
      },
    });
    return this.fetchUserDtoArrayFor(current_id, all);
  }

  async getBlocked(current_id: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(current_id);
    const all = await Friends.findAll({
      where: {
        sender_id: current_id,
        status: FriendStatus.Blocked,
      },
    });
    return this.fetchUserDtoArrayFor(current_id, all);
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
    return this.youBlockIt(you_id, he_id) || this.heBlockYou(you_id, he_id);
  }

  async fetchPublicUserDto(id: uuidv4): Promise<PublicUserDto> {
    const user = await this.usersService.findById(id);
    const publicUserDto = new PublicUserDto(
      user.public_id,
      user.pseudo,
      user.login,
      user.avatar,
    );
    return publicUserDto;
  }

  async fetchUserDtoArrayFor(
    current_id: uuidv4,
    all: Friends[],
  ): Promise<PublicUserDto[]> {
    const publicUserDtoArray: PublicUserDto[] = [];
    for (const relation of all) {
      let other_user = await this.usersService.findById(relation.sender_id);
      if (relation.sender_id === current_id) {
        other_user = await this.usersService.findById(relation.receiver_id);
      }
      const publicUserDto = new PublicUserDto(
        other_user.public_id,
        other_user.pseudo,
        other_user.login,
        other_user.avatar,
      );
      publicUserDtoArray.push(publicUserDto);
    }
    return publicUserDtoArray;
  }
}
