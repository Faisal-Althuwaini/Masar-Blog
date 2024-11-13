import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from 'src/users/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  // Inject the data source and initialize the repository
  constructor(private readonly dataSource: DataSource) {}

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

    return { message: 'Comment added successfully' };
  }

  // Method to find comments for a post
  async getCommentsForPost(postId: number) {
    return await this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['user', 'post'], // Optionally, fetch related user and post data
    });
  }

  // Other comment-related methods can go here
}
