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

// POST createChannel(current_id, editChannelDto): Promise<channelDto> FIXME
// DELETE updateChannel(current_id, chanId, editChannelDto): Promise<channelDto> FIXME
// PATCH deleteChannel(current_id, chanId): Promise<channelDto> FIXME
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

  USERS_STATUS_IN_CHANNEL = [
    UserStatus.User,
    UserStatus.Muted,
    UserStatus.Admin,
    UserStatus.Owner,
  ];

  async createChannel(
    current_id: uuidv4,
    editChannelDto: EditChannelDto,
  ): Promise<channelDto> {
    this.friendsService.checkId(current_id);

    // console.log('-----------------------createChannel', editChannelDto);

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
          'password missing or too short',
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


      /*
      await this.channelUsersModel.create({
        chanId: chan.chanId,
        userId: current_id,
        userStatus: UserStatus.Owner,
      });
      */

      return;
      //return this.fetchChannelDto(chan);

    } catch (error) {
      throw new HttpException('createChannel ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  /*

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

    // TODO check current_id is OWNER of the channel

    try {
      chan.chanName = editChannelDto.chanName;
      chan.chanType = editChannelDto.chanType;
      chan.chanPassword = editChannelDto.chanPassword;
      // TODO BCRYPT PASSWORD
      await chan.save();
      return this.fetchChannelDto(chan);
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
    if (!ownerChan)
      throw new HttpException('not owner', HttpStatus.BAD_REQUEST);

    try {
      // TODO DELETE ALL USERSCHANNEL with chanId

      const dto = this.fetchChannelDto(chan);
      await chan.destroy();
      return dto;
    } catch (error) {
      throw new HttpException('createChannel ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  // ----------   JOIN / QUIT CHANNEL

  async joinChannel(current_id: uuidv4, chanId: uuidv4): Promise<channelDto> {
    this.friendsService.checkId(current_id);

    const chan = await this.channelsGetService.findById(chanId);

    try {
      // TODO check current_id NOT IN CHAN
      // TODO check current_id NOT BANNED
      // TODO check PASSWORD IF PROTECTED
      // TODO check current_id is INVITED IF PRIVATE

      await this.channelUsersModel.create({
        chanId: chanId,
        userId: current_id,
        userStatus: UserStatus.User,
      });

      return this.fetchChannelDto(chan);
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
          userStatus: { [Op.in]: [this.USERS_STATUS_IN_CHANNEL] },
        },
      };
      await this.channelUsersModel.destroy(destroyOptions);

      const dto = this.fetchChannelDto(chan);
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

  */
}
