import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard'; // Adjust the import path as needed
import { CommentsService } from 'src/comments/comments.service';
import { LikesService } from 'src/likes/likes.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private commentsService: CommentsService,
    private likesService: LikesService,
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

  // Add a comment to a post
  @UseGuards(JwtGuard) // Ensure the user is authenticated
  @Post(':id/comments')
  async addComment(
    @Param('id') postId: number, // Get the postId from the URL
    @Body('text') text: string, // Get the comment content (text) from the request body
    @Request() req, // Get the user from the request (assumes user is authenticated)
  ) {
    const post = await this.postsService.getPostById(postId); // Get the post by ID
    return this.commentsService.addComment(post, req.user, text); // Call the addComment method in CommentsService
  }

  // Add a like to a post
  @UseGuards(JwtGuard) // Ensure the user is authenticated
  @Post(':id/like')
  async addLike(
    @Param('id') postId: number, // Get the postId from the URL
    @Request() req, // Get the user from the request (assumes user is authenticated)
  ) {
    const post = await this.postsService.getPostById(postId); // Get the post by ID
    return this.likesService.addLike(post, req.user); // Add the like
  }
}
