import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';

import { Channel } from 'db/models/channel';
import { ChannelService } from './channel.service';
import { createChannelDto } from './dto/createChannel.dto';
import { updateChannelDto } from './dto/updateChannel.dto';
import { updatePwdChannelDto } from './dto/updatePwdChannel.dto';
import { setAdminChannelDto } from './dto/setAdminChannel.dto';
import { inviteToChannelDto } from './dto/inviteToChannel.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @ApiOperation({ summary: 'Create a channel' })
    @ApiResponse({ status: 201, description: 'The channel has been created.' })
    @Post('/create')
    async createChannel(@Body() channelDto: createChannelDto)
    {
        return this.channelService.createChannel(channelDto);
    }

    @ApiOperation({ summary: 'Delete a channel' })
    @ApiResponse({ status: 202, description: 'The channel has been deleted.' })
    @Delete('/delete/:name')
    async deleteChannel(@Param('name') name: string) {
        return this.channelService.deleteChannel(name);
    }

    @ApiOperation({ summary: 'Get all channels - DEBUG' })
    @ApiResponse({ status: 200, description: 'get all channels' })
    @Get('/all')
    async getAll(): Promise<Channel[]> {
        return this.channelService.getAll();
    }

    @ApiOperation({ summary: 'Join a channel' })
    @ApiResponse({ status: 200, description: 'Channel joined.' })
    @Post('/join/:name')
    async joinChannel(@Param('name') name: string)
    {
        return this.channelService.joinChannel(name);
    }

    @ApiOperation({ summary: 'Quit a channel' })
    @ApiResponse({ status: 200, description: 'Channel quit.' })
    @Delete('/quit/:name')
    async quitChannel(@Param('name') name: string)
    {
        return this.channelService.quitChannel(name);
    }

    @ApiOperation({ summary: 'Update a channelType' })
    @ApiResponse({ status: 200, description: 'The channelType has been changed.' })
    @Patch('/update')
    async updateChannel(@Body() channelDto: updateChannelDto)
    {
        return this.channelService.updateChannel(channelDto);
    }

    @ApiOperation({ summary: 'Update a pwd channel' })
    @ApiResponse({ status: 200, description: 'The pwd has been changed.' })
    @Patch('/pwd')
    async setPwdChannel(@Body() channelDto: updatePwdChannelDto)
    {
        return this.channelService.setPwdChannel(channelDto);
    }

    @ApiOperation({ summary: 'Add an admin to channel' })
    @ApiResponse({ status: 201, description: 'Admin has been add.' })
    @Post('/admin')
    async setAdmin(@Body() channelDto: setAdminChannelDto)
    {
        return this.channelService.setAdminChannel(channelDto);
    }

    @ApiOperation({ summary: 'Invite someone to channel' })
    @ApiResponse({ status: 201, description: 'Invite created.' })
    @Post('/invite')
    async inviteToChannel(@Body() channelDto: inviteToChannelDto)
    {
        return this.channelService.inviteToChannel(channelDto);
    }
}
