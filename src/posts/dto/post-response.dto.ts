import { UserDto } from '../../users/dto/user.dto';
import { CommentDto } from '@src/comments/dto/comment.dto';
import { LikeDto } from '@src/likes/dto/like.dto';

export class PostResponseDto {
  id: number;
  title: string;
  body: string;
  user: UserDto;
  comments: CommentDto[];
  likes: LikeDto[];
}
