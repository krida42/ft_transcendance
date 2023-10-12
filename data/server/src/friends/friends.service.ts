import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friends } from 'db/models/friends';
import { RelationDto } from './dto/relation.dto';
import {
  UniqueConstraintException,
  InvalidUUIDException,
  UserNotFoundException,
  InvalidRelationException,
  FriendAlreadyExistsException,
  RelationNotFoundException,
  AlreadyBlockedException,
} from 'src/exceptions';

enum FriendStatus {
  Pending = 'Pending',
  Active = 'Active',
  Blocked = 'Blocked',
}

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends)
    private readonly friendsModel: typeof Friends,
  ) {}

  async getAll(): Promise<Friends[]> {
    const all = await Friends.findAll({
    });
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('All relations:', JSON.stringify(all, null, 2));
    return all;
  }

  async getPendingList(login: string): Promise<Friends[]> {
    const all = await Friends.findAll({
       where: { 
        login: login,
        status: FriendStatus.Pending }
    });
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('Pending list:', JSON.stringify(all, null, 2));
    return all;
  }

  async getFriendList(login: string): Promise<Friends[]> {
    const all = await Friends.findAll({
       where: { 
        login: login,
        status: FriendStatus.Active }
    });
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('Friend list:', JSON.stringify(all, null, 2));
    return all;
  }

  async getBlockList(login: string): Promise<Friends[]> {
    const all = await Friends.findAll({
       where: { 
        login: login,
        status: FriendStatus.Blocked }
    });
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('Blocked list:', JSON.stringify(all, null, 2));
    return all;
  }

  async friendExists(login: string, linkedlogin: string): Promise<boolean> {
    const existingFriend = await this.friendsModel.findOne({
      where: { login, linkedlogin },
    });
    return !!existingFriend; 
  }

  async createFriend(relationDto: RelationDto): Promise<Friends> {

    if (relationDto.login === relationDto.linkedlogin) {
      throw new InvalidRelationException();
    }

    const friendAlreadyExists = await this.friendExists(
      relationDto.login,
      relationDto.linkedlogin
    );

    if (friendAlreadyExists) {
      throw new FriendAlreadyExistsException();
    }

    try {
      const newFriend = await this.friendsModel.create({
        login: relationDto.login,
        linkedlogin: relationDto.linkedlogin,
        status: FriendStatus.Pending,
      });
      return newFriend;
    } catch (error) {
      throw new Error('createFriend error: ' + error.message);
    }
  }

  async acceptFriend(relationDto: RelationDto): Promise<string> {

    const pendingFriend = await this.friendsModel.findOne({
      where: {
        login: relationDto.login,
        linkedlogin: relationDto.linkedlogin,
      },
    });

    if (!pendingFriend) {
      throw new RelationNotFoundException();
    }

    if (pendingFriend.status === FriendStatus.Active) {
      throw new FriendAlreadyExistsException();
    }

    if (pendingFriend.status === FriendStatus.Blocked) {
      throw new InvalidRelationException();
    }

    pendingFriend.status = FriendStatus.Active;
    await pendingFriend.save();
    return 'La relation a été acceptée avec succès.';
  }

  async blockFriend(relationDto: RelationDto) {
    const existingFriend = await this.friendsModel.findOne({
      where: {
        login: relationDto.login,
        linkedlogin: relationDto.linkedlogin,
      },
    });

    // si la relation n'existe pas deja on la cree
    if (!existingFriend) {
      try {
        const newBlock = await this.friendsModel.create({
          login: relationDto.login,
          linkedlogin: relationDto.linkedlogin,
          status: FriendStatus.Blocked,
        });
        return 'La relation a été bloquée avec succès.';
      } catch (error) {
        throw new Error('blockFriend error: ' + error.message);
      }
    }

    // si deja bloque on fais rien
    if (existingFriend.status === FriendStatus.Blocked) {
      throw new AlreadyBlockedException();
    }

    existingFriend.status = FriendStatus.Blocked;
    await existingFriend.save();
    return 'La relation a été bloquée avec succès.';
  }

  async deleteFriend(relationDto: RelationDto): Promise<string> {

    const existingFriend = await this.friendsModel.findOne({
      where: {
        login: relationDto.login,
        linkedlogin: relationDto.linkedlogin,
      },
    });

    if (!existingFriend) {
      throw new RelationNotFoundException();
    }
    // on destroy la relation si elle existe
    await existingFriend.destroy();
    return 'La relation a été supprimée avec succès.';
  }

}
