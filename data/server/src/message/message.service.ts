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

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: typeof Message,

    // @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly channelsUtilsService: ChannelsUtilsService,
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

  async findForChannel(channelId: string, limit = 50) {
    let messages = await this.messageModel.findAll({
      where: { channelId },
      limit: limit,
    });

    console.log('messages: ', messages);
    let messagesDto = messages.map(
      (msg) =>
        new MessageDto(msg.content, msg.msgId, msg.userId, msg.createdAt),
    );
    return messagesDto;
  }

  async findForChannelBeforeMsgId(
    channelId: string,
    beforeMsgId: string,
    limit = 50,
  ) {
    const beforeConfidentialId = (
      await this.messageModel.findOne({
        where: { publicId: beforeMsgId },
        attributes: ['confidentialId'],
      })
    )?.confidentialId;
    if (beforeConfidentialId)
      throw new HttpException('Message ID doesnt exists', HttpStatus.NOT_FOUND);

    let messages = await this.messageModel.findAll({
      where: { channelId, confidentialId: { [Op.lt]: beforeConfidentialId } },
      limit: limit,
      attributes: this.attributesToRetrieve,
    });

    let messagesDto = messages.map(
      (msg) =>
        new MessageDto(msg.content, msg.msgId, msg.userId, msg.createdAt),
    );

    return messagesDto;
  }
  async addMessage(channelId: string, content: string, userId: string) {
    try {
      //make sure user and channel exists, it will throw an error if not
      await this.usersService.findById(userId);
      await this.channelsUtilsService.findById(channelId);
      console.log('message: ', content);
      const msg = await this.messageModel.create({
        content: content,
        chanId: channelId,
        userId: userId,
      });
      console.log('msg: ', msg);
      return new MessageDto(msg.content, msg.msgId, msg.userId, msg.createdAt);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.log('error: ', error);
      throw new HttpException('Cant create message', HttpStatus.BAD_REQUEST);
    }
  }
}
