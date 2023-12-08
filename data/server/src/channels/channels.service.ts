import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BcryptService } from 'src/tools/bcrypt.service';

import { uuidv4 } from 'src/types';
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { EditChannelDto } from './dto/editChannel.dto';
import { PasswordChannelDto } from './dto/passwordChannel.dto';
import { channelDto } from './dto/channel.dto';
import { UsersService } from '../users/users.service';
import { FriendsService } from '../friends/friends.service';
import { ChannelsGetService } from '../channels/channels-get.service';
import { ChannelsUtilsService } from './channels-utils.service';

enum BadMsg {
  createChannel = 'cc:',
  updateChannel = 'uc:',
  deleteChannel = 'dc:',
  joinChannel = 'jc:',
  quitChannel = 'qc:',
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

// POST createChannel(currentId, editChannelDto): Promise<channelDto> OK
// DELETE updateChannel(currentId, chanId, editChannelDto): Promise<channelDto> TO CHECK
// PATCH deleteChannel(currentId, chanId): Promise<channelDto> OK
// ---------- JOIN / QUIT
// joinChannel(currentId, chanId): Promise<channelDto> OK
// quitChannel(currentId, chanId): Promise<channelDto> OK

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly channelsGetService: ChannelsGetService,
    private readonly utils: ChannelsUtilsService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  async createChannel(
    currentId: uuidv4,
    editChannelDto: EditChannelDto,
  ): Promise<channelDto> {
    this.friendsService.checkId(currentId);

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
        ownerId: currentId,
        chanType: editChannelDto.chanType,
        chanPassword: pass,
        nbUser: 1,
      });

      await this.channelUsersModel.create({
        chanId: chan.chanId,
        userId: currentId,
        userStatus: UserStatus.Owner,
      });

      return this.utils.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException(
        BadMsg.joinChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateChannel(
    currentId: uuidv4,
    chanId: uuidv4,
    editChannelDto: EditChannelDto,
  ): Promise<channelDto> {
    this.friendsService.checkId(currentId);

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

    let chan = await this.utils.findById(chanId);
    if (!chan.chanPassword) {
      chan.chanPassword = 'nan';
    }

    if (editChannelDto.chanType == ChanType.Direct)
      throw new HttpException('invalid channel type', HttpStatus.BAD_REQUEST);

    const ownerChan = await this.channelUsersModel.findOne({
      where: {
        chanId: chanId,
        userId: currentId,
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
      return this.utils.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException(
        BadMsg.updateChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteChannel(currentId: uuidv4, chanId: uuidv4): Promise<channelDto> {
    this.friendsService.checkId(currentId);
    const chan = await this.utils.findById(chanId);
    this.utils.checkOwner(currentId, chanId);

    try {
      await this.channelUsersModel.destroy({
        where: { chanId: chanId },
      });
      const dto = this.utils.fetchChannelDto(chan.chanId);
      await chan.destroy();
      return dto;
    } catch (error) {
      throw new HttpException(
        BadMsg.deleteChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------   JOIN / QUIT CHANNEL

  async joinChannel(
    currentId: uuidv4,
    chanId: uuidv4,
    passwordChannelDto: PasswordChannelDto,
  ): Promise<channelDto> {
    this.friendsService.checkId(currentId);
    let chan = await this.utils.findById(chanId);

    if (await this.utils.userIs(UserStatus.Banned, currentId, chanId))
      throw new HttpException('you are banned', HttpStatus.FORBIDDEN);

    if (await this.utils.userIsInChannel(currentId, chanId))
      throw new HttpException('already in channel', HttpStatus.BAD_REQUEST);

    if (chan.chanType == ChanType.Protected) {
      const pass = await BcryptService.hashPassword(passwordChannelDto.chanPassword);
      if (pass != chan.chanPassword)
        throw new HttpException('invalid password', HttpStatus.FORBIDDEN);
    }

    if (chan.chanType == ChanType.Private) {
      let user = await this.channelUsersModel.findOne({
        where: {
          chanId: chanId,
          userId: currentId,
          userStatus: UserStatus.Invited,
        },
      });
      if (!user)
        throw new HttpException('need an invitation', HttpStatus.FORBIDDEN);
      try {
        user.userStatus = UserStatus.User;
        user.save(); // CHECK or await user.save(); // ?
        chan.nbUser++;
        chan.save();
        return this.utils.fetchChannelDto(chan.chanId);
      } catch (error) {
        throw new HttpException('jc', HttpStatus.BAD_REQUEST);
      }
    }

    try {
      await this.channelUsersModel.create({
        chanId: chanId,
        userId: currentId,
        userStatus: UserStatus.User,
      });
      chan.nbUser++;
      chan.save();
      return this.utils.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException(
        BadMsg.joinChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async quitChannel(currentId: uuidv4, chanId: uuidv4): Promise<channelDto> {
    this.friendsService.checkId(currentId);

    let chan = await this.utils.findById(chanId);

    if (false == (await this.utils.userIsInChannel(currentId, chanId)))
      throw new HttpException('not in channel', HttpStatus.BAD_REQUEST);

    try {
      if (await this.utils.userIs(UserStatus.Owner, currentId, chanId)) {
        const oldestNonOwner = await this.channelUsersModel.findOne({
          where: {
            chanId: chanId,
            userStatus: { [Op.not]: UserStatus.Owner },
          },
          order: [['createdAt', 'ASC']],
        });
        if (oldestNonOwner) {
          oldestNonOwner.userStatus = UserStatus.Owner;
          oldestNonOwner.save();
        }
      }

      const user = await this.utils.getUserInChannel(currentId, chanId);
      user.destroy();
      chan.nbUser--;
      chan.save();
      const dto = this.utils.fetchChannelDto(chan.chanId);
      if (chan.nbUser == 0) {
        this.deleteChannel(currentId, chanId);
      }
      return dto;
    } catch (error) {
      throw new HttpException(
        BadMsg.quitChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
