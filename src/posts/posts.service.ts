import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { Like } from '../likes/like.entity';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/entities/user.entity';
import { tr } from '@faker-js/faker/.';

@Injectable()
export class PostsService {
  constructor(private readonly dataSource: DataSource) {}

  // posts repo
  postRepo = this.dataSource.getRepository(PostEntity);

  // likes repo
  likesRepo = this.dataSource.getRepository(Like);

  // comments repo
  commentRepo = this.dataSource.getRepository(Comment);

  async create(bodyHandler, userId: number) {
    const post = new PostEntity();
    const { title, body } = bodyHandler;

    post.title = title;
    post.body = body;

    // Associate the post with the user (userId)
    post.user = { id: userId } as User;

    // Save the post to the database
    await this.postRepo.save(post);

    return { message: 'Post created successfully', title, body };
  }

  // Find post by id
  async getPostById(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user', 'likes', 'likes.user'],
      select: {
        id: true,
        title: true,
        body: true,
        user: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
        comments: {
          content: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        likes: {
          id: true,
          user: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }
    return post;
  }

  // Update Post
  async updatePost(postId: number, body, userId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    // check if the post exists
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    // Check if the logged-in user is the owner of the post
    if (post.user.id !== userId) {
      throw new HttpException(
        'You are not authorized to edit this post',
        HttpStatus.FORBIDDEN,
      );
    }

    // Update the post fields
    post.title = body.title;
    post.body = body.body;

    // Save the updated post
    await this.postRepo.save(post);

    return {
      message: 'Post updated successfully',
      post: {
        title: post.title,
        body: post.body,
      },
    };
  }
  // Delete post by id
  async deletePost(id: number, userId: number) {
    // Find the post by ID and include the user who created it
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    // If post doesn't exist, throw an error
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    // If the logged-in user is not the owner of the post, throw an error
    if (post.user.id !== userId) {
      throw new HttpException(
        'Unauthorized to delete this post',
        HttpStatus.FORBIDDEN,
      );
    }

    // Delete the comments associated with this post
    await this.commentRepo.delete({ post: { id } });

    // Delete the likes associated with this post
    await this.likesRepo.delete({ post: { id } });

    // Finally, delete the post itself
    await this.postRepo.delete(id);

    return {
      message: 'Post and related comments deleted successfully!',
    };
  }
}
