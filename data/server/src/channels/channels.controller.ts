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
  UseGuards,
} from '@nestjs/common';

import { UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { Channels } from 'db/models/channels';
import { ChannelsService } from './channels.service';
import { createChannelDto } from './dto/createChannel.dto';
import { updateChannelDto } from './dto/updateChannel.dto';

import { AuthGuard } from '@nestjs/passport';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('channels v3 (jwt OFF)')
@Controller('')
export class ChannelsController
{
    private login: string; // TEMP

    constructor(private readonly channelService: ChannelsService)
    {
        this.login = 'test'; // TEMP
    }

    // ----------   CREATE / DELETE / UPDATE CHANNEL

    @ApiOperation({ summary: 'Create a channel (dto)' })
    @ApiResponse({ status: 200, description: 'Channel created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Post('/channels')
    @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
    async createChannel(@Req() req, @Body() channelDto: createChannelDto)
    {
        return this.channelService.createChannel(req.user.login, channelDto);
    }

    @ApiOperation({ summary: 'Delete a channel' })
    @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Delete('/channels/:chanId')
    @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
    async deleteChannel(@Req() req, @Param('chanId') chanId: string)
    {
        return this.channelService.deleteChannel(req.user.login, chanId);
    }

    @ApiOperation({ summary: 'Update a channel (dto)' })
    @ApiResponse({ status: 200, description: 'Channel updated successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Patch('/channels/:chanId')
    async updateChannel(@Req() req, @Param('chanId') chanId: string, @Body() channelDto: updateChannelDto)
    {
        return this.channelService.updateChannel(this.login, chanId, channelDto);
    }

    @ApiOperation({ summary: 'Change channel image' })
    @ApiResponse({ status: 200, description: 'Channel updated successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Put('/channels/:chanId/image')
    @UseInterceptors(FileInterceptor('image'))
    async updateImage(@Req() req, @Param('chanId') chanId: string,
                             @UploadedFile() image: Express.Multer.File,)
                            {
        return this.channelService.putImage(this.login, chanId, image);
    }


    // ----------   JOIN / QUIT CHANNEL

    @ApiOperation({ summary: 'Join a channel' })
    @Post('/channels/:chanId/join')
    @ApiResponse({ status: 200, description: 'Channel join successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async joinChannel(@Req() req, @Param('chanId') chanId: string)
    {
        return this.channelService.joinChannel(this.login, chanId);
    }

    @ApiOperation({ summary: 'Quit a channel' })
    @ApiResponse({ status: 200, description: 'Channel quit successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Delete('/channels/:chanId/quit')
    async quitChannel(@Req() req, @Param('chanId') chanId: string)
    {
        return this.channelService.quitChannel(this.login, chanId);
    }

    // ----------   INVITE

    @ApiOperation({ summary: 'Invite userId to channel' })
    @Post('/channels/:chanId/invite/:userId')
    @ApiResponse({ status: 200, description: 'Invite send successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async inviteToChannel(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string)
    {
        return this.channelService.inviteToChannel(this.login, chanId, userId);
    }

    // ----------   OWNER / ADMIN OPERATIONS

    @ApiOperation({ summary: 'Add admin userId' })
    @ApiResponse({ status: 200, description: 'admin added successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Post('/channels/:chanId/admin/:userId')
    async addAdmin(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string)
    {
        return this.channelService.addAdminChannel(this.login, chanId, userId);
    }

    @ApiOperation({ summary: 'Delete admin userId' })
    @ApiResponse({ status: 200, description: 'admin deleted successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @Delete('/channels/:chanId/admin/:userId')
    async delAdmin(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string)
    {
        return this.channelService.delAdminChannel(this.login, chanId, userId);
    }

    @ApiOperation({ summary: 'Mute userId in channel' })
    @Patch('/channels/:chanId/mute/:userId')
    @ApiResponse({ status: 200, description: 'User muted successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async muteUser(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string)
    {
        return this.channelService.muteUser(this.login, chanId, userId);
    }

    @ApiOperation({ summary: 'Kick userId from channel' })
    @Delete('/channels/:chanId/kick/:userId')
    @ApiResponse({ status: 200, description: 'User kicked successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async kickUser(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string)
    {
        return this.channelService.kickUser(this.login, chanId, userId);
    }

    @ApiOperation({ summary: 'Ban userId from channel' })
    @Patch('/channels/:chanId/ban/:userId')
    @ApiResponse({ status: 200, description: 'User banned successfully' })
    @ApiResponse({ status: 404, description: 'Channel not found' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async banUser(@Req() req, @Param('chanId') chanId: string, @Param('userId') userId: string)
    {
        return this.channelService.banUser(this.login, chanId, userId);
    }

    // ----------   GET CHANNELS

    @ApiOperation({ summary: 'Get channels (query param)' })
    @Get('/channels')
    async getChannels(@Req() req, @Query('state') state: string | undefined)
    {
        return this.channelService.getChannels(this.login, state);
    }

    @ApiOperation({ summary: 'Get channels of specific user (query param)' })
    @Get('/userChannels')
    async getChannelsWithUser(@Req() req, @Query('user') user: string | undefined)
    {
        return this.channelService.getUserChannels(user);
    }

    @ApiOperation({ summary: 'Get users list of channel' })
    @Get('/channels/:chanId/users')
    async getChannelUsers(@Req() req, @Param('chanId') chanId: string)
    {
        return this.channelService.getChannelUsers(chanId);
    }

    /* // FIXME
    @ApiOperation({ summary: 'Get ban list of channel' })
    @Get('/channels/:chanId/banlist')
    async getChannelBanlist(@Req() req, @Param('chanId') chanId: string)
    {
        return this.channelService.getChannelBanlist(chanId);
    }
    */

}
