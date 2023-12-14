import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from 'db/models/message';
import { MessageDto } from './dto/message.dto';
import { Op } from 'sequelize';
import { UsersService } from 'src/users/users.service';
import { ChannelsUtilsService } from 'src/channels/channels-utils.service';
import { v4 } from 'uuid';
import { AddMessageDto } from './dto/addMessage.dto';
import { AddMessageResponseDto } from './dto/addMessageResponse.dto';
import { ChatGateway } from 'src/realtime/chat.gateway';
import { ChanType } from 'src/types';
import { ChannelsGetService } from 'src/channels/channels-get.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: typeof Message,

    // @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly channelsUtilsService: ChannelsUtilsService,
    private readonly channelsGetService: ChannelsGetService,
    private readonly chatGateway: ChatGateway,
  ) {}

  private attributesToRetrieve = ['msgId', 'content', 'createdAt', 'userId'];
  //   async findForChannel(channelId: string, { limit = 50, beforeMsgId = null }) {
  //     if (beforeMsgId) {
  //       const beforeConfidentialId = (
  //         await this.messageModel.findOne({
  //           where: { publicId: beforeMsgId },
  //           attributes: ['confidentialId'],
  //         })
  //       )?.confidentialId;
  //       if (beforeConfidentialId)
  //         throw new HttpException(
  //           'Message ID doesnt exists',
  //           HttpStatus.NOT_FOUND,
  //         );
  //     }
  //   }

  async findForChannel(channelId: string) {
    await this.channelsUtilsService.findById(channelId);

    let messages = await this.messageModel.findAll({
      where: { chanId: channelId },
      // limit: limit,
    });

    // console.log('messages: ', messages);
    console.log('messages.length: ', messages.length);
    messages.forEach((msg) => console.log('msg: ', msg.content));
    let messagesDto = messages.map(
      (msg) =>
        new MessageDto(msg.content, msg.msgId, msg.userId, msg.createdAt),
    );
    return messagesDto;
  }
  /*
  async findForChannelBeforeMsgId(
    channelId: string,
    beforeMsgId: string,
    limit = 50,
  ) {
    await this.channelsUtilsService.findById(channelId);

    const beforeConfidentialId = (
      await this.messageModel.findOne({
        where: { msgId: beforeMsgId },
        attributes: ['confidentialId'],
      })
    )?.confidentialId;
    if (beforeConfidentialId)
      throw new HttpException('Message ID doesnt exists', HttpStatus.NOT_FOUND);

    let messages = await this.messageModel.findAll({
      where: {
        chanId: channelId,
        confidentialId: { [Op.lt]: beforeConfidentialId },
      },
      limit: limit,
      attributes: this.attributesToRetrieve,
    });

    let messagesDto = messages.map(
      (msg) =>
        new MessageDto(msg.content, msg.msgId, msg.userId, msg.createdAt),
    );

    return messagesDto;
  }
  */

  private async insertMessage(
    senderId: string,
    channelId: string,
    content: string,
  ) {
    try {
      //make sure user and channel exists, it will throw an error if not
      await this.usersService.findById(senderId);
      await this.channelsUtilsService.findById(channelId);
      console.log('message: ', content);
      const retMsg = await this.messageModel.create({
        content: content,
        chanId: channelId,
        userId: senderId,
      });
      // console.log('msg: ', retMsg);
      return new MessageDto(
        retMsg.content,
        retMsg.msgId,
        retMsg.userId,
        retMsg.createdAt,
        retMsg.chanId,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log('error: ', error);
      throw new HttpException('Cant create message', HttpStatus.BAD_REQUEST);
    }
  }

  async sendMessageToChannel(
    senderId: string,
    channelId: string,
    addMessageDto: AddMessageDto,
  ) {
    const insertedMsg = await this.insertMessage(
      senderId,
      channelId,
      addMessageDto.content,
    );

    await this.chatGateway.transmitMessageOfUserToChannel(
      senderId,
      channelId,
      insertedMsg,
    );
    return new AddMessageResponseDto(addMessageDto.msgId, insertedMsg.msgId);
  }

  async sendMessageToFriend(
    senderId: string,
    receiverId: string,
    addMessageDto: AddMessageDto,
  ) {
    // throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
    console.log('sendmessage to friend BEFORE');
    const chanId = await this.channelsUtilsService.getDirectChanId(
      senderId,
      receiverId,
    );
    console.log('sendmessage to frind chanId: ', chanId);
    if (!chanId) {
      throw new HttpException('No direct channel', HttpStatus.NOT_FOUND);
    }
    const insertedMsg = await this.insertMessage(
      senderId,
      chanId,
      addMessageDto.content,
    );

    await this.chatGateway.transmitMessageOfUserToUser(
      senderId,
      receiverId,
      insertedMsg,
    );
    return new AddMessageResponseDto(addMessageDto.msgId, insertedMsg.msgId);
  }
}
