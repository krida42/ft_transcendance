import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { isUUID } from 'class-validator';
import { DestroyOptions } from 'sequelize/types';
import { uuidv4 } from 'src/types';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { EditChannelDto } from './dto/editChannel.dto';
import { channelDto } from './dto/channel.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { FriendsService } from '../friends/friends.service';
import { ChannelsGetService } from '../channels/channels-get.service';
import { BcryptService } from 'src/tools/bcrypt.service';

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

// POST createChannel(current_id, editChannelDto): Promise<channelDto> OK
// DELETE updateChannel(current_id, chanId, editChannelDto): Promise<channelDto> OK
// PATCH deleteChannel(current_id, chanId): Promise<channelDto> OK
// ---------- JOIN / QUIT
// joinChannel(current_id, chanId): Promise<channelDto> FIXME
// quitChannel(current_id, chanId): Promise<channelDto> FIXME
// ---------- UTILS
// fetchChannelDto(chanId: uuidv4): Promise<channelDto> OK

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly channelsGetService: ChannelsGetService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  async createChannel(
    current_id: uuidv4,
    editChannelDto: EditChannelDto,
  ): Promise<channelDto> {
    this.friendsService.checkId(current_id);

    const chan = await this.channelModel.findOne({
      where: { chanName: editChannelDto.chanName },
    });
    if (chan) {
      throw new HttpException('name already exist', HttpStatus.CONFLICT);
    }

    let pass = editChannelDto.chanPassword;
    if (pass == null || pass.length < 6) {
      if (editChannelDto.chanType == ChanType.Protected) {
        throw new HttpException(
          'password missing or too short: < 6 characters',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (editChannelDto.chanType == ChanType.Protected)
      pass = await BcryptService.hashPassword(pass);
    else pass = 'nannan';
    try {
      const chan = await this.channelModel.create({
        chanName: editChannelDto.chanName,
        ownerId: current_id,
        chanType: editChannelDto.chanType,
        chanPassword: pass,
        nbUser: 1,
      });

      await this.channelUsersModel.create({
        chanId: chan.chanId,
        userId: current_id,
        userStatus: UserStatus.Owner,
      });

      return this.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException('createChannel ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateChannel(
    current_id: uuidv4,
    chanId: uuidv4,
    editChannelDto: EditChannelDto,
  ): Promise<channelDto> {
    this.friendsService.checkId(current_id);

    const chan = await this.channelsGetService.findById(chanId);

    const chanTestName = await this.channelModel.findOne({
      where: {
        chanId: {
          [Op.not]: chanId,
        },
        chanName: editChannelDto.chanName,
      },
    });
    if (chanTestName) {
      throw new HttpException('name already exist', HttpStatus.CONFLICT);
    }

    if (
      editChannelDto.chanPassword == null &&
      editChannelDto.chanType == ChanType.Protected
    ) {
      throw new HttpException('password missing', HttpStatus.BAD_REQUEST);
    }

    if (!chan.chanPassword) {
      chan.chanPassword = 'nan';
    }

    if (editChannelDto.chanType == ChanType.Direct)
      throw new HttpException('invalid channel type', HttpStatus.BAD_REQUEST);

    const ownerChan = await this.channelUsersModel.findOne({
      where: {
        chanId: chanId,
        userId: current_id,
        userStatus: UserStatus.Owner,
      },
    });
    if (!ownerChan) throw new HttpException('not owner', HttpStatus.FORBIDDEN);

    try {
      chan.chanName = editChannelDto.chanName;
      chan.chanType = editChannelDto.chanType;
      chan.chanPassword = editChannelDto.chanPassword;
      // TODO BCRYPT PASSWORD
      await chan.save();
      return this.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException('createChannel ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteChannel(current_id: uuidv4, chanId: uuidv4): Promise<channelDto> {
    this.friendsService.checkId(current_id);

    const chan = await this.channelsGetService.findById(chanId);

    const ownerChan = await this.channelUsersModel.findOne({
      where: {
        chanId: chanId,
        userId: current_id,
        userStatus: UserStatus.Owner,
      },
    });
    if (!ownerChan) throw new HttpException('not owner', HttpStatus.FORBIDDEN);

    try {
      await this.channelUsersModel.destroy({
        where: { chanId: chanId },
      });

      const dto = this.fetchChannelDto(chan.chanId);
      await chan.destroy();
      return dto;
    } catch (error) {
      throw new HttpException('deleteChannel ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  // ----------   JOIN / QUIT CHANNEL

  async joinChannel(current_id: uuidv4, chanId: uuidv4): Promise<channelDto> {
    this.friendsService.checkId(current_id);

    const chan = await this.channelsGetService.findById(chanId);

    try {
      let user = await this.channelUsersModel.findOne({
        where: {
          chanId: chanId,
          userId: current_id,
          [Op.or]: [
            { userStatus: UserStatus.User },
            { userStatus: UserStatus.Muted },
            { userStatus: UserStatus.Admin },
            { userStatus: UserStatus.Owner },
            { userStatus: UserStatus.Banned },
          ],
        },
      });
      if (user) {
        if (user.userStatus == UserStatus.Banned) {
          throw new HttpException('you are banned', HttpStatus.FORBIDDEN);
        }
        throw new HttpException('already in channel', HttpStatus.BAD_REQUEST);
      }

      if (chan.chanType == ChanType.Private) {
        user = await this.channelUsersModel.findOne({
          where: {
            chanId: chanId,
            userId: current_id,
            userStatus: UserStatus.Invited,
          },
        });
        if (!user) {
          throw new HttpException('you need an invitation to join this channel', HttpStatus.FORBIDDEN);
        }
        user.userStatus = UserStatus.User;
        user.save();
        return this.fetchChannelDto(chan.chanId);
      }

      // TODO check ADD PASSWORD AS PARAMETER AND CHECK IF PROTECTED
      if (chan.chanType == ChanType.Protected) {
      }

      await this.channelUsersModel.create({
        chanId: chanId,
        userId: current_id,
        userStatus: UserStatus.User,
      });

      return this.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException('joinChannel ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async quitChannel(current_id: uuidv4, chanId: uuidv4): Promise<channelDto> {
    this.friendsService.checkId(current_id);

    const chan = await this.channelsGetService.findById(chanId);

    try {
      // TODO check current_id IS IN CHAN
      // TODO SET NEW OWNER if current_id is owner

      const destroyOptions: DestroyOptions = {
        where: {
          chanId: chanId,
          userId: current_id,
          [Op.or]: [
            { userStatus: UserStatus.User },
            { userStatus: UserStatus.Muted },
            { userStatus: UserStatus.Admin },
            { userStatus: UserStatus.Owner },
          ],
        },
      };
      await this.channelUsersModel.destroy(destroyOptions);

      const dto = this.fetchChannelDto(chan.chanId);
      // TODO DESTROY chanId if channel is empty
      return dto;
    } catch (error) {
      throw new HttpException('quitChannel ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  // ---------- UTILS

  async fetchChannelDto(chanId: uuidv4): Promise<channelDto> {
    const chan = await this.channelsGetService.findById(chanId);
    const dto = new channelDto(
      chan.chanId,
      chan.chanName,
      chan.chanType,
      chan.ownerId,
      chan.nbUser,
    );
    return dto;
  }
}
