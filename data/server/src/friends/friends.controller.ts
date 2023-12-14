import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { uuidv4 } from 'src/types';
import { AuthGuard } from '@nestjs/passport';

import { FriendsService } from './friends.service';
import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { ReqU } from 'src/types';

@ApiTags('friends v4 (jwt OFF)')
@Controller('')
export class FriendsController {
  // private public_id: string | null = null; // TEMP
  // private static isFirstUserConnected = true; // TEMP

  constructor(
    private readonly friendsService: FriendsService,
    private readonly usersService: UsersService, // TEMP
  ) {
    // this.setCurrentId(); // TEMP
  }
  /*
  async setCurrentId() {
    // TEMP
    let user: User | null;
    if (FriendsController.isFirstUserConnected === true) {
      user = await this.usersService.findByLogin('marvin');
      FriendsController.isFirstUserConnected = false;
    } else {
      user = await this.usersService.findByLogin('ben');
      FriendsController.isFirstUserConnected = true;
    }
    if (user && user.public_id) {
      req.user.public_id = user.public_id;
    } else {
      console.error("L'utilisateur ou sa propriété 'public_id' est null.");
    }
  }
  */

  // ---------- GET
  //
  @ApiOperation({ summary: 'Get your active friends list' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/friends')
  async getFriends(@Req() req: ReqU) {
    return await this.friendsService.getFriends(req.user.public_id);
  }

  @ApiOperation({ summary: 'Get friend requests you have received' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/friends-received')
  async getReceivedRequests(@Req() req: ReqU) {
    return await this.friendsService.getReceivedRequests(req.user.public_id);
  }

  @ApiOperation({ summary: 'Get friend requests you have sent' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/friends-sent')
  async getSentRequests(@Req() req: ReqU) {
    return await this.friendsService.getSentRequests(req.user.public_id);
  }

  @ApiOperation({ summary: 'Get your blocked list' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get('/blocked')
  async getBlocked(@Req() req: ReqU) {
    return await this.friendsService.getBlocked(req.user.public_id);
  }

  // ACCEPT / DECLINE

  @ApiOperation({ summary: 'Accept a friend request' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Patch('/friends/:userId/accept')
  async acceptFriendRequest(@Req() req: ReqU, @Param('userId') userId: uuidv4) {
    return await this.friendsService.acceptFriend(req.user.public_id, userId);
  }

  @ApiOperation({ summary: 'Decline a friend request' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/friends/:userId/decline')
  async declineFriendRequest(
    @Req() req: ReqU,
    @Param('userId') userId: uuidv4,
  ) {
    return await this.friendsService.deleteFriend(req.user.public_id, userId);
  }

  // ADD / CANCEL
  // console.log('req.user.login:', req.user.login); FIXME

  @ApiOperation({ summary: 'Add a friend' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/friends/:userId/add')
  async createFriendRequest(@Req() req: ReqU, @Param('userId') userId: uuidv4) {
    return await this.friendsService.createFriend(req.user.public_id, userId);
  }

  @ApiOperation({ summary: 'Cancel a friend request' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/friends/:userId/cancel')
  async cancelFriendRequest(@Req() req: ReqU, @Param('userId') userId: uuidv4) {
    return await this.friendsService.cancelFriend(req.user.public_id, userId);
  }

  // ---------- BLOCK / UNBLOCK

  @ApiOperation({ summary: 'Block someone' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post('/friends/:userId/block')
  async blockFriend(@Req() req: ReqU, @Param('userId') userId: uuidv4) {
    return await this.friendsService.blockFriend(req.user.public_id, userId);
  }

  @ApiOperation({ summary: 'Unblock someone' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/friends/:userId/unblock')
  async unblockFriend(@Req() req: ReqU, @Param('userId') userId: uuidv4) {
    return await this.friendsService.unblockFriend(req.user.public_id, userId);
  }

  // DELETE FRIEND

  @ApiOperation({ summary: 'Delete friend or unblock user' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Delete('/friends/:userId/delete')
  async deleteFriend(@Req() req: ReqU, @Param('userId') userId: uuidv4) {
    return await this.friendsService.deleteFriend(req.user.public_id, userId);
  }
}
