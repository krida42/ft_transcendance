import {
  Bind,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { uuidv4 } from 'src/types';
import { ReqU } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async findOne(@Param('id', ParseUUIDPipe) id: uuidv4): Promise<User> {
    return await this.usersService.findById(id);
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
    return await this.usersService.createUser(createUserDto);
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
    return await this.usersService.updateUser(
      req.user.public_id,
      updateUserDto,
    );
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
    return await this.usersService.deleteUser(id);
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
    return await this.usersService.deleteAllUsers();
  }

  @Get('/is2fa')
  async get2fa(@Req() req: ReqU) {
    return await this.usersService.get2fa(req.user.public_id);
  }

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Req() req: ReqU,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('-----');
    console.log(file);
    console.log('-----');
    console.log('publicId: ', req.user.public_id);
    // TODO return user img url
  }
}
