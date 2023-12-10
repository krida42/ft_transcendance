import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { uuidv4, ChanType, UserStatus } from 'src/types';
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { channelDto } from './dto/channel.dto';
import { UsersService } from '../users/users.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { FriendsService } from '../friends/friends.service';
import { ChannelsUtilsService } from './channels-utils.service';

// ---------- GET CHANNEL DATA
// GET getDataChan(chanId): Promise< channelDto > OK

// ---------- GET CHANNELS LIST (Sorted by user size)
// GET getJoinedChan(currentUserId): Promise< channelDto[] > OK
// GET getDirectChan(currentUserId): Promise< channelDto[] > OK
// GET getUnjoinedChan(currentUserId, chanType): Promise< channelDto[] > OK

// ---------- GET USERS LIST
// GET get...(chanId): Promise< PublicUserDto[] >
// GET getUsersChan(chanId): Promise< PublicUserDto[] > OK
// GET getUsersOnlyChan(chanId): Promise< PublicUserDto[] > OK
// GET getMutesChan(chanId): Promise< PublicUserDto[] > OK
// GET getAdminsChan(chanId): Promise< PublicUserDto[] > OK
// GET getInvitesChan(chanId): Promise< PublicUserDto[] > OK
// GET getBansChan(chanId): Promise< PublicUserDto[] > OK
// GET getOwnerChan(chanId): Promise< PublicUserDto[] > OK

@Injectable()
export class ChannelsGetService {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly utils: ChannelsUtilsService,
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  // ---------- GET CHANNEL DATA
  async getDataChan(chanId: uuidv4): Promise<channelDto> {
    return this.utils.fetchChannelDto(chanId); // TODO add image
  }

  // ---------- GET CHANNELS LIST (Sorted by user size)

  async getJoinedChan(currentId: uuidv4): Promise<channelDto[]> {
    await this.friendsService.checkId(currentId);

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
    await this.friendsService.checkId(currentId);

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
    await this.friendsService.checkId(currentId);

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

}
