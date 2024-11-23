import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { UUID } from 'crypto';
import { FollowsService } from '../follows/follows.service';
import { Follow } from '../follows/entities/follow.entity';
import { UserDto } from './dto/user.dto'; // Import the DTO

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly followsService: FollowsService,
  ) {}

  // repo global variable (DB)
  usersRepository = this.dataSource.getRepository(User);

  followRepository = this.dataSource.getRepository(Follow);

  findOneByEmail(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  update(userId: UUID, userInformation: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(userId, userInformation);
  }

  // Follow a user
  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    // Check if the follower already follows the following user
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      throw new BadRequestException('You are following this user already');
    }

    // Create a new follow relationship
    const follow = this.followRepository.create({
      follower: { id: followerId } as User, // Populate the follower entity
      following: { id: followingId } as User, // Populate the following entity
    });

    // Call FollowsService to handle follow logic
    return this.followRepository.save(follow);
  }

  // Get followers of a user
  async getFollowers(userId: number) {
    return this.followsService.getFollowers(userId);
  }

  // Get users that the user is following
  async getFollowing(userId: number) {
    return this.followsService.getFollowing(userId);
  }

  async unfollowUser(followerId, followingId) {
    return this.followsService.unfollowUser(followerId, followingId);
  }

  async getUserByUsername(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error('User not found');
    }

    return new UserDto(user);
  }
}
