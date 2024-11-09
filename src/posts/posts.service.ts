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
  async getPostById(id: number) {
    const post = await this.postRepo.findOne({ where: { id: id } });
    return { post: post };
  }

  // Delete post by id
  deletePost(id: number) {
    this.postRepo.delete(id);
    return {
      message: 'Post Deleted Successfully!',
    };
  }
}
