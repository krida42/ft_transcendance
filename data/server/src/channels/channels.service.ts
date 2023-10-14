import { Injectable } from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';
import { Channels } from 'db/models/channels';
import { createChannelDto } from './dto/createChannel.dto';
import { updateChannelDto } from './dto/updateChannel.dto';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';

import {
    ChannelNotFoundException,
    ChannelAlreadyExistsException,
} from 'src/exceptions/exceptions1';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,
  ) {}

    async createChannel(login: string, channelDto: createChannelDto): Promise<string> {
        const name = channelDto.name;
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (chan) {
            throw new ChannelAlreadyExistsException();
        }
        try {
            const newChannel = await this.channelModel.create({
                name: channelDto.name,
                owner: login,
                channelType: channelDto.channelType,
                pwd: channelDto.password, // FIXME is optional//can be undefined
            });
            return `Channel ${name} created.`;
        } catch (error) {
            throw new Error(`createChannel error: ${error.message}`);
        }
    }

    async deleteChannel(login: string, name: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel

        try {
            await chan.destroy();
            return `Channel ${name} deleted.`;
        } catch (error) {
            throw new Error(`deleteChannel error: ${error.message}`);
        }
    }


    async joinChannel(login: string, name: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
            // TODO check chan type with user invite or pwd
            // TODO check  user isnt already in chan

        try {

            const userr = this.usersService.findByLogin(login);
            // TODO add user to chan
            const user = await User.findByPk((await userr).id);
            const channelId = 0;
            const channel = await Channels.findByPk(channelId);

            if (user && channel) {
                // await user.addChannel(channel);
            }


            return `Channel ${name} joined.`;
        } catch (error) {
            throw new Error(`joinChannel error: ${error.message}`);
        }
    }

    async quitChannel(login: string, name: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
            // TODO check user is in chan

        try {
            // TODO remove user from chan
            return `Channel ${name} quit.`;
        } catch (error) {
            throw new Error(`deleteChannel error: ${error.message}`);
        }
    }

    async updateChannel(login: string, name: string, channelDto: updateChannelDto): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel
        // TODO check new mode != current mode

        try {
            chan.channelType = channelDto.channelType; 
            chan.password = channelDto.password
            await chan.save();
            // return `Channel ${name} password updated.`;
            return `Channel ${name} updated.`;
        } catch (error) {
            throw new Error(`updateChannel error: ${error.message}`);
        }
    }

    async addAdminChannel(login: string, name: string, userId: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel
        try {
            // todo set user to admin
            return `${login} is now admin of channel ${name}.`;
        } catch (error) {
            throw new Error(`addAdminChannel error: ${error.message}`);
        }
    }

    async delAdminChannel(login: string, name: string, userId: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel
        try {
            // todo UNSET user admin
            return `${login} admin deleted from channel ${name}.`;
        } catch (error) {
            throw new Error(`delAdminChannel error: ${error.message}`);
        }
    }

    async inviteToChannel(login: string, name:string, userId: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // todo send invite to user
            return `${login} invited to channel ${name}.`;
        } catch (error) {
            throw new Error(`inviteToChannel error: ${error.message}`);
        }
    }

    async getChannels(login: string, state: string): Promise<Channels[]> {
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
    
    async getAll(): Promise<Channels[]> {
        const all = await Channels.findAll({});
        console.log(all.every((chan) => chan instanceof Channels));
        console.log('All channels:', JSON.stringify(all, null, 2));
        return all;
    }
}
