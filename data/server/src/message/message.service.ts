import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from 'db/models/message';
import { MessageDto } from './dto/message.dto';
import { Op } from 'sequelize';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: typeof Message,
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
}
