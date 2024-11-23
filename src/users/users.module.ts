import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowsService } from '../../src/follows/follows.service';
import { UsersController } from './users.controller';
@Module({
  controllers: [UsersController],
  providers: [UsersService, FollowsService],
  exports: [UsersService],
})
export class UsersModule {}
