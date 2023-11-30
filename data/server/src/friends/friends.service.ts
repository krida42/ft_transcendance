import { Injectable } from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Friends } from 'db/models/friends';
import {
  UniqueConstraintException,
  InvalidUUIDException,
  UserNotFoundException,
  ImpossibleRelationException,
  FriendAlreadyExistsException,
  RelationNotFoundException,
  AlreadyBlockedException,
} from 'src/exceptions/exceptions1';

import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';

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

    private readonly usersService: UsersService,
  ) {}

  async createFriend(login: string, linkedlogin: string): Promise<Friends> {

    const user = this.usersService.findByLogin(login);
    if (!user) {
      throw new UserNotFoundException();
    }

    const linkedUser = this.usersService.findByLogin(linkedlogin);
    if (!linkedUser) {
      throw new UserNotFoundException();
    }

    if (login === linkedlogin) {
      throw new ImpossibleRelationException();
    }

    const friendAlreadyExists = await this.friendExists(
      login,
      linkedlogin
    );

    const friendAlreadyExists2 = await this.friendExists(
      linkedlogin,
      login
    );

    if (friendAlreadyExists || friendAlreadyExists2) {
      throw new ImpossibleRelationException();
    }

    try {
      const newFriend = await this.friendsModel.create({
        login: login,
        linkedlogin: linkedlogin,
        status: FriendStatus.Pending,
      });
      return newFriend;
    } catch (error) {
      throw new Error('createFriend error: ' + error.message);
    }
  }

  async acceptFriend(login: string, linkedlogin: string): Promise<string> {

    const pendingFriend = await this.friendsModel.findOne({
      where: {
        login: login,
        linkedlogin: linkedlogin,
      },
    });

    if (!pendingFriend) {
      throw new RelationNotFoundException();
    }

    if (pendingFriend.status === FriendStatus.Active) {
      throw new FriendAlreadyExistsException();
    }

    if (pendingFriend.status === FriendStatus.Blocked) {
      throw new ImpossibleRelationException();
    }

    try {
      const mirrorRelation = await this.friendsModel.create({
        login: linkedlogin,
        linkedlogin: login,
        status: FriendStatus.Active,
      });
    } catch (error) {
      throw new Error('create mirrorRelation error: ' + error.message);
    }

    pendingFriend.status = FriendStatus.Active;
    await pendingFriend.save();
    return 'Demande acceptée.';
  }

  async declineFriend(login: string, linkedlogin: string): Promise<string> {
    const pendingFriend = await this.friendsModel.findOne({
      where: {
        login: login,
        linkedlogin: linkedlogin,
      },
    });

    if (!pendingFriend) {
      throw new RelationNotFoundException();
    }
    if (pendingFriend.status === FriendStatus.Active) {
      throw new FriendAlreadyExistsException();
    }
    // if (pendingFriend.status === FriendStatus.Blocked) {
      // throw new ImpossibleRelationException();
    // }
    await pendingFriend.destroy();
    return 'Demande déclinée.';
  }

  async blockFriend(login: string, linkedlogin: string) {
    const existingFriend = await this.friendsModel.findOne({
      where: {
        login: login,
        linkedlogin: linkedlogin,
      },
    });

    if (existingFriend) {
    // destroy la relation mirroir si elle existe et est active
      if (existingFriend.status === FriendStatus.Active) {
        const mirrorRelation = await this.friendsModel.findOne({
          where: {
            login: linkedlogin,
            linkedlogin: login,
            status: FriendStatus.Active
          },
        });

        if (mirrorRelation) {
          await mirrorRelation.destroy();
        }
      }
    }

    // si la relation n'existe pas deja on la cree
    if (!existingFriend) {
      try {
        const newBlock = await this.friendsModel.create({
          login: login,
          linkedlogin: linkedlogin,
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

  async deleteFriend(login: string, linkedlogin: string): Promise<string> {

    const existingFriend = await this.friendsModel.findOne({
      where: {
        login: login,
        linkedlogin: linkedlogin,
      },
    });

    if (!existingFriend) {
      throw new RelationNotFoundException();
    }
    // on destroy la relation si elle existe
    await existingFriend.destroy();

    // destroy la relation mirroir si elle existe et n'est pas 'Blocked'
    const mirrorRelation = await this.friendsModel.findOne({
      where: {
        login: linkedlogin,
        linkedlogin: login,
      },
    });

    if (mirrorRelation && mirrorRelation.status != FriendStatus.Blocked) {
      await mirrorRelation.destroy();
    }

    return 'La relation a été supprimée avec succès.';
  }

  async getSentRequests(login: string): Promise<Friends[]> {
    const all = await Friends.findAll({
       where: { 
        login: login,
        status: FriendStatus.Pending }
    });
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('Friends requests sent:', JSON.stringify(all, null, 2));
    return all;
  }

  async getReceivedRequests(login: string): Promise<Friends[]> {
    const all = await Friends.findAll({
       where: { 
        linkedlogin: login,
        status: FriendStatus.Pending }
    });
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('Friends requests received: ', JSON.stringify(all, null, 2));
    return all;
  }

  async getFriends(login: string): Promise<Friends[]> {
    const all = await Friends.findAll({
       where: { 
        login: login,
        status: FriendStatus.Active }
    });
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('Friend list:', JSON.stringify(all, null, 2));
    return all;
  }

  async getBlocked(login: string): Promise<Friends[]> {
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



  // ----- ----- DEBUG -----

  async getAll(): Promise<Friends[]> {
    const all = await Friends.findAll({});
    console.log(all.every((relation) => relation instanceof Friends));
    console.log('All relations:', JSON.stringify(all, null, 2));
    return all;
  }

  async hardDelete(login: string): Promise<string> {
    try {
      const deletedEntries = await Friends.destroy({
        where: {
          [Op.or]: [
            { login: login },
            { linkedlogin: login },
          ],
        },
      });

      return `Relations with ${login} deleted. ${deletedEntries} entries were deleted.`;
    } catch (error) {
      throw new Error(`Error during hardDelete: ${error.message}`);
    }
  }

}
