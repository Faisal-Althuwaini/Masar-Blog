import { UserDto } from '@src/users/dto/user.dto';

export class CommentDto {
  id: number;
  content: string;
  user: {
    id: number;
    email: string;
  };
}
