import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';

import { Channels } from 'db/models/channels';
import { ChannelsBanlist } from 'db/models/channelsBanlist';
import { ChannelsUsers } from 'db/models/channelsUsers';

import { createChannelDto } from './dto/createChannel.dto';
import { updateChannelDto } from './dto/updateChannel.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { DestroyOptions } from 'sequelize/types';
import { Sequelize, Op } from 'sequelize';


import {
    ChannelNotFoundException,
    ChannelAlreadyExistsException,
} from 'src/exceptions/exceptions1';
import { UserNotFoundException } from 'src/exceptions/exceptions';

@Injectable()
export class ChannelsGetService {
  constructor(

    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,

    @InjectModel(ChannelsBanlist)
    private readonly channelBanlistModel: typeof ChannelsBanlist,

  ) {}

    // ----------   GET CHANNELS

    // get channels public pas encore rejoins par user (tri en nombre d'user + vers -)

    async getChannels(login: string, state: string): Promise<Channels[]>
    {
        if (state === 'joined') {
            return this.getAll(); // FIXME
        }
        else if (state === 'not-joined') {
            return this.getAll(); // FIXME
        }
        else {
            return this.getAll();
        }
    }

    async getChannelsWithUser(user: string): Promise<Channels[]>
    {

        const userChannels = await this.channelUsersModel.findAll({
            where: { userId: user },
        });

        const channelIds = userChannels.map((userChannel) => userChannel.channelId);
        const channels = await Channels.findAll({ where: { id: channelIds } });
        return channels;
    }

    async getChannelsWithoutUser(user: string): Promise<Channels[]>
    {
        const userChannels = await this.channelUsersModel.findAll({
            where: { userId: user },
        });

        const channelIds = userChannels.map((userChannel) => userChannel.channelId);

        const channelsWithoutUser = await Channels.findAll({
            where: {
                id: { [Op.notIn]: channelIds, },
                channelType: 'Public',
            },
        });

        return channelsWithoutUser;
    }

    async getChannelUsers(name: string): Promise<User[]>
    {

        const channel = await Channels.findOne({ where: { name: name } });
        if (!channel) {
            throw new ChannelNotFoundException();
        }

        const userChannels = await this.channelUsersModel.findAll({
            where: { channelId: channel.id },
        });

        const userIds = userChannels.map((userChannel) => userChannel.userId);
        const users = await this.usersService.findByIds(userIds);

        return Array.isArray(users) ? users : [users];
    }

    async getChannelBanlist(name: string): Promise<User[]>
    {

        const channel = await Channels.findOne({ where: { name: name } });
        if (!channel) {
            throw new ChannelNotFoundException();
        }

        const banlist = await this.channelBanlistModel.findAll({
            where: { channelId: channel.id, isBanned: true },
        });

        const userIds = banlist.map((bannedUser) => bannedUser.userId);
        const bannedUsers = await this.usersService.findByIds(userIds);

        return Array.isArray(bannedUsers) ? bannedUsers : [bannedUsers];
    }
    
    
    async getAll(): Promise<Channels[]>
    {
        const all = await Channels.findAll({});
        console.log(all.every((chan) => chan instanceof Channels));
        console.log('All channels:', JSON.stringify(all, null, 2));
        return all;
    }


}
