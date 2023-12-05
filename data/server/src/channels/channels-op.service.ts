import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { DestroyOptions } from 'sequelize/types';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { EditChannelDto } from './dto/editChannel.dto';
import { channelDto } from './dto/channel.dto';
import { User } from 'db/models/user';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { UsersService } from '../users/users.service';
import { ChannelsGetService } from '../channels/channels-get.service';
import { FriendsService } from '../friends/friends.service';

enum ChanType {
  Direct = 'Direct',
  Public = 'Public',
  Protected = 'Protected',
  Private = 'Private',
}

enum UserStatus {
  Direct = 'Direct',
  Owner = 'Owner',
  Admin = 'Admin',
  User = 'User',
  Muted = 'Muted',
  Banned = 'Banned',
  Invited = 'Invited',
}

// ---------- ADMIN
// POST addAdmin(current_id, chanId, userId): Promise<PublicUserDto> FIXME
// DELETE delAdmin(current_id, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- INVITE
// POST invite(current_id, chanId, userId): Promise<PublicUserDto> FIXME
// DELETE uninvite(current_id, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- BAN
// POST ban(current_id, chanId, userId): Promise<PublicUserDto> FIXME
// DELETE unban(current_id, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- MUTE
// PATCH mute(current_id, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- KICK
// DELETE kick(current_id, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- UTILS
// checkUserIds(current_id: uuidv4, userId: uuidv4) OK
// fetchPublicUserDto(id: uuidv4): Promise<PublicUserDto> OK

@Injectable()
export class ChannelsOpService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly channelsGetService: ChannelsGetService,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}


  // ---------- ADMIN
  async addAdmin(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO SET userId to admin

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delAdmin(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO UNSET userId to admin

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------   INVITE
  async invite(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO create invite for userId

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uninvite(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO remove invite for userId

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  // ---------- BAN
  async banUser(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO SET BAN for userId

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async unbanUser(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO UNSET BAN for userId

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  // ---------- MUTE
  // temps de mute 5 min / 1h / 3h
  async mute(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO MUTE for LIMITED TIME userId

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- KICK
  async kick(
    current_id: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.channelsGetService.checkId(chanId);
    this.checkUserIds(current_id, userId);

    // TODO check current_id is admin / owner of the channel

    try {
      // TODO KICK userId

      return this.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- UTILS
  async checkUserIds(current_id: uuidv4, userId: uuidv4) {
    if (
      this.friendsService.checkId(current_id) ===
      this.friendsService.checkId(userId)
    ) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }
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

}
