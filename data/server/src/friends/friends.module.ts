import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Friends } from 'db/models/friends';

@Module({
    imports: [SequelizeModule.forFeature([Friends])],
    controllers: [FriendsController],
    providers: [FriendsService],
    exports: [FriendsService],
})
export class FriendsModule { }
