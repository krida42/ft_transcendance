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
export class ChannelsService {
  constructor(

    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly usersService: UsersService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,

  ) {}

    // ----------   CREATE / DELETE / UPDATE CHANNEL

    async createChannel(login: string, channelDto: createChannelDto): Promise<string>
    {
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
            throw new BadRequestException(error.message);
        }
    }

    async deleteChannel(login: string, name: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel

        try {
            await chan.destroy();
            return `Channel ${name} deleted.`;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateChannel(login: string, name: string, channelDto: updateChannelDto): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }
        // TODO check login is admin / owner of the channel
        // TODO check new mode != current mode

        try {
            chan.chanType = channelDto.channelType; 
            chan.chanPassword = channelDto.password
            await chan.save();
            // return `Channel ${name} password updated.`;
            return `Channel ${name} updated.`;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async putImage(login: string, name: string, image: Express.Multer.File): Promise<string>
    {
        try {

            if (!image) {
                throw new BadRequestException('No image provided');
            }
    
            const chan = await this.channelModel.findOne({ where: { name: name } });
            if (!chan) {
                throw new ChannelNotFoundException();
            }

            chan.chanImage = image.buffer;

            return `${login} put image successfully on channel ${name}.`;
            // return { success: true, message: 'Image updated successfully' };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    // ----------   JOIN / QUIT CHANNEL

    async joinChannel(login: string, name: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }

        login = "test";
        const userr = await this.usersService.findByLogin(login);
        if (userr == null) {
            throw new ChannelAlreadyExistsException(); // 400
        }
        // const user = await User.findByPk((await userr).id);
        // if (!user) {
            // throw new UserNotFoundException();
        // }


        try {
            // TODO check  user isnt already in chan
            // TODO check chan type with user invite or pwd

            await this.channelUsersModel.create({
            userId: 1,
            channelId: chan.id,
            });

            return `Channel ${name} joined.`;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async quitChannel(login: string, name: string): Promise<string>
    {
        const chan = await this.channelModel.findOne({ where: { name: name } });
        if (!chan) {
            throw new ChannelNotFoundException();
        }

        const userr = this.usersService.findByLogin(login);
        const user = await User.findByPk((await userr).id);
        if (!user) {
            throw new UserNotFoundException();
        }

        try {
            // TODO check user is in chan
            // const channelId = 0;
            // const channel = await Channels.findByPk(channelId);

            const destroyOptions: DestroyOptions = {
                where: {
                    userId: user.id,
                    channelId: chan.id,
                },
            };
            await this.channelUsersModel.destroy(destroyOptions);
            // TODO set admint to owner if current owner quit
            return `Channel ${name} quit.`;

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

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


    // ----------   GET CHANNELS

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

    async getUserChannels(user: string): Promise<Channels[]>
    {

        const userChannels = await this.channelUsersModel.findAll({
            where: { userId: user },
        });

        const channelIds = userChannels.map((userChannel) => userChannel.chanId);
        const channels = await Channels.findAll({ where: { id: channelIds } });
        return channels;
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

    /*
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
    */
    
    
    async getAll(): Promise<Channels[]>
    {
        const all = await Channels.findAll({});
        console.log(all.every((chan) => chan instanceof Channels));
        console.log('All channels:', JSON.stringify(all, null, 2));
        return all;
    }


}
