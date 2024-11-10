import { Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  // repo global variable (DB)
  usersRepository = this.dataSource.getRepository(User);

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  update(userId: UUID, userInformation: Partial<User>): Promise<UpdateResult> {
    return this.usersRepository.update(userId, userInformation);
  }
}
