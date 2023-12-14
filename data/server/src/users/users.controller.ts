import {
  Bind,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseFilePipeBuilder,
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
import { UsersService, responseUser } from './users.service';
import { User } from 'db/models/user';
import { UpdateUserDto } from './dto/updateUser.dto';
import { DeveloperGuard } from './dev.guard';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

import { ReqU, uuidv4 } from 'src/types';
import { AddMessageDto } from 'src/message/dto/addMessage.dto';
import { MessageService } from 'src/message/message.service';
import { MessageDto } from 'src/message/dto/message.dto';
import { ResponseUserDto } from './dto/responseUser.dto';
import { AddMessageResponseDto } from 'src/message/dto/addMessageResponse.dto';
import { PublicUserDto } from './dto/publicUser.dto';
import { isUUID } from 'class-validator';
import { InvalidUUIDException } from 'src/exceptions/exceptions';
import { ChannelsUtilsService } from 'src/channels/channels-utils.service';
import { InjectModel } from '@nestjs/sequelize';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
    private readonly channelsUtilsService: ChannelsUtilsService,
    @InjectModel(User)
    private usersModel: typeof User,
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
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: any },
  ): Promise<PublicUserDto | ResponseUserDto> {
    if (id === 'me' || id === req.user.public_id) {
      const resUser: any = await responseUser(req.user);
      resUser.id = req.user.public_id;
      delete resUser.public_id;
      return resUser;
    }
    if (!isUUID(id, 4)) throw new InvalidUUIDException();
    const foundUser = await this.usersService.findById(id);
    return await UsersService.userModelToPublicUserDto(foundUser);
  }

  @Get()
  @ApiOperation({ summary: 'Find user by pseudo' })
  @ApiResponse({ status: 200, description: 'Return user public instance.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async find(@Query('pseudo') pseudo: string) {
    if (!pseudo)
      throw new HttpException('Missing pseudo', HttpStatus.BAD_REQUEST);
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
  ): Promise<Array<boolean | null> | Array<boolean | ResponseUserDto>> {
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
    return this.usersService.deleteAllUsers();
  }

  @ApiOperation({ summary: 'Send a message' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Post(':receiverId/messages')
  async sendMessage(
    @Req() req: ReqU,
    @Param('receiverId', ParseUUIDPipe) receiverId: string,
    @Body() addMessageDto: AddMessageDto,
  ): Promise<AddMessageResponseDto> {
    return this.messageService.sendMessageToFriend(
      req.user.public_id,
      receiverId,
      addMessageDto,
    );
  }

  @ApiOperation({ summary: 'Get all messages' })
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Get(':userId/messages')
  async getAllMessages(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() req: ReqU,
  ): Promise<MessageDto[]> {
    const chanId = await this.channelsUtilsService.getDirectChanId(
      userId,
      req.user.public_id,
    );
    if (!chanId) {
      throw new HttpException('No direct channel', HttpStatus.NOT_FOUND);
    }

    return this.messageService.findForChannel(chanId);
  }

  @Get('/is2fa')
  async get2fa(@Req() req: ReqU) {
    return await this.usersService.get2fa(req.user.public_id);
  }

  // ---------- POST IMG

  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @Patch('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: ReqU,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: 15 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    await this.usersService.findById(req.user.public_id);

    // console.log('----- FILE -----');
    // console.log(file);
    // console.log('----- END FILE -----');

    try {
      const dirPath = `/app/dist/public/`;
      const fileName = `${req.user.public_id}_user_image.${
        file.mimetype.split('/')[1]
      }`;
      // console.log('FILE PATH:', dirPath + fileName);
      const imageUrl = 'http://localhost:3001/' + fileName;
      // console.log('FILE URL: ', imageUrl);

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      fs.writeFileSync(dirPath + fileName, file.buffer, { flag: 'w' });

      // user.avatar = imageUrl;
      // await user.save();

      const retUpdateNotSafe = await this.usersModel.update(
        { avatar: imageUrl },
        { where: { public_id: req.user.public_id }, individualHooks: true },
      );

      return { message: 'File uploaded successfully', imageUrl };
    } catch (error) {
      throw new HttpException('UploadImage' + error, HttpStatus.BAD_REQUEST);
    }
  }
}
