import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { PostEntity } from '../posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, PostEntity])], // Include the necessary entities
  providers: [CommentsService],
  exports: [CommentsService], // Export CommentsService to make it available in other modules
  controllers: [],
})
export class CommentsModule {}
