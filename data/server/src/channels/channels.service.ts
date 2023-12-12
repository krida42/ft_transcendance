import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BcryptService } from 'src/tools/bcrypt.service';

import { uuidv4, ChanType, UserStatus, ErrorMsg } from 'src/types';
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { EditChannelDto } from './dto/editChannel.dto';
import { PasswordChannelDto } from './dto/passwordChannel.dto';
import { channelDto } from './dto/channel.dto';
import { UsersService } from '../users/users.service';
import { FriendsService } from '../friends/friends.service';
import { ChannelsGetService } from '../channels/channels-get.service';
import { ChannelsUtilsService } from './channels-utils.service';
import { UploadDto } from './dto/setImage.dto';

// POST createChannel(currentId, editChannelDto, setImageDto): Promise<channelDto> OK
// PATCH updateChannel(currentId, chanId, editChannelDto, setImageDto): Promise<channelDto> OK
// DELETE deleteChannel(currentId, chanId): Promise<channelDto> OK

// ---------- PATCH IMAGE
// uploadImage(currentId,chanId, file: Express.Multer.File): Promise<channelDto> OK

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
    await this.friendsService.checkId(currentId);

    const chan = await this.channelModel.findOne({
      where: {
        chanName: editChannelDto.chanName,
         [Op.not]: { ChanType: ChanType.Direct },
      },
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

    if (pass != null && editChannelDto.chanType == ChanType.Protected)
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

      return await this.utils.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.joinChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateChannel(
    currentId: uuidv4,
    chanId: uuidv4,
    editChannelDto: EditChannelDto,
  ): Promise<channelDto> {
    await this.friendsService.checkId(currentId);
    await this.utils.checkId(chanId);
    await this.utils.checkOwner(currentId, chanId);

    const chanTestName = await this.channelModel.findOne({
      where: {
        chanId: {
          [Op.not]: chanId,
        },
        chanName: editChannelDto.chanName,
        [Op.not]: { ChanType: ChanType.Direct },
      },
    });
    if (chanTestName) {
      throw new HttpException('name already exist', HttpStatus.CONFLICT);
    }

    if (editChannelDto.chanType == ChanType.Direct)
      throw new HttpException('invalid channel type', HttpStatus.BAD_REQUEST);

    let pass = editChannelDto.chanPassword;
    if (pass == null || pass.length < 6) {
      if (editChannelDto.chanType == ChanType.Protected) {
        throw new HttpException(
          'password missing or too short: < 6 characters',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (pass != null && editChannelDto.chanType == ChanType.Protected)
      pass = await BcryptService.hashPassword(pass);
    else pass = 'nannan';

    try {
      let chan = await this.utils.findById(chanId);
      chan.chanName = editChannelDto.chanName;
      chan.chanType = editChannelDto.chanType;
      (chan.chanPassword = pass), await chan.save();
      return await this.utils.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.updateChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- PATCH IMAGE

  // 413 payload too large /!\
  async uploadImage(
    currentId: uuidv4,
    chanId: uuidv4,
    uploadDto: UploadDto,
  ): Promise<channelDto> {

    await this.friendsService.checkId(currentId);
    let chan = await this.utils.findById(chanId);
    await this.utils.checkOwner(currentId, chanId);

    /* if ! buffer
    if (!file) {
      console.log('>>> !file');
      return await this.utils.fetchChannelDto(chan.chanId);
    }
    */

    /*
    console.log('file:', file);
    const fileType = await import('file-type');
    const imageType = await fileType.fileTypeFromBuffer(file.buffer);

    if (!imageType || !imageType.mime.startsWith('image/')) {
      throw new HttpException('invalid image', HttpStatus.BAD_REQUEST);
    }

    */

    try {
      console.log("-----");
      console.log(uploadDto.file.buffer);
      console.log("-----");
      console.log(uploadDto);
      // const { originalname, mimetype, buffer } = file;

      // console.log('imgName:', originalname);
      // console.log('imgType:', mimetype);
      // console.log('imgData:', buffer);
      chan.imgData = uploadDto.file.buffer;
      await chan.save();
      return await this.utils.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException('uploadImage: ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteChannel(currentId: uuidv4, chanId: uuidv4): Promise<channelDto> {
    await this.friendsService.checkId(currentId);
    const chan = await this.utils.findById(chanId);
    await this.utils.checkOwner(currentId, chanId);

    try {
      await this.channelUsersModel.destroy({
        where: { chanId: chanId },
      });
      const dto = await this.utils.fetchChannelDto(chan.chanId);
      await chan.destroy();
      return dto;
    } catch (error) {
      throw new HttpException(
        ErrorMsg.deleteChannel + error,
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
    await this.friendsService.checkId(currentId);
    let chan = await this.utils.findById(chanId);

    if (await this.utils.userIs(UserStatus.Banned, currentId, chanId))
      throw new HttpException('you are banned', HttpStatus.FORBIDDEN);

    if (await this.utils.userIsInChannel(currentId, chanId))
      throw new HttpException('already in channel', HttpStatus.BAD_REQUEST);

    if (chan.chanType == ChanType.Protected) {
      const pass = await BcryptService.hashPassword(
        passwordChannelDto.chanPassword,
      );
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
        await user.save();
        chan.nbUser++;
        await chan.save();
        return await this.utils.fetchChannelDto(chan.chanId);
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
      await chan.save();
      return await this.utils.fetchChannelDto(chan.chanId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.joinChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async quitChannel(currentId: uuidv4, chanId: uuidv4): Promise<channelDto> {
    await this.friendsService.checkId(currentId);

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
          await oldestNonOwner.save();
        }
      }

      chan.nbUser--;
      await chan.save();
      const dto = await this.utils.fetchChannelDto(chan.chanId);

      if (chan.nbUser > 0) {
        const user = await this.utils.getUserInChannel(currentId, chanId);
        user.destroy();
      } else {
        await this.deleteChannel(currentId, chanId);
      }
      return dto;
    } catch (error) {
      throw new HttpException(
        ErrorMsg.quitChannel + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createDirectChannel(user1_id: uuidv4, user2_id: uuidv4) {
    if (
      (await this.friendsService.checkId(user1_id)) ===
      (await this.friendsService.checkId(user2_id))
    ) {
      throw new HttpException('same uuidv4', HttpStatus.CONFLICT);
    }

    const name = [
      await this.usersService.findById(user1_id),
      await this.usersService.findById(user2_id),
    ];

    try {
      const chan = await this.channelModel.create({
        chanName: name[0].login + ' & ' + name[1].login,
        ownerId: user1_id,
        chanType: ChanType.Direct,
        chanPassword: 'nannan',
        nbUser: 2,
      });

      await this.channelUsersModel.create({
        chanId: chan.chanId,
        userId: user1_id,
        userStatus: UserStatus.Direct,
      });
      await this.channelUsersModel.create({
        chanId: chan.chanId,
        userId: user2_id,
        userStatus: UserStatus.Direct,
      });
    } catch (error) {
      throw new HttpException(
        'createDirectChannel ' + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
