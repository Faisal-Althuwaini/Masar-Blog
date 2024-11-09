import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly dataSource: DataSource,
  ) {}

  // repo global variable - (DB)
  postRepo = this.dataSource.getRepository(PostEntity);

  // Create a post
  @Post()
  create(@Body() body: string) {
    return this.postsService.create(body);
  }

  // Get All posts
  @Get()
  async findAll() {
    const posts = await this.postRepo.find();
    return { posts: posts };
  }

  // Get Post by id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.getPostById(id);
  }

  // Delete post by id
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.deletePost(id);
  }
}
