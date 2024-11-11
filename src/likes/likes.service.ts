import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Like } from './like.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity'; // Adjust the import path

@Injectable()
export class LikesService {
  constructor(private readonly dataSource: DataSource) {}

  // Repository for LikeEntity
  private readonly likeRepo = this.dataSource.getRepository(Like);

  async addLike(post: PostEntity, user: User) {
    // Check if the user has already liked the post
    const existingLike = await this.likeRepo.findOne({
      where: { post: { id: post.id }, user: { id: user.id } },
      relations: ['post', 'user'],
    });

    if (existingLike) {
      throw new HttpException(
        'You have already liked this post',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create a new like for the post
    const newLike = this.likeRepo.create({
      post: post,
      user: user,
    });

    // Save the like
    await this.likeRepo.save(newLike);
    return { message: 'Like added successfully!' };
  }
}
