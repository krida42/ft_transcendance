import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Friends } from 'db/models/friends';
import {
  ImpossibleRelationException,
  FriendAlreadyExistsException,
  RelationNotFoundException,
  AlreadyBlockedException,
} from 'src/exceptions/exceptions1';

import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { isUUID } from 'class-validator';

enum FriendStatus {
  Pending = 'Pending',
  Active = 'Active',
  Blocked = 'Blocked',
}

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends)
    private readonly friendsModel: typeof Friends,

    private readonly usersService: UsersService,
  ) {}

  async checkId(id: uuidv4): Promise<uuidv4> {
    if (!id) {
      throw new HttpException('null uuidv4', HttpStatus.BAD_REQUEST);
    }
    if (!isUUID(id, 4)) {
      throw new HttpException('format uuidv4', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException('invalid uuidv4', HttpStatus.BAD_REQUEST);
    }
    return id;
  }

  async newPublicUserDto(id: uuidv4): Promise<PublicUserDto> {
    const user = await this.usersService.findById(id);
    const publicUserDto = new PublicUserDto(
      user.public_id,
      user.pseudo,
      user.login,
      user.avatar,
    );
    return publicUserDto;
  }

  async createFriendRequest(
    sender_id: uuidv4,
    receiver_id: uuidv4,
  ): Promise<PublicUserDto> {
    if (this.checkId(sender_id) === this.checkId(receiver_id)) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
    if (await this.friendExists(sender_id, receiver_id)) {
      throw new HttpException('already added', HttpStatus.CONFLICT);
    }
    try {
      await this.friendsModel.create({
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: FriendStatus.Pending,
      });
      return this.newPublicUserDto(receiver_id);
    } catch (error) {
      throw new HttpException('createFriend: ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async acceptFriendRequest(
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
    return this.newPublicUserDto(sender_id);
  }

  async declineFriendRequest(
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
      throw new RelationNotFoundException();
    }
    if (pendingFriend.status === FriendStatus.Active) {
      throw new FriendAlreadyExistsException();
    }
    await pendingFriend.destroy();
    return this.newPublicUserDto(sender_id);
  }

  async cancelFriendRequest(
    sender_id: uuidv4,
    receiver_id: uuidv4,
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
      throw new RelationNotFoundException();
    }
    if (pendingFriend.status === FriendStatus.Active) {
      throw new FriendAlreadyExistsException();
    }
    await pendingFriend.destroy();
    return this.newPublicUserDto(sender_id);
  }

  async blockFriend(login: uuidv4, linkedlogin: uuidv4) {
    const existingFriend = await this.friendsModel.findOne({
      where: {
        login: login,
        linkedlogin: linkedlogin,
      },
    });

    if (existingFriend) {
      // destroy la relation mirroir si elle existe et est active
      if (existingFriend.status === FriendStatus.Active) {
        const mirrorRelation = await this.friendsModel.findOne({
          where: {
            login: linkedlogin,
            linkedlogin: login,
            status: FriendStatus.Active,
          },
        });

        if (mirrorRelation) {
          await mirrorRelation.destroy();
        }
      }
    }

    // si la relation n'existe pas deja on la cree
    if (!existingFriend) {
      try {
        const newBlock = await this.friendsModel.create({
          login: login,
          linkedlogin: linkedlogin,
          status: FriendStatus.Blocked,
        });
        return 'La relation a été bloquée avec succès.';
      } catch (error) {
        throw new Error('blockFriend error: ' + error.message);
      }
    }

    // si deja bloque on fais rien
    if (existingFriend.status === FriendStatus.Blocked) {
      throw new AlreadyBlockedException();
    }

    existingFriend.status = FriendStatus.Blocked;
    await existingFriend.save();
    return 'La relation a été bloquée avec succès.';
  }

  async deleteFriend(login: uuidv4, linkedlogin: uuidv4): Promise<string> {
    const existingFriend = await this.friendsModel.findOne({
      where: {
        login: login,
        linkedlogin: linkedlogin,
      },
    });

    if (!existingFriend) {
      throw new RelationNotFoundException();
    }
    // on destroy la relation si elle existe
    await existingFriend.destroy();

    // destroy la relation mirroir si elle existe et n'est pas 'Blocked'
    const mirrorRelation = await this.friendsModel.findOne({
      where: {
        login: linkedlogin,
        linkedlogin: login,
      },
    });

    if (mirrorRelation && mirrorRelation.status != FriendStatus.Blocked) {
      await mirrorRelation.destroy();
    }

    return 'La relation a été supprimée avec succès.';
  }

  async getSentRequests(current_id: uuidv4): Promise<PublicUserDto[]> {
    const all = await Friends.findAll({
      where: {
        sender_id: current_id,
        status: FriendStatus.Pending,
      },
    });

    const publicUserDtoArray: PublicUserDto[] = [];
    for (const relation of all) {
      const receiver_user = await this.usersService.findById(
        relation.receiver_id,
      );
      const publicUserDto = new PublicUserDto(
        receiver_user.public_id,
        receiver_user.pseudo,
        receiver_user.login,
        receiver_user.avatar,
      );
      publicUserDtoArray.push(publicUserDto);
    }
    return publicUserDtoArray;
  }

  async getReceivedRequests(current_id: uuidv4): Promise<PublicUserDto[]> {
    const all = await Friends.findAll({
      where: {
        receiver_id: current_id,
        status: FriendStatus.Pending,
      },
    });

    const publicUserDtoArray: PublicUserDto[] = [];
    for (const relation of all) {
      const sender_user = await this.usersService.findById(relation.sender_id);
      const publicUserDto = new PublicUserDto(
        sender_user.public_id,
        sender_user.pseudo,
        sender_user.login,
        sender_user.avatar,
      );
      publicUserDtoArray.push(publicUserDto);
    }
    return publicUserDtoArray;
  }

  async getFriends(current_id: uuidv4): Promise<PublicUserDto[]> {
    const all = await Friends.findAll({
      where: {
        sender_id: current_id,
        status: FriendStatus.Active,
      },
    });

    const publicUserDtoArray: PublicUserDto[] = [];
    for (const relation of all) {
      const receiver_user = await this.usersService.findById(
        relation.receiver_id,
      );
      const publicUserDto = new PublicUserDto(
        receiver_user.public_id,
        receiver_user.pseudo,
        receiver_user.login,
        receiver_user.avatar,
      );
      publicUserDtoArray.push(publicUserDto);
    }
    return publicUserDtoArray;
  }

  async getBlocked(current_id: uuidv4): Promise<PublicUserDto[]> {
    const all = await Friends.findAll({
      where: {
        sender_id: current_id,
        status: FriendStatus.Blocked,
      },
    });

    const publicUserDtoArray: PublicUserDto[] = [];
    for (const relation of all) {
      const receiver_user = await this.usersService.findById(
        relation.receiver_id,
      );
      const publicUserDto = new PublicUserDto(
        receiver_user.public_id,
        receiver_user.pseudo,
        receiver_user.login,
        receiver_user.avatar,
      );
      publicUserDtoArray.push(publicUserDto);
    }
    return publicUserDtoArray;
  }

  async friendExists(user1_id: uuidv4, user2_id: uuidv4): Promise<boolean> {
    const existingFriendship = await Friends.findOne({
      where: {
        [Op.or]: [
          { sender_id: user1_id, receiver_id: user2_id },
          { sender_id: user2_id, receiver_id: user1_id },
        ],
      },
    });

    if (existingFriendship) {
      return true;
    }
    return false;
  }

  async hardDelete(current_id: uuidv4): Promise<string> {
    try {
      const deletedEntries = await Friends.destroy({
        where: {
          [Op.or]: [{ sender_id: current_id }, { receiver_id: current_id }],
        },
      });

      return `${deletedEntries} entries with ${current_id} were deleted.`;
    } catch (error) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
  }
}
