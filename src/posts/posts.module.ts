import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsModule } from '../comments/comments.module'; // Import the CommentsModule
import { LikesModule } from '../likes/likes.module'; // Import LikesModule

@Module({
  imports: [CommentsModule, LikesModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
