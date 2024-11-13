import { User } from '../entities/user.entity';
export class UserDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
