import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Follow } from './entities/follow.entity'; // Import your Follow entity
import { User } from '../users/entities/user.entity'; // Import User entity
import { UserDto } from '../users/dto/user.dto'; // Import the DTO

@Injectable()
export class FollowsService {
  constructor(private readonly dataSource: DataSource) {}

  // repo global variable (DB)
  followsRepository = this.dataSource.getRepository(Follow);
  usersRepository = this.dataSource.getRepository(User);

  // Follow a user
  async followUser(followerId: number, followingId: number): Promise<Follow> {
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    // Check if the users exist
    const follower = await this.usersRepository.findOneBy({ id: followerId });
    const following = await this.usersRepository.findOneBy({ id: followingId });

    if (!follower || !following) {
      throw new Error('User not found');
    }

    // Check if the follow relationship already exists
    const existingFollow = await this.followsRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existingFollow) {
      throw new Error('You are already following this user');
    }

    // Create new follow relationship
    const newFollow = this.followsRepository.create({
      follower,
      following,
    });

    return this.followsRepository.save(newFollow);
  }

  // Get followers of a user
  async getFollowers(userId: number): Promise<UserDto[]> {
    const follows = await this.followsRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'], // Make sure to join the 'follower' relation
    });

    return follows.map((follow) => ({
      id: follow.follower.id,
      username: follow.follower.username, // Access the 'follower' entity's username
      firstName: follow.follower.firstName,
      lastName: follow.follower.lastName,
    }));
  }

  // Get users that the user is following
  async getFollowing(userId: number): Promise<UserDto[]> {
    const following = await this.followsRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    return following.map((follow) => ({
      id: follow.following.id,
      username: follow.following.username,
      firstName: follow.following.firstName,
      lastName: follow.following.lastName,
    }));
  }

  // Unfollow a user
  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    const follow = await this.followsRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    // If the 'follow' relation is not found, throw a NotFoundException
    if (!follow) {
      throw new NotFoundException('You are not following this user');
    }

    await this.followsRepository.remove(follow);
  }
}
