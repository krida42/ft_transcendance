import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { isUUID } from 'class-validator';
import { Friends } from 'db/models/friends';

@Injectable()
export class FriendsService {

  constructor(
    @InjectModel(Friends)
    private usersModel: typeof Friends,
  ) {}

  private attributesToRetrieve = [
    'public_id_user',
    'public_id_friend',
    'status',
  ];

  async findAll() {
    const friends = await Friends.findAll({
      attributes: this.attributesToRetrieve,
    });
    console.log(friends.every((friends) => friends instanceof Friends));
    console.log('All users-friends:', JSON.stringify(friends, null, 2));
    return friends;
  }

  async AddFriend(id_user: uuidv4, id_friend: uuidv4)
  {}

  async AcceptFriend(id_user: uuidv4, id_friend: uuidv4)
  {}

  async deleteFriend(id_user: uuidv4, id_friend: uuidv4)
  {}

  async blockUser(id_user: uuidv4, id_toBlock: uuidv4)
  {}

  async getUserFriendsList(id_user: uuidv4)
  {}

}
