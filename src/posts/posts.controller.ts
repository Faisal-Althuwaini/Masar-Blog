import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard'; // Adjust the import path as needed

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
  @UseGuards(JwtGuard) // This will ensure the user is logged in (ckeck if the user has jwt in headers)
  create(@Body() body: string) {
    return this.postsService.create(body);
  }

  // Get All posts
  @Public()
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
