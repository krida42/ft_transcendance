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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { uuidv4 } from 'src/types';
import { AuthGuard } from '@nestjs/passport';

import { ChannelsService } from './channels.service';
import { ChannelsGetService } from './channels-get.service';
import { ChannelsOpService } from './channels-op.service';
import { EditChannelDto } from './dto/editChannel.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { PasswordChannelDto } from './dto/passwordChannel.dto';

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

@ApiTags('channels v3 (jwt OFF)')
@Controller('')
export class ChannelsController {
  private public_id: string | null = null; // TEMP
  private static isFirstUserConnected = true; // TEMP

  constructor(
    private readonly channelService: ChannelsService,
    private readonly channelGetService: ChannelsGetService,
    private readonly channelOpService: ChannelsOpService,
    private readonly usersService: UsersService,
  ) {
    this.setcurrentId(); // TEMP
  }

  async setcurrentId() {
    // TEMP
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
  // @Patch('/channels/:chanId') TO CHECK
  // @Delete('/channels/:chanId') OK

  // ---------- JOIN / QUIT
  // @Post('/channels/:chanId/join') OK
  // @Delete('/channels/:chanId/quit') OK

  // ---------- ADMIN
  // @Post('/channels/:chanId/admin/:userId') FIXME
  // @Delete('/channels/:chanId/admin/:userId') FIXME

  // ---------- INVITE
  // @Post('/channels/:chanId/invite/:userId') FIXME
  // @Delete('/channels/:chanId/invite/:userId') FIXME

  // ---------- BAN
  // @Post('/channels/:chanId/ban/:userId') FIXME
  // @Delete('/channels/:chanId/ban/:userId') FIXME

  // ---------- MUTE
  // @Patch('/channels/:chanId/mute/:userId') FIXME

  // ---------- KICK
  // @Delete('/channels/:chanId/kick/:userId') FIXME

  // ---------- GET CHANNEL DATA
  // @Get('/channels/:chanId') OK

  // ---------- GET CHANNELS LIST (for current user, sorted by user size)
  // @Get('/channels-joined') OK
  // @Get('/channels-direct') OK
  // @Get('/channels-available') OK
  // @Get('/channels-unjoined-protect') OK
  // @Get('/channels-unjoined-private') OK

  // ---------- GET USERS LIST // TODO BLOCK ACCESS IF NOT IN CHANNEL PRIVATE OR PROTECt
  // @Get('/channels/:chanId/users') OK
  // @Get('/channels/:chanId/users-only') OK
  // @Get('/channels/:chanId/mutes') OK
  // @Get('/channels/:chanId/admins') OK
  // @Get('/channels/:chanId/invites') OK
  // @Get('/channels/:chanId/bans') OK
  // @Get('/channels/:chanId/owner') OK

  @ApiOperation({ summary: 'Create a channel (dto)' })
  @ApiResponse({ status: 200, description: 'Channel created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('/channels')
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  async createChannel(
    @Req() req: Request,
    @Body() editChannelDto: EditChannelDto,
  ) {
    // console.log('req.user.login:', req.user.id);
    return this.channelService.createChannel(this.public_id, editChannelDto);
  }

  @ApiOperation({ summary: 'Update a channel (dto)' })
  @ApiResponse({ status: 200, description: 'Channel updated successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Patch('/channels/:chanId')
  async updateChannel(
    @Req() req: Request,
    @Param('chanId') chanId: uuidv4,
    @Body() editChannelDto: EditChannelDto,
  ) {
    return this.channelService.updateChannel(
      this.public_id,
      chanId,
      editChannelDto,
    );
  }

  @ApiOperation({ summary: 'Delete a channel' })
  @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/channels/:chanId')
  async deleteChannel(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelService.deleteChannel(this.public_id, chanId);
  }

  // ---------- JOIN / QUIT

  @ApiOperation({ summary: 'Join a channel' })
  @Post('/channels/:chanId/join')
  @ApiResponse({ status: 200, description: 'Channel join successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async joinChannel(
    @Req() req: Request,
    @Param('chanId') chanId: uuidv4,
    @Body() passwordChannelDto: PasswordChannelDto,
  ) {
    return this.channelService.joinChannel(
      this.public_id,
      chanId,
      passwordChannelDto,
    );
  }

  @ApiOperation({ summary: 'Quit a channel' })
  @ApiResponse({ status: 200, description: 'Channel quit successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/channels/:chanId/quit')
  async quitChannel(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelService.quitChannel(this.public_id, chanId);
  }

  // ---------- ADMIN
  @ApiOperation({ summary: 'Add admin userId' })
  @ApiResponse({ status: 200, description: 'admin added successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('/channels/:chanId/admin/:userId')
  async addAdmin(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.addAdmin(this.public_id, chanId, userId);
  }

  @ApiOperation({ summary: 'Delete admin userId' })
  @ApiResponse({ status: 200, description: 'admin deleted successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Delete('/channels/:chanId/admin/:userId')
  async delAdmin(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.delAdmin(this.public_id, chanId, userId);
  }

  // ---------- INVITE
  @ApiOperation({ summary: 'Invite userId to channel' })
  @Post('/channels/:chanId/invite/:userId')
  @ApiResponse({ status: 200, description: 'Invite send successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async inviteToChannel(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.invite(this.public_id, chanId, userId);
  }

  @ApiOperation({ summary: 'Cancel userId invitation to channel' })
  @Delete('/channels/:chanId/invite/:userId')
  @ApiResponse({ status: 200, description: 'Invite cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async uninviteToChannel(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.uninvite(this.public_id, chanId, userId);
  }

  // ---------- BAN
  @ApiOperation({ summary: 'Ban userId from channel' })
  @Post('/channels/:chanId/ban/:userId')
  @ApiResponse({ status: 200, description: 'User banned successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async banUser(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.banUser(this.public_id, chanId, userId);
  }

  @ApiOperation({ summary: 'Unban userId from channel' })
  @Delete('/channels/:chanId/ban/:userId')
  @ApiResponse({ status: 200, description: 'User unbanned successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async unbanUser(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.unbanUser(this.public_id, chanId, userId);
  }

  // ---------- MUTE
  @ApiOperation({ summary: 'Mute userId in channel' })
  @Patch('/channels/:chanId/mute/:userId')
  @ApiResponse({ status: 200, description: 'User muted successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async muteUser(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.mute(this.public_id, chanId, userId);
  }

  // ---------- KICK
  @ApiOperation({ summary: 'Kick userId from channel' })
  @Delete('/channels/:chanId/kick/:userId')
  @ApiResponse({ status: 200, description: 'User kicked successfully' })
  @ApiResponse({ status: 404, description: 'Channel not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async kickUser(
    @Req() req: Request,
    @Param('chanId') chanId: string,
    @Param('userId') userId: string,
  ) {
    return this.channelOpService.kick(this.public_id, chanId, userId);
  }

  // ---------- GET CHANNEL DATA

  @ApiOperation({ summary: 'Get data of channel' })
  @Get('/channels/:chanId')
  async getDataChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getDataChan(chanId);
  }

  // ---------- GET CHANNELS LIST (for current user, sorted by user size)

  @ApiOperation({
    summary: 'Get joined channels (execpt direct chan) (sorted)',
  })
  @Get('/channels-joined')
  async getJoinedChan(@Req() req: Request) {
    return this.channelGetService.getJoinedChan(this.public_id);
  }

  @ApiOperation({ summary: 'Get direct joined channels (sorted)' })
  @Get('/channels-direct')
  async getDirectChan(@Req() req: Request) {
    return this.channelGetService.getDirectChan(this.public_id);
  }

  @ApiOperation({ summary: 'Get available channels (sorted)' })
  @Get('/channels-available')
  async getAvailableChan(@Req() req: Request) {
    return this.channelGetService.getUnjoinedChan(
      this.public_id,
      ChanType.Public,
    );
  }

  @ApiOperation({ summary: 'Get protected unjoined channels (sorted)' })
  @Get('/channels-unjoined-protect')
  async getProtectedChan(@Req() req: Request) {
    return this.channelGetService.getUnjoinedChan(
      this.public_id,
      ChanType.Protected,
    );
  }

  @ApiOperation({ summary: 'Get private unjoined channels (sorted)' })
  @Get('/channels-unjoined-private')
  async getPrivateChan(@Req() req: Request) {
    return this.channelGetService.getUnjoinedChan(
      this.public_id,
      ChanType.Private,
    );
  }

  // ---------- GET USERS LIST

  @ApiOperation({
    summary: 'Get all users list include mutes,admins,owner)',
  })
  @Get('/channels/:chanId/users')
  async getUsersChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getUsersChan(chanId);
  }

  @ApiOperation({ summary: 'Get only users/muted list' })
  @Get('/channels/:chanId/users-only')
  async getUsersOnlyChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getUsersOnlyChan(chanId);
  }

  @ApiOperation({ summary: 'Get mutes list' })
  @Get('/channels/:chanId/mutes')
  async getMutesChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getMutesChan(chanId);
  }

  @ApiOperation({ summary: 'Get admins (owner include) list' })
  @Get('/channels/:chanId/admins')
  async getAdminsChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getAdminsChan(chanId);
  }

  @ApiOperation({ summary: 'Get invites list' })
  @Get('/channels/:chanId/invites')
  async getInvitesChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getInvitesChan(chanId);
  }

  @ApiOperation({ summary: 'Get bans list' })
  @Get('/channels/:chanId/bans')
  async getBansChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getBansChan(chanId);
  }

  @ApiOperation({ summary: 'Get owner' })
  @Get('/channels/:chanId/owner')
  async getOwnerChan(@Req() req: Request, @Param('chanId') chanId: uuidv4) {
    return this.channelGetService.getOwnerChan(chanId);
  }
}
