import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from 'src/users/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CommentDto } from '@src/comments/dto/comment.dto';
import { PostDto } from '@src/posts/dto/post.dto';

@Injectable()
export class CommentsService {
  // Inject the data source and initialize the repository
  constructor(private readonly dataSource: DataSource) {}
  // Method to map PostEntity to PostDto
  toPostDto(post: PostEntity): PostDto {
    return {
      id: post.id,
      title: post.title,
      body: post.body,
      user: {
        id: post.user.id,
        email: post.user.email,
        firstName: post.user.firstName,
        lastName: post.user.lastName,
      },
      comments: post.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.user.id,
          email: comment.user.email, // Customize fields as needed
        },
      })),
      likes: post.likes.map((like) => ({
        id: like.id,
        user: {
          id: like.user.id,
          email: like.user.email,
        },
      })),
    };
  }

  // Repository for CommentEntity
  private readonly commentRepo = this.dataSource.getRepository(Comment);
  // Method to add a comment
  async addComment(post: PostEntity, user: User, text: string) {
    // Create the new comment instance
    const comment = this.commentRepo.create({
      post: post, // Ensure TypeScript understands post is a PostEntity
      user,
      content: text,
    });
    // Save the comment in the database
    await this.commentRepo.save(comment);

    // Return a success message or the created comment
    const postDto = this.toPostDto(post);

    return {
      message: 'Comment added successfully',
      comment,
      post: postDto, // Only include the necessary post data
    };
  }

  // Method to find comments for a post
  async getCommentsForPost(postId: number) {
    return await this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'], // Optionally, fetch related user and post data
    });
  }
}
