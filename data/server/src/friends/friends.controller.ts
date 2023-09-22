import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FriendsService } from './friends.service';
import { Friends } from 'db/models/friends';

@ApiBearerAuth()
@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly FriendsService: FriendsService) {}

  @Get()
  @ApiOperation({ summary: 'Find all user-friends' })
  @ApiResponse({ status: 200, description: 'Return all users-friends.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query('bool') bool: string): Promise<Friends[]> {
    if (bool === "true")
      return this.FriendsService.findAll();
  }
}
