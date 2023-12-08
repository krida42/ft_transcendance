import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { isUUID } from 'class-validator';
import { DestroyOptions } from 'sequelize/types';

import { uuidv4 } from 'src/types';
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { channelDto } from './dto/channel.dto';
import { UsersService } from '../users/users.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
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

// ---------- UTILS
// checkId(id: uuidv4): Promise<uuidv4> OK
// findById(chanId: uuidv4): Promise<Channels> OK
// fetchChannelDto(chanId: uuidv4): Promise<channelDto> OK
// fetchChannelDtoArray(all: Channels[]): Promise<channelDto[]> OK
// fetchChanUsersToChanDtoArray(all: ChannelsUsers[]): Promise<channelDto[]> OK
// userIs(status: UserStatus, currentId: uuidv4, chanId: uuidv4): Promise<boolean> OK
// userIsInChannel(currentId, chanId): Promise<boolean> OK
// getUserInChannel(currentId, chanId): Promise<ChannelsUsers> OK
// checkOwner(currentId, chanId) OK
// getUsersByStatuses(chanId, userStatuses: string[]): Promise<PublicUserDto[]> OK
// checkUserIds(currentId: uuidv4, userId: uuidv4) OK
// fetchPublicUserDto(id: uuidv4): Promise<PublicUserDto> OK

@Injectable()
export class ChannelsUtilsService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  // ---------- UTILS

  async fetchUserDtoArray(userChan: ChannelsUsers[]): Promise<PublicUserDto[]> {
    const userIds = userChan.map((userChan) => userChan.userId);
    const users = await this.usersService.findByIds(userIds);
    const publicUserDtoArray: PublicUserDto[] = [];
    for (const user of users) {
      const publicUserDto = new PublicUserDto(
        user.public_id,
        user.pseudo,
        user.login,
        user.avatar,
      );
      publicUserDtoArray.push(publicUserDto);
    }
    return publicUserDtoArray;
  }

  async checkId(chanId: uuidv4) {
    if (!chanId) {
      throw new HttpException('null uuidv4', HttpStatus.BAD_REQUEST);
    }
    if (!isUUID(chanId, 4)) {
      throw new HttpException('format uuidv4', HttpStatus.BAD_REQUEST);
    }
    const chan = await Channels.findOne({ where: { chanId: chanId } });
    if (!chan) {
      throw new HttpException('channel uuidv4 not found', HttpStatus.NOT_FOUND);
    }
  }

  async findById(chanId: uuidv4): Promise<Channels> {
    const chan = await Channels.findOne({ where: { chanId: chanId } });
    if (!chan) {
      throw new HttpException('channel not found', HttpStatus.NOT_FOUND);
    }
    return chan;
  }

  async fetchChannelDto(chanId: uuidv4): Promise<channelDto> {
    const chan = await this.findById(chanId);
    const dto = new channelDto(
      chan.chanId,
      chan.chanName,
      chan.chanType,
      chan.ownerId,
      chan.nbUser,
    );
    return dto;
  }

  async fetchChannelDtoArray(all: Channels[]): Promise<channelDto[]> {
    all.sort((a, b) => b.nbUser - a.nbUser);
    const channelDtoArray: channelDto[] = [];
    for (const chan of all) {
      const dto = new channelDto(
        chan.chanId,
        chan.chanName,
        chan.chanType,
        chan.ownerId,
        chan.nbUser,
      );
      channelDtoArray.push(dto);
    }
    return channelDtoArray;
  }

  async fetchChanUsersToChanDtoArray(
    all: ChannelsUsers[],
  ): Promise<channelDto[]> {
    const channelIds = all.map((userChannel) => userChannel.chanId);
    const channels = await Channels.findAll({ where: { chanId: channelIds } });
    return this.fetchChannelDtoArray(channels);
  }

  // status: ('Direct', 'Owner', 'Admin', 'User', 'Muted', 'Banned', 'Invited'),
  async userIs(
    status: UserStatus,
    currentId: uuidv4,
    chanId: uuidv4,
  ): Promise<boolean> {
    const user = await this.channelUsersModel.findOne({
      where: {
        chanId: chanId,
        userId: currentId,
        userStatus: status,
      },
    });
    return !!user;
  }

  async userIsInChannel(currentId: uuidv4, chanId: uuidv4): Promise<boolean> {
    const chanUser = await this.channelUsersModel.findOne({
      where: {
        chanId: chanId,
        userId: currentId,
        [Op.or]: [
          { userStatus: UserStatus.User },
          { userStatus: UserStatus.Muted },
          { userStatus: UserStatus.Admin },
          { userStatus: UserStatus.Owner },
        ],
      },
    });
    if (!chanUser) return false;
    return true;
  }

  async getUserInChannel(
    currentId: uuidv4,
    chanId: uuidv4,
  ): Promise<ChannelsUsers> {
    const chanUser = await this.channelUsersModel.findOne({
      where: {
        chanId: chanId,
        userId: currentId,
        [Op.or]: [
          { userStatus: UserStatus.User },
          { userStatus: UserStatus.Muted },
          { userStatus: UserStatus.Admin },
          { userStatus: UserStatus.Owner },
        ],
      },
    });
    if (!chanUser)
      throw new HttpException(
        'getUserInChannel *should never append*',
        HttpStatus.BAD_REQUEST,
      );
    return chanUser;
  }

  async checkOwner(currentId: uuidv4, chanId: uuidv4) {
    if (false == (await this.userIs(UserStatus.Owner, currentId, chanId)))
      throw new HttpException('you are not owner', HttpStatus.FORBIDDEN);
  }

  async getUsersByStatuses(
    chanId: uuidv4,
    userStatuses: string[],
  ): Promise<PublicUserDto[]> {
    this.checkId(chanId);
    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: {
          [Op.in]: userStatuses,
        },
      },
    });
    return this.fetchUserDtoArray(userChan);
  }

  async checkUserIds(currentId: uuidv4, userId: uuidv4) {
    if (
      this.friendsService.checkId(currentId) ===
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
