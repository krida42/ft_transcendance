import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Body,
  Delete,
  ParseUUIDPipe,
  Param,
  Req,
  Query,
} from '@nestjs/common';

import { UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

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

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get channels of specific user (query param)' })
    @Get('/userChannels')
    async getUserChannels(@Req() req, @Query('user') user: string | undefined) {
        return this.channelService.getUserChannels(user);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get users list of channel' })
    @Get('/channelsUsers/:chanId')
    async getChannelUsers(@Req() req, @Param('chanId') chanId: string) {
        return this.channelService.getChannelUsers(chanId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get ban list of channel' })
    @Get('/channelsBanlist/:chanId')
    async getChannelBanlist(@Req() req, @Param('chanId') chanId: string) {
        return this.channelService.getChannelBanlist(chanId);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Change channel image' })
    @Put('/channels/:chanId/image')
    @UseInterceptors(FileInterceptor('image'))

    async updateImage(@Req() req, @Param('chanId') chanId: string,
                             @UploadedFile() image: Express.Multer.File,)
                            {
        return this.channelService.putImage(this.login, chanId, image);
    }

    // @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Mute userId to channel' })
    @Post('/channels/:chanId/mute/:userId')
    async muteUser(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string) {
        return this.channelService.muteUser(this.login, chanId, userId);
    }

}