import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like])], // Include the necessary entities
  providers: [LikesService],
  exports: [LikesService], // Export LikesService to make it available in other modules
  controllers: [],
})
export class LikesModule {}
