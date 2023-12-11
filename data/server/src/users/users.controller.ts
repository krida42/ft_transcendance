import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
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
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { User } from 'db/models/user';
import { UpdateUserDto } from './dto/updateUser.dto';
import { DeveloperGuard } from './dev.guard';
import { AuthGuard } from '@nestjs/passport';
import { ReqU, uuidv4 } from 'src/types';
import { AddMessageDto } from 'src/message/dto/addMessage.dto';
import { MessageService } from 'src/message/message.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Find one user by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUIDv4 of the user',
  })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: uuidv4): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async find(@Query('pseudo') pseudo: string) {
    const { public_id } = await this.usersService.findByPseudo(pseudo);
    const foundUserNotSafe = await this.usersService.findById(public_id);
    return await UsersService.userModelToPublicUserDto(foundUserNotSafe);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('create user - - - - - - ');
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  // @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUIDv4 of the user',
  })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: any },
  ) {
    console.log('update user, req.user.public_id:', req.user.public_id);
    return this.usersService.updateUser(req.user.public_id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUIDv4 of the user',
  })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<number> {
    return this.usersService.deleteUser(id);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), DeveloperGuard)
  @ApiOperation({ summary: 'Delete all users' })
  @ApiResponse({
    status: 200,
    description: 'All users have been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async deleteAllUsers(): Promise<number> {
    console.log('delete all users');
    return this.usersService.deleteAllUsers();
  }

  @ApiOperation({ summary: 'Send a message' })
  // @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post(':userId/messages')
  async sendMessage(
    @Req() req: ReqU,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() addMessageDto: AddMessageDto,
  ) {
    const sender_id = 'a91d18ca-e817-4ee8-9f3d-6dfd31d8ba57';
    const receiver_id = '6743cbee-7aa2-4ea2-a909-9b0181db4651';
    return this.messageService.addMessage(
      // userId,
      receiver_id,

      addMessageDto.content,
      // req.user.public_id,
      sender_id,
    );
  }
}
