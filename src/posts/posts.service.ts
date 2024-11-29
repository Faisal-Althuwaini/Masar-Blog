import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { Like } from '../likes/like.entity';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/entities/user.entity';
import { UserDto } from '../../src/users/dto/user.dto';
import { CommentDto } from '../../src/comments/dto/comment.dto';
import { LikeDto } from '../../src/likes/dto/like.dto';
import { PageService } from '../filter/PageService';
import { PaginationFilterDto } from '../filter/PaginationFilterDto';

@Injectable()
export class PostsService extends PageService<PostEntity> {
  protected readonly dataSource: DataSource;
  constructor(dataSource: DataSource) {
    super(dataSource, PostEntity);
  }

  // posts repo
  postRepo = this.dataSource.getRepository(PostEntity);

  // likes repo
  likesRepo = this.dataSource.getRepository(Like);

  // comments repo
  commentRepo = this.dataSource.getRepository(Comment);

  async findAllPaginated(filter: PaginationFilterDto) {
    const queryBuilder = this.getQueryBuilder('post');

    // title filtering
    if (filter.title) {
      queryBuilder.where('post.title ILIKE :title', {
        title: `%${filter.title}%`,
      });
    }

    return this.paginate(filter, queryBuilder);
  }

  // Create post
  async create(createPostDto: CreatePostDto, userId: number) {
    const post = new PostEntity();

    post.title = createPostDto.title;
    post.body = createPostDto.body;

    // Associate the post with the user (userId)
    post.user = { id: userId } as User;

    // Save the post to the database
    const savedPost = await this.postRepo.save(post);

    return {
      message: 'Post created successfully',
      title: savedPost.title,
      body: savedPost.body,
      id: savedPost.id,
    };
  }

  // Find post by id
  async getPostById(id: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user', 'comments', 'comments.user', 'likes', 'likes.user'],
      select: {
        user: {
          id: true,
          username: true,
        },
        comments: {
          content: true,
          user: {
            id: true,
            username: true,
          },
        },
        likes: {
          id: true,
          user: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    // Map the fetched data to DTOs
    const postResponse = new PostResponseDto();
    postResponse.id = post.id;
    postResponse.title = post.title;
    postResponse.body = post.body;
    postResponse.user = new UserDto(post.user); // Map user to UserDto
    postResponse.comments = post.comments.map(
      (comment) => new CommentDto(comment),
    ); // Map comments to CommentDto
    postResponse.likes = post.likes.map((like) => new LikeDto(like)); // Map likes to LikeDto

    return postResponse;
  }

  // Update Post
  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ) {
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
    post.title = updatePostDto.title ?? post.title;
    post.body = updatePostDto.body ?? post.body;

    // Save the updated post
    const updatedPost = await this.postRepo.save(post);

    return {
      message: 'Post updated successfully',
      id: updatedPost.id,
      title: updatedPost.title,
      body: updatedPost.body,
      user: updatedPost.user,
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
