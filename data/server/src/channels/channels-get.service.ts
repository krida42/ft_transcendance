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

// ---------- GET CHANNEL DATA
// GET getDataChan(chanId: uuidv4): Promise<channelDto> OK

// ---------- GET CHANNELS LIST (Sorted by user size)
// GET getJoinedChan(current_id: uuidv4): Promise<channelDto[]> OK
// GET getDirectChan(current_id: uuidv4): Promise<channelDto[]> OK
// GET getUnjoinedChan(current_id: uuidv4, chanType: ChanType): Promise<channelDto[]> OK

// ---------- GET USERS LIST
// GET getUsersChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getUsersOnlyChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getMutesChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getAdminsChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getInvitesChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getBansChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getOwnerChan(chanId: uuidv4): Promise<PublicUserDto[]> OK

// ---------- UTILS
// checkId(id: uuidv4): Promise<uuidv4> OK
// findById(chanId: uuidv4): Promise<Channels> OK
// fetchChannelDto(chanId: uuidv4): Promise<channelDto> OK
// fetchChannelDtoArray(all: Channels[]): Promise<channelDto[]> OK
// fetchChanUsersToChanDtoArray(all: ChannelsUsers[]): Promise<channelDto[]> OK

@Injectable()
export class ChannelsGetService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  // ---------- GET CHANNEL DATA
  async getDataChan(chanId: uuidv4): Promise<channelDto> {
    return this.fetchChannelDto(chanId);
    // TODO add image
  }

  // ---------- GET CHANNELS LIST (Sorted by user size)
  USERS_STATUS_IN_CHANNEL = [
    UserStatus.User,
    UserStatus.Muted,
    UserStatus.Admin,
    UserStatus.Owner,
  ];

  async getJoinedChan(current_id: uuidv4): Promise<channelDto[]> {
    this.friendsService.checkId(current_id);

    const userChannels = await this.channelUsersModel.findAll({
      where: {
        userId: current_id,
        userStatus: { [Op.in]: [this.USERS_STATUS_IN_CHANNEL] },
      },
    });
    return this.fetchChanUsersToChanDtoArray(userChannels);
  }

  async getDirectChan(current_id: uuidv4): Promise<channelDto[]> {
    this.friendsService.checkId(current_id);

    const userChannels = await this.channelUsersModel.findAll({
      where: {
        userId: current_id,
        userStatus: UserStatus.Direct,
      },
    });
    return this.fetchChanUsersToChanDtoArray(userChannels);
  }

  async getUnjoinedChan(
    current_id: uuidv4,
    chanType: ChanType,
  ): Promise<channelDto[]> {
    this.friendsService.checkId(current_id);

    // public channels ids
    const pubChan = await this.channelModel.findAll({
      where: { chanType: chanType },
    });
    const pubChanIds = pubChan.map((pubChan) => pubChan.chanId);

    // current user channels joined ids
    const userChan = await this.channelUsersModel.findAll({
      where: {
        userId: current_id,
        userStatus: { [Op.in]: [this.USERS_STATUS_IN_CHANNEL] },
      },
    });
    const userChanIds = userChan.map((userChan) => userChan.chanId);

    // unjoined public ids
    const availableChanIds = pubChanIds.filter(
      (id) => !userChanIds.includes(id),
    );

    const availableChannels = await Channels.findAll({
      where: { chanId: availableChanIds },
    });
    return this.fetchChannelDtoArray(availableChannels);
  }

  // ---------- GET USERS LIST

  async getUsersChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: { [Op.in]: [this.USERS_STATUS_IN_CHANNEL] },
      },
    });
    return this.fetchUserDtoArray(userChan);
  }

  async getUsersOnlyChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        [Op.or]: [
          { userStatus: UserStatus.User },
          { userStatus: UserStatus.Muted },
        ],
      },
    });
    return this.fetchUserDtoArray(userChan);
  }

  async getMutesChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Muted,
      },
    });
    return this.fetchUserDtoArray(userChan);
  }

  async getAdminsChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        [Op.or]: [
          { userStatus: UserStatus.Admin },
          { userStatus: UserStatus.Owner },
        ],
      },
    });
    return this.fetchUserDtoArray(userChan);
  }

  async getInvitesChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Invited,
      },
    });
    return this.fetchUserDtoArray(userChan);
  }

  async getBansChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Banned,
      },
    });
    return this.fetchUserDtoArray(userChan);
  }

  async getOwnerChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Owner,
      },
    });
    return this.fetchUserDtoArray(userChan);
  }


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

  async checkId(id: uuidv4): Promise<uuidv4> {
    if (!id) {
      throw new HttpException('null uuidv4', HttpStatus.BAD_REQUEST);
    }
    if (!isUUID(id, 4)) {
      throw new HttpException('format uuidv4', HttpStatus.BAD_REQUEST);
    }
    const chan = await Channels.findOne({ where: { chanId: id } });
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

}
