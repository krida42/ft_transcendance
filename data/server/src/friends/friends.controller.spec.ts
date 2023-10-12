import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/relation.dto';

enum FriendStatus {
  Pending = 'Pending',
  Active = 'Active',
  Blocked = 'Blocked',
}

describe('FriendsController', () => {
    let friendsController: FriendsController;
    let friendsService: FriendsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FriendsController],
            providers: [FriendsService],
        }).compile();

        friendsController = module.get<FriendsController>(FriendsController);
        friendsService = module.get<FriendsService>(FriendsService);
    });

    it('should be defined', () => {
        expect(friendsController).toBeDefined();
    });

    it('should create a friend', async () => {
        const createFriendDto: CreateFriendDto = {
            public_id_user: 'public_id_utilisateur',
            public_id_friend: 'public_id_ami',
            status: FriendStatus.Pending,
        };

        const result = {
            public_id_user: 'public_id_utilisateur',
            public_id_friend: 'public_id_ami',
            status: FriendStatus.Pending,
        };
        jest.spyOn(friendsService, 'createFriend').mockImplementation(async () => result);
        const response = await friendsController.createFriend(createFriendDto);
        expect(response).toBe(result);
    });
});
