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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { uuidv4, ChanType, UserStatus, ReqU } from 'src/types';
import { ChannelsService } from './channels.service';
import { ChannelsGetService } from './channels-get.service';
import { ChannelsOpService } from './channels-op.service';
import { ChannelsUtilsService } from './channels-utils.service';
import { EditChannelDto } from './dto/editChannel.dto';
import { SetImageDto } from './dto/setImage.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { PasswordChannelDto } from './dto/passwordChannel.dto';

@ApiTags('channels v4 (jwt OFF)')
@Controller('')
export class ChannelsController {
  private public_id: string | null = null; // DEPR
  private static isFirstUserConnected = true; // DEPR

  constructor(
    private readonly channelService: ChannelsService,
    private readonly channelGetService: ChannelsGetService,
    private readonly channelOpService: ChannelsOpService,
    private readonly utils: ChannelsUtilsService,
    private readonly usersService: UsersService,
  ) {
    this.setcurrentId(); // DEPR
  }

  /// DEPR
  async setcurrentId() {
    let user: User | null;
    if (ChannelsController.isFirstUserConnected === true) {
      user = await this.usersService.findByLogin('marvin');
      ChannelsController.isFirstUserConnected = false;
    } else {
      user = await this.usersService.findByLogin('ben');
      ChannelsController.isFirstUserConnected = true;
    }
    if (user && user.public_id) {
      this.public_id = user.public_id;
    } else {
      console.error("L'utilisateur ou sa propriété 'public_id' est null.");
    }
  }

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
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels')
  async createChannel(
    @Req() req: ReqU,
    @Body() editChannelDto: EditChannelDto,
  ) {
    return await this.channelService.createChannel(
      this.public_id,
      editChannelDto,
    );
  }

  @ApiOperation({ summary: 'Update a channel (dto)' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Patch('/channels/:chanId')
  async updateChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: uuidv4,
    @Body() editChannelDto: EditChannelDto,
  ) {
    return await this.channelService.updateChannel(
      this.public_id,
      chanId,
      editChannelDto,
    );
  }

  @ApiOperation({ summary: 'Delete a channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId')
  async deleteChannel(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelService.deleteChannel(this.public_id, chanId);
  }

  // ---------- PATCH IMG

  @ApiOperation({ summary: 'Change channel image' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/channels/:chanId/image')
  async uploadImage(
    @Req() req: ReqU,
    @Param('chanId') chanId: uuidv4,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.channelService.uploadImage(this.public_id, chanId, file);
  }

  // ---------- JOIN / QUIT

  @ApiOperation({ summary: 'Join a channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/join')
  async joinChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: uuidv4,
    @Body() passwordChannelDto: PasswordChannelDto,
  ) {
    return await this.channelService.joinChannel(
      this.public_id,
      chanId,
      passwordChannelDto,
    );
  }

  @ApiOperation({ summary: 'Quit a channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/quit')
  async quitChannel(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelService.quitChannel(this.public_id, chanId);
  }

  // ---------- ADMIN
  @ApiOperation({ summary: 'Add admin userId' })
  @ApiResponse({ status: 200, description: 'admin added successfully' })
  @Post('/channels/:chanId/admin/:userId')
  async addAdmin(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.addAdmin(this.public_id, chanId, userId);
  }

  @ApiOperation({ summary: 'Delete admin userId' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/admin/:userId')
  async delAdmin(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.delAdmin(this.public_id, chanId, userId);
  }

  // ---------- INVITE
  @ApiOperation({ summary: 'Invite userId to channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/invite/:userId')
  async inviteToChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.invite(this.public_id, chanId, userId);
  }

  @ApiOperation({ summary: 'Cancel userId invitation to channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/invite/:userId')
  async uninviteToChannel(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.uninvite(this.public_id, chanId, userId);
  }

  // ---------- BAN
  @ApiOperation({ summary: 'Ban userId from channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/channels/:chanId/ban/:userId')
  async banUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.banUser(this.public_id, chanId, userId);
  }

  @ApiOperation({ summary: 'Unban userId from channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/ban/:userId')
  async unbanUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.unbanUser(
      this.public_id,
      chanId,
      userId,
    );
  }

  // ---------- MUTE
  @ApiOperation({ summary: 'Mute userId in channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Patch('/channels/:chanId/mute/:userId')
  async muteUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.mute(this.public_id, chanId, userId);
  }

  // ---------- KICK
  @ApiOperation({ summary: 'Kick userId from channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/channels/:chanId/kick/:userId')
  async kickUser(
    @Req() req: ReqU,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return await this.channelOpService.kick(this.public_id, chanId, userId);
  }

  // ---------- GET CHANNEL DATA

  @ApiOperation({ summary: 'Get data of channel' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId')
  async getDataChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getDataChan(chanId);
  }

  // ---------- GET CHANNELS LIST (for current user, sorted by user size)

  @ApiOperation({
    summary: 'Get joined channels (execpt direct chan) (sorted)',
  })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-joined')
  async getJoinedChan(@Req() req: ReqU) {
    return await this.channelGetService.getJoinedChan(this.public_id);
  }

  @ApiOperation({ summary: 'Get direct joined channels (sorted)' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-direct')
  async getDirectChan(@Req() req: ReqU) {
    return await this.channelGetService.getDirectChan(this.public_id);
  }

  @ApiOperation({ summary: 'Get available channels (sorted)' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-available')
  async getAvailableChan(@Req() req: ReqU) {
    return await this.channelGetService.getUnjoinedChan(
      this.public_id,
      ChanType.Public,
    );
  }

  @ApiOperation({ summary: 'Get protected unjoined channels (sorted)' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-unjoined-protect')
  async getProtectedChan(@Req() req: ReqU) {
    return await this.channelGetService.getUnjoinedChan(
      this.public_id,
      ChanType.Protected,
    );
  }

  @ApiOperation({ summary: 'Get private unjoined channels (sorted)' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels-unjoined-private')
  async getPrivateChan(@Req() req: ReqU) {
    return await this.channelGetService.getUnjoinedChan(
      this.public_id,
      ChanType.Private,
    );
  }

  // ---------- GET USERS LIST

  @ApiOperation({
    summary: 'Get all users list include mutes,admins,owner)',
  })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/users')
  async getUsersChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getUsersChan(chanId);
  }

  @ApiOperation({ summary: 'Get only users/muted list' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/users-only')
  async getUsersOnlyChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getUsersOnlyChan(chanId);
  }

  @ApiOperation({ summary: 'Get mutes list' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/mutes')
  async getMutesChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getMutesChan(chanId);
  }

  @ApiOperation({ summary: 'Get admins (owner include) list' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/admins')
  async getAdminsChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getAdminsChan(chanId);
  }

  @ApiOperation({ summary: 'Get invites list' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/invites')
  async getInvitesChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getInvitesChan(chanId);
  }

  @ApiOperation({ summary: 'Get bans list' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/bans')
  async getBansChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    return await this.channelGetService.getBansChan(chanId);
  }

  @ApiOperation({ summary: 'Get owner' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/channels/:chanId/owner')
  async getOwnerChan(@Req() req: ReqU, @Param('chanId') chanId: uuidv4) {
    const userStatuses = [UserStatus.Owner];
    return await this.utils.getUsersByStatuses(chanId, userStatuses);
  }
}
