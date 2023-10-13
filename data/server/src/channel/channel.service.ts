import { Injectable } from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';
import { Channel } from 'db/models/channel';
import { createChannelDto } from './dto/createChannel.dto';
import { updateChannelDto } from './dto/updateChannel.dto';
import { updatePwdChannelDto } from './dto/updatePwdChannel.dto';
import { setAdminChannelDto } from './dto/setAdminChannel.dto';
import { inviteToChannelDto } from './dto/inviteToChannel.dto';

import {
    ChannelNotFoundException,
    ChannelAlreadyExistsException,
} from 'src/exceptions/exceptions1';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel)
    private readonly channelModel: typeof Channel,
  ) {}

    async createChannel(channelDto: createChannelDto): Promise<string> {
        const name = channelDto.name;
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (chan) {
            throw new ChannelAlreadyExistsException();
        }
        try {
            const newChannel = await this.channelModel.create({
                name: channelDto.name,
                owner: channelDto.owner,
                channelType: channelDto.channelType,
                pwd: channelDto.pwd,
            });
            return `Channel ${name} created.`;
        } catch (error) {
            throw new Error(`createChannel error: ${error.message}`);
        }
    }

    async deleteChannel(name: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            await chan.destroy();
            return `Channel ${name} deleted.`;
        } catch (error) {
            throw new Error(`deleteChannel error: ${error.message}`);
        }
    }

    async getAll(): Promise<Channel[]> {
        const all = await Channel.findAll({});
        console.log(all.every((chan) => chan instanceof Channel));
        console.log('All channels:', JSON.stringify(all, null, 2));
        return all;
    }

    async joinChannel(name: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // todo join channel
            return `Channel ${name} joined.`;
        } catch (error) {
            throw new Error(`joinChannel error: ${error.message}`);
        }
    }

    async quitChannel(name: string): Promise<string> {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // todo quit channel
            return `Channel ${name} quit.`;
        } catch (error) {
            throw new Error(`deleteChannel error: ${error.message}`);
        }
    }

    async updateChannel(channelDto: updateChannelDto): Promise<string> {
        const name = channelDto.name;
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            chan.channelType = channelDto.channelType; 
            await chan.save();
            return `Channel ${name} updated.`;
        } catch (error) {
            throw new Error(`updateChannel error: ${error.message}`);
        }
    }

    async setPwdChannel(channelDto: updatePwdChannelDto): Promise<string> {
        const name = channelDto.name;
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            chan.pwd = channelDto.pwd; 
            await chan.save();
            return `Channel ${name} password updated.`;
        } catch (error) {
            throw new Error(`setPwdChannel error: ${error.message}`);
        }
    }

    async setAdminChannel(channelDto: setAdminChannelDto): Promise<string> {
        const login = channelDto.login;
        const name = channelDto.name;
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        try {
            // todo set user to admin
            return `${login} is now admin of channel ${name}.`;
        } catch (error) {
            throw new Error(`setAdminChannel error: ${error.message}`);
        }
    }

    async inviteToChannel(channelDto: inviteToChannelDto): Promise<string> {
        const login = channelDto.login;
        const name = channelDto.name;
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
}
