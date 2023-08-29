import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'db/models/user';
import { CreateUserDto } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private usersModel: typeof User,
  ) {}

  async createUser(createUserDto : CreateUserDto){
    const user = await this.usersModel.create({
      public_id: uuidv4(), // Par exemple
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("User created:", JSON.stringify(user, null, 2));
    return user;
  }

  private attributesToRetrieve = ['public_id', 'email', 'pseudo', 'createdAt', 'updatedAt'];

  async findOne(id: string){
    const public_id = id;
    const user = await User.findOne({
        where: { public_id },
        attributes: this.attributesToRetrieve,
      }
    );
    return user;
  }

   async findAll(){
    const users = await User.findAll({
        attributes: this.attributesToRetrieve,
      }
    );
    console.log(users.every(user => user instanceof User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
    return users;
  }
}
