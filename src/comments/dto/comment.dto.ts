import { UserDto } from '../../../src/users/dto/user.dto';
import { Comment } from '../comment.entity';
export class CommentDto {
  id: number;
  content: string;
  user: UserDto;

  constructor(comment: Comment) {
    this.content = comment.content;
    this.user = new UserDto(comment.user); // Exclude sensitive data like password
  }
}
