import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Param,
  Req,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  HttpException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';

import { uuidv4, ChanType, UserStatus, ReqU } from 'src/types';
import { ChannelsService } from './channels.service';
import { ChannelsGetService } from './channels-get.service';
import { ChannelsOpService } from './channels-op.service';
import { ChannelsUtilsService } from './channels-utils.service';
import { EditChannelDto } from './dto/editChannel.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { PasswordChannelDto } from './dto/passwordChannel.dto';
import { AddMessageDto } from 'src/message/dto/addMessage.dto';
import { MessageService } from 'src/message/message.service';
import { UploadDto } from './dto/setImage.dto';
import { join } from 'path';
import { MessageDto } from 'src/message/dto/message.dto';

@ApiTags('channels v4 (jwt OFF)')
@Controller('')
export class ChannelsController {
  // private public_id: string | null = null; // DEPR
  // private static isFirstUserConnected = true; // DEPR

  constructor(
    private readonly channelService: ChannelsService,
    private readonly channelGetService: ChannelsGetService,
    private readonly channelOpService: ChannelsOpService,
    private readonly utils: ChannelsUtilsService,
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
  ) {
    // this.setcurrentId(); // DEPR
  }

  /// DEPR
  // async setcurrentId() {
  //   let user: User | null;
  //   if (ChannelsController.isFirstUserConnected === true) {
  //     user = await this.usersService.findByLogin('marvin');
  //     ChannelsController.isFirstUserConnected = false;
  //   } else {
  //     user = await this.usersService.findByLogin('ben');
  //     ChannelsController.isFirstUserConnected = true;
  //   }
  //   if (user && user.public_id) {
  //     req.user.public_id = user.public_id;
  //   } else {
  //     console.error("L'utilisateur ou sa propriété 'public_id' est null.");
  //   }
  // }

  // @Post('/channels') OK
  // @Patch('/channels/:chanId') OK
  // @Delete('/channels/:chanId') OK

  // ---------- PATCH IMG
  // @Patch('/channels/:chanId/image') OK

  // ---------- JOIN / QUIT
  // @Post('/channels/:chanId/join') OK
  // @Delete('/channels/:chanId/quit') OK

  // ---------- ADMIN
  // @Post('/channels/:chanId/admin/:userId') OK
  // @Delete('/channels/:chanId/admin/:userId') OK

  // ---------- INVITE
  // @Post('/channels/:chanId/invite/:userId') OK
  // @Delete('/channels/:chanId/invite/:userId') OK

  // ---------- BAN
  // @Post('/channels/:chanId/ban/:userId') OK
  // @Delete('/channels/:chanId/ban/:userId') OK

  // ---------- MUTE
  // @Patch('/channels/:chanId/mute/:userId') OK

  // ---------- KICK
  // @Delete('/channels/:chanId/kick/:userId') OK

  // ---------- GET CHANNEL DATA
  // @Get('/channels/:chanId') OK

  // ---------- GET CHANNELS LIST (for current user, sorted by user size)
  // @Get('/channels-joined') OK
  // @Get('/channels-direct') OK
  // @Get('/channels-available') OK
  // @Get('/channels-invited') OK
  // @Get('/channels-unjoined-protect') OK
  // @Get('/channels-unjoined-private') OK

  // ---------- GET USERS LIST
  // @Get('/channels/:chanId/users') OK
  // @Get('/channels/:chanId/users-only') OK
  // @Get('/channels/:chanId/mutes') OK
  // @Get('/channels/:chanId/admins') OK
  // @Get('/channels/:chanId/invites') OK
  // @Get('/channels/:chanId/bans') OK
  // @Get('/channels/:chanId/owner') OK

