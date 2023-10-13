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
import { RelationDto } from './dto/relation.dto';
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

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @ApiOperation({ summary: 'Add a friend' })
  @ApiResponse({ status: 201, description: 'The friend has been created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async createFriend(@Req() req, @Body() user: any) {
    console.log(req.user);
    const relationDto = new RelationDto(req.user.login, user.login);
    return this.friendsService.createFriend(relationDto);
  }

  @ApiOperation({ summary: 'Accept a friend' })
  @ApiResponse({ status: 202, description: 'The friend has been accepted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/accept')
  async AcceptFriend(@Body() relationDto: RelationDto) {
    return this.friendsService.acceptFriend(relationDto);
  }

  @ApiOperation({ summary: 'Block user' })
  @ApiResponse({ status: 202, description: 'The user has been blocked.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/block')
  async blockFriend(@Body() relationDto: RelationDto) {
    return this.friendsService.blockFriend(relationDto);
  }

  @ApiOperation({ summary: 'Delete friend or blocked user' })
  @ApiResponse({ status: 202, description: 'The friend or blocked user has been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('/delete')
  async deleteFriend(@Body() relationDto: RelationDto) {
    return this.friendsService.deleteFriend(relationDto);
  }

  @ApiOperation({ summary: 'Get all relations - DEBUG' })
  @ApiResponse({ status: 200, description: 'get all relations' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/all')
  async getAll(): Promise<Friends[]> {
    return this.friendsService.getAll();
  }

  @ApiOperation({ summary: 'Get pending-list of login' })
  @ApiResponse({ status: 200, description: 'get pending-list' })
  @Get('pending-list/:login')
  async getPendingList(@Param('login') login: string) {
    return this.friendsService.getPendingList(login);
  }

  @ApiOperation({ summary: 'Get friend-list of login' })
  @ApiResponse({ status: 200, description: 'get friend-list' })
  @Get('friend-list/:login')
  async getFriendList(@Param('login') login: string) {
    return this.friendsService.getFriendList(login);
  }

  @ApiOperation({ summary: 'Get block-list of login' })
  @ApiResponse({ status: 200, description: 'get blocked-list' })
  @Get('block-list/:login')
  async getBlockList(@Param('login') login: string) {
    return this.friendsService.getBlockList(login);
  }

  @ApiOperation({ summary: 'Delete all relations with login - DEBUG' })
  @ApiResponse({ status: 200, description: 'delete all relations contains login' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('/delete/:login')
  async deleteAll(@Param('login') login: string) {
    return this.friendsService.hardDelete(login);
  }
}