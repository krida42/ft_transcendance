import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { uuidv4, ChanType, UserStatus, ErrorMsg } from 'src/types';
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { UsersService } from '../users/users.service';
import { ChannelsGetService } from '../channels/channels-get.service';
import { ChannelsUtilsService } from './channels-utils.service';
import { FriendsService } from '../friends/friends.service';

// ---------- ADMIN
// POST addAdmin(currentId, chanId, userId): Promise<PublicUserDto> OK
// DELETE delAdmin(currentId, chanId, userId): Promise<PublicUserDto> OK

// ---------- INVITE
// POST invite(currentId, chanId, userId): Promise<PublicUserDto> OK
// DELETE uninvite(currentId, chanId, userId): Promise<PublicUserDto> OK

// ---------- BAN
// POST ban(currentId, chanId, userId): Promise<PublicUserDto> OK
// DELETE unban(currentId, chanId, userId): Promise<PublicUserDto> OK

// ---------- MUTE
// PATCH mute(currentId, chanId, userId): Promise<PublicUserDto> OK FIXME TIMER

// ---------- KICK
// DELETE kick(currentId, chanId, userId): Promise<PublicUserDto> OK

@Injectable()
export class ChannelsOpService {
  constructor(
    @InjectModel(Channels)
    private readonly channelModel: typeof Channels,
    private readonly channelsGetService: ChannelsGetService,
    private readonly usersService: UsersService,
    private readonly friendsService: FriendsService,
    private readonly utils: ChannelsUtilsService,

    @InjectModel(ChannelsUsers)
    private readonly channelUsersModel: typeof ChannelsUsers,
  ) {}

  // ---------- ADMIN
  async addAdmin(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkOwner(currentId, chanId);

    if (false == (await this.utils.userIsInChannel(userId, chanId)))
      throw new HttpException('user not in channel', HttpStatus.BAD_REQUEST);

    if (await this.utils.userIs(UserStatus.Admin, userId, chanId))
      throw new HttpException('is already admin', HttpStatus.NOT_MODIFIED);

    if (await this.utils.userIs(UserStatus.Owner, userId, chanId))
      throw new HttpException('owner cannot be admin', HttpStatus.FORBIDDEN);

    try {
      let user = await this.utils.getUserInChannel(userId, chanId);
      user.userStatus = UserStatus.Admin;
      await user.save();
      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.addAdminUser + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delAdmin(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkOwner(currentId, chanId);

    if (false == (await this.utils.userIsInChannel(userId, chanId)))
      throw new HttpException('user not in channel', HttpStatus.BAD_REQUEST);

    if (false == (await this.utils.userIs(UserStatus.Admin, userId, chanId)))
      throw new HttpException('user not admin', HttpStatus.BAD_REQUEST);

    try {
      let user = await this.utils.getUserInChannel(userId, chanId);
      user.userStatus = UserStatus.User;
      await user.save();
      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.delAdminUser + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------   INVITE
  async invite(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkAdminOrOwner(currentId, chanId);

    if (await this.utils.userIsInChannel(userId, chanId))
      throw new HttpException('already in channel', HttpStatus.BAD_REQUEST);

    if (await this.utils.userIs(UserStatus.Invited, userId, chanId))
      throw new HttpException('user already invited', HttpStatus.NOT_MODIFIED);

    if (await this.utils.userIs(UserStatus.Banned, userId, chanId))
      throw new HttpException('user banned', HttpStatus.FORBIDDEN);

    try {
      await this.channelUsersModel.create({
        chanId: chanId,
        userId: userId,
        userStatus: UserStatus.Invited,
      });
      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.inviteUser + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uninvite(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkAdminOrOwner(currentId, chanId);

    if (false == (await this.utils.userIs(UserStatus.Invited, userId, chanId)))
      throw new HttpException('user not invited', HttpStatus.BAD_REQUEST);

    try {
      const user = await this.utils.getInvitedUser(userId, chanId);
      user.destroy();
      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.uninviteUser + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- BAN
  async banUser(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkAdminOrOwner(currentId, chanId);

    if (await this.utils.userIs(UserStatus.Banned, userId, chanId))
      throw new HttpException('user already banned', HttpStatus.NOT_MODIFIED);

    if (await this.utils.userIs(UserStatus.Owner, userId, chanId))
      throw new HttpException('owner cannot be banned', HttpStatus.FORBIDDEN);

    if (await this.utils.userIs(UserStatus.Admin, userId, chanId))
      throw new HttpException('admin cannot be banned', HttpStatus.FORBIDDEN);

    let chan = await this.utils.findById(chanId);

    try {
      if (await this.utils.userIsInChannel(userId, chanId)) {
        let user = await this.utils.getUserInChannel(userId, chanId);
        user.userStatus = UserStatus.Banned;
        await user.save();
        chan.nbUser--;
        await chan.save();
      } else {
        await this.channelUsersModel.create({
          chanId: chanId,
          userId: userId,
          userStatus: UserStatus.Banned,
        });
      }

      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(ErrorMsg.banUser + error, HttpStatus.BAD_REQUEST);
    }
  }

  async unbanUser(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkAdminOrOwner(currentId, chanId);

    if (false == (await this.utils.userIs(UserStatus.Banned, userId, chanId)))
      throw new HttpException('user not banned', HttpStatus.BAD_REQUEST);

    try {
      const user = await this.utils.getBannedUser(userId, chanId);
      user.destroy();
      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.unbanUser + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- MUTE
  async mute(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkAdminOrOwner(currentId, chanId);

    if (false == (await this.utils.userIsInChannel(userId, chanId)))
      throw new HttpException('user not in channel', HttpStatus.BAD_REQUEST);

    if (await this.utils.userIs(UserStatus.Owner, userId, chanId))
      throw new HttpException('owner cannot be muted', HttpStatus.FORBIDDEN);

    if (await this.utils.userIs(UserStatus.Admin, userId, chanId))
      throw new HttpException('admin cannot be muted', HttpStatus.FORBIDDEN);

    try {
      let user = await this.utils.getUserInChannel(userId, chanId);
      user.userStatus = UserStatus.Muted;
      await user.save();

      const min = 1; // TODO TEST ME
      setTimeout(async () => {
        user.userStatus = UserStatus.User;
        await user.save();
      }, min * 60 * 1000);

      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.muteUser + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ---------- KICK
  async kick(
    currentId: uuidv4,
    chanId: uuidv4,
    userId: uuidv4,
  ): Promise<PublicUserDto> {
    await this.utils.checkId(chanId);
    await this.utils.checkUserIds(currentId, userId);
    await this.utils.checkAdminOrOwner(currentId, chanId);

    if (false == (await this.utils.userIsInChannel(userId, chanId)))
      throw new HttpException('user not in channel', HttpStatus.BAD_REQUEST);

    if (await this.utils.userIs(UserStatus.Owner, userId, chanId))
      throw new HttpException('owner cannot be kicked', HttpStatus.FORBIDDEN);

    if (await this.utils.userIs(UserStatus.Admin, userId, chanId))
      throw new HttpException('admin cannot be kicked', HttpStatus.FORBIDDEN);

    let chan = await this.utils.findById(chanId);

    try {
      const user = await this.utils.getUserInChannel(userId, chanId);
      await user.destroy();
      chan.nbUser--;
      await chan.save();
      return await this.utils.fetchPublicUserDto(userId);
    } catch (error) {
      throw new HttpException(
        ErrorMsg.kickUser + error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
