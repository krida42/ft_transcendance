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

@ApiTags('friends v2 (jwt OFF)')
@Controller('')
export class FriendsController {
  private login: string;  // TEMP
  constructor(private readonly friendsService: FriendsService) {
    this.login = 'test'; // TEMP
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add a friend' })
  @Post('/friends/:userId/add')
  async createFriend(@Req() req, @Param('userId') userId: string) {
    console.log('createFriend');
    console.log(this.login+' : '+userId);
    return this.friendsService.createFriend(this.login, userId);
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Accept a friend request' })
  @Post('/friends/:userId/accept')
  async acceptFriend(@Req() req, @Param('userId') userId: string) {
    console.log('acceptFriend');
    console.log(this.login+' : '+userId);
    return this.friendsService.acceptFriend(this.login, userId);
  }

  // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Decline a friend request' })
  @Delete('/friends/:userId/decline')
  async declineFriend(@Req() req, @Param('userId') userId: string) {
    console.log('declineFriend');
    console.log(this.login+' : '+userId);
    return this.friendsService.declineFriend(this.login, userId);
  }

  @ApiOperation({ summary: 'Block someone' })
  // @UseGuards(AuthGuard('jwt'))
  @Post('/friends/:userId/block')
  async blockFriend(@Req() req, @Param('userId') userId: string) {
    console.log('blockFriend');
    console.log(this.login+' : '+userId);
    return this.friendsService.blockFriend(this.login, userId);
  }

  @ApiOperation({ summary: 'Delete friend or unblock user' })
  // @UseGuards(AuthGuard('jwt'))
  @Delete('/friends/:userId/delete')
  async deleteFriend(@Req() req, @Param('userId') userId: string) {
    console.log('deleteFriend');
    console.log(this.login+' : '+userId);
    return this.friendsService.deleteFriend(this.login, userId);
  }

  @ApiOperation({ summary: 'Get friend requests you have sent' })
  // @UseGuards(AuthGuard('jwt'))
  @Get('/friends-sent')
  async getSentRequests(@Req() req) {
    console.log('getSentRequests');
    const list = this.friendsService.getSentRequests(this.login);
    console.log(JSON.stringify(list, null, 2));
    return list;
  }

  @ApiOperation({ summary: 'Get friend requests you have received' })
  // @UseGuards(AuthGuard('jwt'))
  @Get('/friends-received')
  async getReceivedRequests(@Req() req) {
    console.log('getReceivedRequests');
    const list = this.friendsService.getReceivedRequests(this.login);
    console.log(JSON.stringify(list, null, 2));
    return list;
  }

  @ApiOperation({ summary: 'Get your active friends list' })
  // @UseGuards(AuthGuard('jwt'))
  @Get('/friends')
  async getFriends(@Req() req) {
    console.log('getFriends');
    const list = this.friendsService.getFriends(this.login);
    console.log(JSON.stringify(list, null, 2));
    return list;
  }

  @ApiOperation({ summary: 'Get your blocked list' })
  // @UseGuards(AuthGuard('jwt'))
  @Get('/blocked')
  async getBlocked(@Req() req) {
    console.log('getBlocked');
    const list = this.friendsService.getBlocked(this.login);
    console.log(JSON.stringify(list, null, 2));
    return list;
  }

  @ApiOperation({ summary: 'DEBUG - Get all relations' })
  @Get('/friends-all')
  async getAll(): Promise<Friends[]> {
    console.log('getAll');
    const list = this.friendsService.getAll();
    console.log(JSON.stringify(list, null, 2));
    return list;
  }

  @ApiOperation({ summary: 'DEBUG - Delete all relations with login' })
  @Delete('/friends/:login/full-delete')
  async hardDelete(@Param('login') login: string) {
    console.log('hardDelete');
    const list = this.friendsService.hardDelete(login);
    console.log(list);
    return list;
  }
}