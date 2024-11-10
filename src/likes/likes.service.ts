import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Like } from './like.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity'; // Adjust the import path

@Injectable()
export class LikesService {
  constructor(private readonly dataSource: DataSource) {}

  // Repository for LikeEntity
  private readonly likeRepo = this.dataSource.getRepository(Like);

  // Method to add a like to  // Add a like to a post
  async addLike(post: PostEntity, user: User): Promise<Like> {
    // Check if the user has already liked the post
    const existingLike = await this.likeRepo.findOne({
      where: { post: post, id: user.id },
    });

    if (existingLike) {
      throw new Error('You have already liked this post');
    }

    // Create a new like for the post
    const newLike = this.likeRepo.create({
      post: post,
      user: user,
    });

    // Save the like
    return this.likeRepo.save(newLike);
  }
}
