import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  ParseUUIDPipe,
  Param,
  Req,
  Query,
} from '@nestjs/common';

import { Channels } from 'db/models/channels';
import { ChannelsService } from './channels.service';
import { createChannelDto } from './dto/createChannel.dto';
import { updateChannelDto } from './dto/updateChannel.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('channels v2 (jwt OFF)')
@Controller('')
export class ChannelsController {
    private login: string; // TEMP
    constructor(private readonly channelService: ChannelsService) {
        this.login = 'test'; // TEMP
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create a channel (dto)' })
    @Post('/channels')
    async createChannel(@Req() req, @Body() channelDto: createChannelDto) {
        return this.channelService.createChannel(this.login, channelDto);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete a channel' })
    @Delete('/channels/:chanId')
    async deleteChannel(@Req() req, @Param('chanId') chanId: string) {
        return this.channelService.deleteChannel(this.login, chanId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Join a channel' })
    @Post('/channels/:chanId/join')
    async joinChannel(@Req() req, @Param('chanId') chanId: string) {
        return this.channelService.joinChannel(this.login, chanId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Quit a channel' })
    @Delete('/channels/:chanId/quit')
    async quitChannel(@Req() req, @Param('chanId') chanId: string) {
        return this.channelService.quitChannel(this.login, chanId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update a channel (dto)' })
    @Patch('/channels/:chanId')
    async updateChannel(@Req() req, @Param('chanId') chanId: string, @Body() channelDto: updateChannelDto) {
        return this.channelService.updateChannel(this.login, chanId, channelDto);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Add admin userId' })
    @Post('/channels/:chanId/admin/:userId')
    async addAdmin(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string) {
        return this.channelService.addAdminChannel(this.login, chanId, userId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete admin userId' })
    @Delete('/channels/:chanId/admin/:userId')
    async delAdmin(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string) {
        return this.channelService.delAdminChannel(this.login, chanId, userId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Invite userId to channel' })
    @Post('/channels/:chanId/invite/:userId')
    async inviteToChannel(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string) {
        return this.channelService.inviteToChannel(this.login, chanId, userId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get channels (query param)' })
    @Get('/channels')
    async getChannels(@Req() req, @Query('state') state: string | undefined) {
        return this.channelService.getChannels(this.login, state);
    }
}
