import { Like } from '../like.entity';
import { UserDto } from '../../../src/users/dto/user.dto';
export class LikeDto {
  id: number;
  user: {
    id: number;
    username: string;
  };

  constructor(like: Like) {
    this.id = like.id;
    this.user = new UserDto(like.user); // Exclude sensitive data like password
  }
}
