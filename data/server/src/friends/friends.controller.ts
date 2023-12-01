import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  ParseUUIDPipe,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { Friends } from 'db/models/friends';
import { FriendsService } from './friends.service';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('friends v3 (jwt OFF)')
@Controller('')
export class FriendsController {
  private public_id: string; // TEMP

  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService,
  ) {
    this.setCurrentId()
  }

  async setCurrentId()
  {
    // const user = await this.usersService.findByLogin("mv");
    const user = await this.usersService.findByLogin("sloquet");
    this.public_id = user.public_id;
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a friend' })
  @Post('/friends/:userId/add')
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  async createFriendRequest(@Req() req, @Param('userId') userId: uuidv4) {
    // console.log('req.user.login:', req.user.login);
    return this.friendsService.createFriendRequest(this.public_id, userId);
  }

  @ApiOperation({ summary: 'Accept a friend request' })
  @Patch('/friends/:userId/accept')
  async acceptFriendRequest(@Req() req, @Param('userId') userId: uuidv4) {
    return this.friendsService.acceptFriendRequest(this.public_id, userId);
  }

  @ApiOperation({ summary: 'Decline a friend request' })
  @Delete('/friends/:userId/decline')
  async declineFriendRequest(@Req() req, @Param('userId') userId: uuidv4) {
    return this.friendsService.declineFriendRequest(this.public_id, userId);
  }

  @ApiOperation({ summary: 'Decline a friend request' })
  @Delete('/friends/:userId/cancel')
  async cancelFriendRequest(@Req() req, @Param('userId') userId: uuidv4) {
    return this.friendsService.cancelFriendRequest(this.public_id, userId);
  }

  @ApiOperation({ summary: 'Block someone' })
  @Post('/friends/:userId/block')
  async blockFriend(@Req() req, @Param('userId') userId: uuidv4) {
    return this.friendsService.blockFriend(this.public_id, userId);
  }

  @ApiOperation({ summary: 'Delete friend or unblock user' })
  @Delete('/friends/:userId/delete')
  async deleteFriend(@Req() req, @Param('userId') userId: uuidv4) {
    return this.friendsService.deleteFriend(this.public_id, userId);
  }

  @ApiOperation({ summary: 'Get friend requests you have sent' })
  @Get('/friends-sent')
  async getSentRequests(@Req() req) {
    return this.friendsService.getSentRequests(this.public_id);
  }

  @ApiOperation({ summary: 'Get friend requests you have received' })
  @Get('/friends-received')
  async getReceivedRequests(@Req() req) {
    return this.friendsService.getReceivedRequests(this.public_id);
  }

  @ApiOperation({ summary: 'Get your active friends list' })
  @Get('/friends')
  async getFriends(@Req() req) {
    return this.friendsService.getFriends(this.public_id);
  }

  @ApiOperation({ summary: 'Get your blocked list' })
  @Get('/blocked')
  async getBlocked(@Req() req) {
    return this.friendsService.getBlocked(this.public_id);
  }
}
