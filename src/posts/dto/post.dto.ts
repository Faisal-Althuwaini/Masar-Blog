import { CommentDto } from '@src/comments/dto/comment.dto';
import { LikeDto } from '@src/likes/dto/like.dto';
import { UserDto } from '@src/users/dto/user.dto';

export class PostDto {
  id: number;
  title: string;
  body: string;
  user: UserDto;
  comments: CommentDto[];
  likes: LikeDto[];
}
