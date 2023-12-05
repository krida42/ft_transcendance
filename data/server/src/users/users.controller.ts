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
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { User } from 'db/models/user';
import { UpdateUserDto } from './dto/updateUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { DeveloperGuard } from './dev.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  private public_id: string; // TEMP
  private static isFirstUserConnected = true; // TEMP
  constructor(private readonly usersService: UsersService) {
    this.setCurrentId(); // TEMP
  }
  async setCurrentId() {
    // TEMP
    let user: User;
    if (UsersController.isFirstUserConnected === true) {
      user = await this.usersService.findByLogin('marvin');
      UsersController.isFirstUserConnected = false;
    } else {
      user = await this.usersService.findByLogin('ben');
      UsersController.isFirstUserConnected = true;
    }
    if (user && user.public_id) {
      this.public_id = user.public_id;
    } else {
      console.error("L'utilisateur ou sa propriété 'public_id' est null.");
    }
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  find(
    @Query('bool') bool: string,
    @Query('pseudo') pseudo: string,
  ): Promise<User[] | User> {
    if (bool === 'true') return this.usersService.findAll();
    else if (pseudo) return this.usersService.findByPseudo(pseudo);
  }

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

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'UUIDv4 of the user',
  })
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    console.log('this.public_id: ', this.public_id);
    console.log(
      'new ParseUUIDPipe(req.user.id): ',
      new ParseUUIDPipe(this.public_id as uuidv4),
    );
    return this.usersService.updateUser(this.public_id, updateUserDto);
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
}
