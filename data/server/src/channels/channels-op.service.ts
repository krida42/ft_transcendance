import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';

import { createChannelDto } from './dto/createChannel.dto';
import { updateChannelDto } from './dto/updateChannel.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { DestroyOptions } from 'sequelize/types';

import {
    ChannelNotFoundException,
    ChannelAlreadyExistsException,
} from 'src/exceptions/exceptions1';
import { UserNotFoundException } from 'src/exceptions/exceptions';

@Injectable()
export class ChannelsOpService {
  constructor(

    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,

  ) {}

    // ----------   INVITE

    async inviteToChannel(login: string, name:string, userId: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // todo send invite to user
            return `${login} invited to channel ${name}.`;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // ----------   OWNER / ADMIN OPERATIONS

    async addAdminChannel(login: string, name: string, userId: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel
        try {
            // todo set user to admin
            return `${login} is now admin of channel ${name}.`;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async delAdminChannel(login: string, name: string, userId: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel
        try {
            // todo UNSET user admin
            return `${login} admin deleted from channel ${name}.`;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // temps de mute 5 min / 1h / 3h
    async muteUser(login: string, name:string, userId: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // TODO mute userId in db
            return `${userId} muted in ${name}.`;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async kickUser(login: string, name:string, userId: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // TODO kick userId in db
            return `${userId} muted in ${name}.`;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async banUser(login: string, name:string, userId: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // TODO ban userId in db
            return `${userId} muted in ${name}.`;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // ONLY with owner
    async unbanUser(login: string, name:string, userId: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // TODO ban userId in db
            return `${userId} muted in ${name}.`;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}

