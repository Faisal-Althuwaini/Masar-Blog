import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  // Mocking UsersService
  const mockUsersService = {
    followUser: jest.fn(),
    getFollowers: jest.fn(),
    getFollowing: jest.fn(),
    findOneById: jest.fn(),
    unfollowUser: jest.fn(),
    getUserByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('followUser', () => {
    it('should successfully follow a user', async () => {
      const result = { message: 'User followed successfully' };
      mockUsersService.followUser.mockResolvedValue(result);

      const req = { user: { id: 1 } };
      const followingId = 2;
      expect(await usersController.followUser(req, followingId)).toEqual(
        result,
      );
    });
  });

  describe('getFollowers', () => {
    it('should return followers of a user', async () => {
      const result = [{ id: 1, username: 'follower1' }];
      mockUsersService.getFollowers.mockResolvedValue(result);

      expect(await usersController.getFollowers(1)).toEqual(result);
    });
  });

  describe('getFollowing', () => {
    it('should return following of a user', async () => {
      const result = [{ id: 2, username: 'following1' }];
      mockUsersService.getFollowing.mockResolvedValue(result);

      expect(await usersController.getFollowing(1)).toEqual(result);
    });
  });

  describe('getMyProfile', () => {
    it('should return current user profile with followers and following', async () => {
      const user = {
        id: 1,
        username: 'user1',
        firstName: 'John',
        lastName: 'Doe',
      };
      const followers = [{ id: 2, username: 'follower1' }];
      const following = [{ id: 3, username: 'following1' }];

      mockUsersService.findOneById.mockResolvedValue(user);
      mockUsersService.getFollowers.mockResolvedValue(followers);
      mockUsersService.getFollowing.mockResolvedValue(following);

      const result = {
        user: { id: 1, username: 'user1', firstName: 'John', lastName: 'Doe' },
        followers,
        following,
      };

      expect(await usersController.getMyProfile({ user: { id: 1 } })).toEqual(
        result,
      );
    });
  });

  describe('unfollowUser', () => {
    it('should successfully unfollow a user', async () => {
      const result = { message: 'Unfollowed successfully' };
      mockUsersService.unfollowUser.mockResolvedValue(result);

      const req = { user: { id: 1 } };
      const followingId = 2;
      expect(await usersController.unfollowUser(req, followingId)).toEqual(
        result,
      );
    });
  });

  describe('getUserByUsername', () => {
    it('should return user by username', async () => {
      const result = {
        id: 1,
        username: 'user1',
        firstName: 'John',
        lastName: 'Doe',
      };
      mockUsersService.getUserByUsername.mockResolvedValue(result);

      expect(await usersController.getUserByUsername('user1')).toEqual(result);
    });
  });
});
