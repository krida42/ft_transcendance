import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
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

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'Return all users.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'UUIDv4 of the user' })
  @ApiResponse({ status: 200, description: 'Return the user.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBadRequestResponse({ description: 'User not found' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
  
  @Get('pseudo/:pseudo')
  @ApiOperation({ summary: 'Find user by pseudo' })
  @ApiParam({ name: 'pseudo', type: 'string', description: 'Pseudo of the user' })
  @ApiBadRequestResponse({ description: 'User not found' })
  findByPseudo(@Param('pseudo') pseudo: string): Promise<User> {
    return this.usersService.findByPseudo(pseudo);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'UUIDv4 of the user' })
  async update( @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid', description: 'UUIDv4 of the user' })
  async deleteUser(@Param('id') id: string): Promise<number> {
    return this.usersService.deleteUser(id);
  }
}
