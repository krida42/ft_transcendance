import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { DestroyOptions } from 'sequelize/types';

import { uuidv4 } from 'src/types';
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { EditChannelDto } from './dto/editChannel.dto';
import { channelDto } from './dto/channel.dto';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { UsersService } from '../users/users.service';
import { ChannelsGetService } from '../channels/channels-get.service';
import { ChannelsUtilsService } from './channels-utils.service';
import { FriendsService } from '../friends/friends.service';

enum BadMsg {
  createChannel = 'cc:', // TODO
}

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
// POST addAdmin(currentId, chanId, userId): Promise<PublicUserDto> FIXME
// DELETE delAdmin(currentId, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- INVITE
// POST invite(currentId, chanId, userId): Promise<PublicUserDto> FIXME
// DELETE uninvite(currentId, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- BAN
// POST ban(currentId, chanId, userId): Promise<PublicUserDto> FIXME
// DELETE unban(currentId, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- MUTE
// PATCH mute(currentId, chanId, userId): Promise<PublicUserDto> FIXME

// ---------- KICK
// DELETE kick(currentId, chanId, userId): Promise<PublicUserDto> FIXME

@Injectable()
export class ChannelsOpService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly channelsGetService: ChannelsGetService,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly utils: ChannelsUtilsService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  // ---------- ADMIN
  async addAdmin(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);

    // TODO check currentId is admin / owner of the channel

    try {
      // TODO SET userId to admin

      return this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delAdmin(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);

    // TODO check currentId is admin / owner of the channel

    try {
      // TODO UNSET userId to admin

      return this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------   INVITE
  async invite(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);

    // TODO check currentId is admin / owner of the channel

    try {
      // TODO create invite for userId

      return this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uninvite(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);

    // TODO check currentId is admin / owner of the channel

    try {
      // TODO remove invite for userId

      return this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- BAN
  async banUser(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);
    // check owner or admin

    if (await this.utils.userIs(UserStatus.Owner, userId, chanId))
      throw new HttpException('owner cannot be banned', HttpStatus.FORBIDDEN);

    const chan = await this.utils.findById(chanId);

    try {
      if (await this.utils.userIsInChannel(userId, chanId)) {
        let user = await this.utils.getUserInChannel(userId, chanId);
        user.userStatus = UserStatus.Banned;
        user.save();
      } else {
        await this.channelUsersModel.create({
          chanId: chan.chanId,
          userId: userId,
          userStatus: UserStatus.Banned,
        });
      }

      return this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException('banUser ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async unbanUser(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);
    // TODO check owner or admin

    const chan = await this.utils.findById(chanId);

    try {
      if (await this.utils.userIs(UserStatus.Banned, userId, chanId)) {
        let user = await this.utils.getUserInChannel(userId, chanId);
        user.userStatus = UserStatus.User;
        user.save();
        return this.utils.fetchPublicUserDto(userId);
      } else {
        throw new HttpException('user not ban', HttpStatus.BAD_REQUEST);
      }
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
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);

    // TODO check currentId is admin / owner of the channel

    try {
      // TODO MUTE for LIMITED TIME userId

      return this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- KICK
  async kick(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    this.utils.checkId(chanId);
    this.utils.checkUserIds(currentId, userId);

    // TODO check currentId is admin / owner of the channel

    try {
      // TODO KICK userId

      return this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        'createFriendRequest ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
