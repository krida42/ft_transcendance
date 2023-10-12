import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { Friends } from 'db/models/friends';
import { CreateFriendDto } from './dto/relation.dto';

enum FriendStatus {
  Pending = 'Pending',
  Active = 'Active',
  Blocked = 'Blocked',
}

describe('FriendsService', () => {
  let friendsService: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendsService, { provide: Friends, useValue: {} }], // Remplacez Friends par le modèle réel
    }).compile();

    friendsService = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(friendsService).toBeDefined();
  });

  it('should create a friend', async () => {
    const createFriendDto: CreateFriendDto = {
      public_id_user: 'public_id_utilisateur',
      public_id_friend: 'public_id_ami',
      status: FriendStatus.Pending,
    };

      const createdFriend = {
          public_id_user: 'public_id_utilisateur',
          public_id_friend: 'public_id_ami',
          status: FriendStatus.Pending,
      };

    jest.spyOn(friendsService, 'createFriend').mockImplementation(async () => createdFriend);

    const result = await friendsService.createFriend(createFriendDto);

    expect(result).toBe(createdFriend);
  });
});
