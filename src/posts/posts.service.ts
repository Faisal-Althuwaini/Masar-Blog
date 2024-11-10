import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly dataSource: DataSource) {}

  // repo global variable (DB)
  postRepo = this.dataSource.getRepository(PostEntity);

  // Create a post
  async create(bodyHandler) {
    const post = new PostEntity();
    const { title, body } = bodyHandler;

    post.title = title;
    post.body = body;

    await this.postRepo.save(post);

    return { message: 'Post created successfully', title: title, body: body };
  }

  // Find post by id
  async getPostById(id: number): Promise<PostEntity> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['comments', 'likes'], // Load the related comments
      select: ['id', 'title', 'body'],
      loadRelationIds: false,
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  // Delete post by id
  deletePost(id: number) {
    this.postRepo.delete(id);
    return {
      message: 'Post Deleted Successfully!',
    };
  }
}