  @ApiOperation({ summary: 'Create a channel (dto)' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels')
  async createChannel(
    @Req() req: ReqU,
    @Body() editChannelDto: EditChannelDto,
  ) {
    return await this.channelService.createChannel(
      req.user.public_id,
      editChannelDto,
    );
  }

  @ApiOperation({ summary: 'Update a channel (dto)' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Patch('/channels/:chanId')
  async updateChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: uuidv4,
    @Body() editChannelDto: EditChannelDto,
  ) {
    return await this.channelService.updateChannel(
      req.user.public_id,
      chanId,
      editChannelDto,
    );
  }

  @ApiOperation({ summary: 'Delete a channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId')
  async deleteChannel(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelService.deleteChannel(req.user.public_id, chanId);
  }

  // ---------- JOIN / QUIT

  @ApiOperation({ summary: 'Join a channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/join')
  async joinChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: uuidv4,
    @Body() passwordChannelDto: PasswordChannelDto,
  ) {
    return await this.channelService.joinChannel(
      req.user.public_id,
      chanId,
      passwordChannelDto,
    );
  }

  @ApiOperation({ summary: 'Quit a channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/quit')
  async quitChannel(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelService.quitChannel(req.user.public_id, chanId);
  }

  // ---------- ADMIN
  @ApiOperation({ summary: 'Add admin userId' })
  @ApiResponse({ status: 200, description: 'admin added successfully' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/admin/:userId')
  async addAdmin(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.addAdmin(
      req.user.public_id,
      chanId,
      userId,
    );
  }

  @ApiOperation({ summary: 'Delete admin userId' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/admin/:userId')
  async delAdmin(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.delAdmin(
      req.user.public_id,
      chanId,
      userId,
    );
  }

  // ---------- INVITE
  @ApiOperation({ summary: 'Invite userId to channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/invite/:userId')
  async inviteToChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.invite(
      req.user.public_id,
      chanId,
      userId,
    );
  }

  @ApiOperation({ summary: 'Cancel userId invitation to channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/invite/:userId')
  async uninviteToChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.uninvite(
      req.user.public_id,
      chanId,
      userId,
    );
  }

  // ---------- BAN
  @ApiOperation({ summary: 'Ban userId from channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/ban/:userId')
  async banUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.banUser(
      req.user.public_id,
      chanId,
      userId,
    );
  }

  @ApiOperation({ summary: 'Unban userId from channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/ban/:userId')
  async unbanUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.unbanUser(
      req.user.public_id,
      chanId,
      userId,
    );
  }

  // ---------- MUTE
  @ApiOperation({ summary: 'Mute userId in channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Patch('/channels/:chanId/mute/:userId')
  async muteUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.mute(req.user.public_id, chanId, userId);
  }

  // ---------- KICK
  @ApiOperation({ summary: 'Kick userId from channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/kick/:userId')
  async kickUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.kick(req.user.public_id, chanId, userId);
  }

  // ---------- GET CHANNEL DATA

  @ApiOperation({ summary: 'Get data of channel' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId')
  async getDataChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getDataChan(chanId);
  }

  // ---------- GET CHANNELS LIST (for current user, sorted by user size)

  @ApiOperation({
    summary: 'Get joined channels (execpt direct chan) (sorted)',
  })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-joined')
  async getJoinedChan(@Req() req: ReqU) {
    return await this.channelGetService.getJoinedChan(req.user.public_id);
  }

  @ApiOperation({ summary: 'Get direct joined channels (sorted)' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-direct')
  async getDirectChan(@Req() req: ReqU) {
    return await this.channelGetService.getDirectChan(req.user.public_id);
  }

  @ApiOperation({ summary: 'Get available channels (sorted)' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-available')
  async getAvailableChan(@Req() req: ReqU) {
    return await this.channelGetService.getUnjoinedChan(
      req.user.public_id,
      ChanType.Public,
    );
  }

  @ApiOperation({ summary: 'Get invited channels (sorted)' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-invited')
  async getInvitedChan(@Req() req: ReqU) {
    return await this.channelGetService.getInvitedChan(
      req.user.public_id,
    );
  }

  @ApiOperation({ summary: 'Get protected unjoined channels (sorted)' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-unjoined-protect')
  async getProtectedChan(@Req() req: ReqU) {
    return await this.channelGetService.getUnjoinedChan(
      req.user.public_id,
      ChanType.Protected,
    );
  }

  @ApiOperation({ summary: 'Get private unjoined channels (sorted)' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-unjoined-private')
  async getPrivateChan(@Req() req: ReqU) {
    return await this.channelGetService.getUnjoinedChan(
      req.user.public_id,
      ChanType.Private,
    );
  }

  // ---------- GET USERS LIST

  @ApiOperation({
    summary: 'Get all users list include mutes,admins,owner)',
  })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/users')
  async getUsersChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getUsersChan(chanId);
  }

  @ApiOperation({ summary: 'Get only users/muted list' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/users-only')
  async getUsersOnlyChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getUsersOnlyChan(chanId);
  }

  @ApiOperation({ summary: 'Get mutes list' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/mutes')
  async getMutesChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getMutesChan(chanId);
  }

  @ApiOperation({ summary: 'Get admins (owner include) list' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/admins')
  async getAdminsChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getAdminsChan(chanId);
  }

  @ApiOperation({ summary: 'Get invites list' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/invites')
  async getInvitesChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getInvitesChan(chanId);
  }

  @ApiOperation({ summary: 'Get bans list' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/bans')
  async getBansChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getBansChan(chanId);
  }

  @ApiOperation({ summary: 'Get owner' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/owner')
  async getOwnerChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    const userStatuses = [UserStatus.Owner];
    return await this.utils.getUsersByStatuses(chanId, userStatuses);
  }

  // ---------- POST IMG

  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: ReqU,
    @Param('chanId') chanId: uuidv4,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: 15 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    await this.utils.checkId(chanId);
    await this.utils.checkOwner(req.user.public_id, chanId);
    let chan = await this.utils.findById(chanId);
    // console.log('----- FILE -----');
    // console.log(file);
    // console.log('----- END FILE -----');

    try {
      const dirPath = `/app/dist/public/`;
      const fileName = `${chanId}_chan_image.${file.mimetype.split('/')[1]}`;
      // console.log('FILE PATH:', dirPath + fileName);
      const imageUrl = 'http://localhost:3001/' + fileName;
      // console.log('FILE URL: ', imageUrl);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      fs.writeFileSync(dirPath + fileName, file.buffer, { flag: 'w' });

      chan.imgName = imageUrl;
      await chan.save();
      return { message: 'File uploaded successfully', imageUrl };
    } catch (error) {
      throw new HttpException('UploadImage' + error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Send a message' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/messages')
  async sendMessage(
    @Req() req: ReqU,
    @Param('chanId', ParseUUIDPipe) chanId: string,
    @Body() addMessageDto: AddMessageDto,
  ) {
    return this.messageService.sendMessageToChannel(
      req.user.public_id,
      chanId,
      addMessageDto,
    );
  }

  @ApiOperation({ summary: 'Get all messages' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get(':channelId/messages')
  async getAllMessages(
    @Param('channelId', ParseUUIDPipe) channelId: string,
    @Req() req: ReqU,
  ): Promise<MessageDto[]> {
    return this.messageService.findForChannel(channelId);
  }
}
