import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { isUUID } from 'class-validator';
import { uuidv4 } from 'src/types';
import { DestroyOptions } from 'sequelize/types';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { EditChannelDto } from './dto/editChannel.dto';
import { channelDto } from './dto/channel.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { FriendsService } from '../friends/friends.service';
import { ChannelsUtilsService } from './channels-utils.service';

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
// GET getJoinedChan(currentId: uuidv4): Promise<channelDto[]> OK
// GET getDirectChan(currentId: uuidv4): Promise<channelDto[]> OK
// GET getUnjoinedChan(currentId: uuidv4, chanType: ChanType): Promise<channelDto[]> OK

// ---------- GET USERS LIST
// GET getUsersChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getUsersOnlyChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getMutesChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getAdminsChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getInvitesChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getBansChan(chanId: uuidv4): Promise<PublicUserDto[]> OK
// GET getOwnerChan(chanId: uuidv4): Promise<PublicUserDto[]> OK

@Injectable()
export class ChannelsGetService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly utils: ChannelsUtilsService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  // ---------- GET CHANNEL DATA
  async getDataChan(chanId: uuidv4): Promise<channelDto> {
    return this.utils.fetchChannelDto(chanId);
    // TODO add image
  }

  // ---------- GET CHANNELS LIST (Sorted by user size)

  async getJoinedChan(currentId: uuidv4): Promise<channelDto[]> {
    this.friendsService.checkId(currentId);

    const userChannels = await this.channelUsersModel.findAll({
      where: {
        userId: currentId,
        [Op.or]: [
          { userStatus: UserStatus.User },
          { userStatus: UserStatus.Muted },
          { userStatus: UserStatus.Admin },
          { userStatus: UserStatus.Owner },
        ],
      },
    });
    return this.utils.fetchChanUsersToChanDtoArray(userChannels);
  }

  async getDirectChan(currentId: uuidv4): Promise<channelDto[]> {
    this.friendsService.checkId(currentId);

    const userChannels = await this.channelUsersModel.findAll({
      where: {
        userId: currentId,
        userStatus: UserStatus.Direct,
      },
    });
    return this.utils.fetchChanUsersToChanDtoArray(userChannels);
  }

  async getUnjoinedChan(
    currentId: uuidv4,
    chanType: ChanType,
  ): Promise<channelDto[]> {
    this.friendsService.checkId(currentId);

    // public channels ids
    const pubChan = await this.channelModel.findAll({
      where: { chanType: chanType },
    });
    const pubChanIds = pubChan.map((pubChan) => pubChan.chanId);

    // current user channels joined ids
    const userChan = await this.channelUsersModel.findAll({
      where: {
        userId: currentId,
        [Op.or]: [
          { userStatus: UserStatus.User },
          { userStatus: UserStatus.Muted },
          { userStatus: UserStatus.Admin },
          { userStatus: UserStatus.Owner },
        ],
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
    return this.utils.fetchChannelDtoArray(availableChannels);
  }

  // ---------- GET USERS LIST

  async getUsersChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    const userStatuses = [
      UserStatus.User,
      UserStatus.Muted,
      UserStatus.Admin,
      UserStatus.Owner,
    ];
    return this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  async getUsersOnlyChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    const userStatuses = [UserStatus.User, UserStatus.Muted];
    return this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  async getMutesChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    const userStatuses = [UserStatus.Muted];
    return this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  async getAdminsChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    const userStatuses = [UserStatus.Admin, UserStatus.Owner];
    return this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  async getInvitesChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    const userStatuses = [UserStatus.Invited];
    return this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  async getBansChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    const userStatuses = [UserStatus.Banned];
    return this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  async getOwnerChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    const userStatuses = [UserStatus.Owner];
    return this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  // ---------- GET USERS LIST DEPR

  /* DEPRECATED
  async getUsersChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.utils.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        [Op.or]: [
          { userStatus: UserStatus.User },
          { userStatus: UserStatus.Muted },
          { userStatus: UserStatus.Admin },
          { userStatus: UserStatus.Owner },
        ],
      },
    });
    return this.utils.fetchUserDtoArray(userChan);
  }
  */

  /* DEPRECATED
  async getUsersOnlyChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.utils.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        [Op.or]: [
          { userStatus: UserStatus.User },
          { userStatus: UserStatus.Muted },
        ],
      },
    });
    return this.utils.fetchUserDtoArray(userChan);
  }
  */

  /* DEPRECATED
  async getMutesChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.utils.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Muted,
      },
    });
    return this.utils.fetchUserDtoArray(userChan);
  }
  */

  /* DEPRECATED
  async getAdminsChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.utils.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        [Op.or]: [
          { userStatus: UserStatus.Admin },
          { userStatus: UserStatus.Owner },
        ],
      },
    });
    return this.utils.fetchUserDtoArray(userChan);
  }
  */

  /* DEPRECATED
  async getInvitesChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.utils.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Invited,
      },
    });
    return this.utils.fetchUserDtoArray(userChan);
  }
  */

  /* DEPRECATED
  async getBansChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.utils.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Banned,
      },
    });
    return this.utils.fetchUserDtoArray(userChan);
  }
  */

  /* DEPRECATED
  async getOwnerChan(chanId: uuidv4): Promise<PublicUserDto[]> {
    this.utils.checkId(chanId);

    const userChan = await this.channelUsersModel.findAll({
      where: {
        chanId: chanId,
        userStatus: UserStatus.Owner,
      },
    });
    return this.utils.fetchUserDtoArray(userChan);
  }
  */

}
