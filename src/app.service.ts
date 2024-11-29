import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';
import { PostEntity } from './posts/entities/post.entity';
import { Comment } from './comments/comment.entity';
import { Like } from './likes/like.entity';
import { faker } from '@faker-js/faker'; // Importing Faker.js
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  // Service to generate and save fake users
  async generateFakeUsers(count: number): Promise<User[]> {
    const userRepository = this.dataSource.getRepository(User);
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = new User();
      user.firstName = faker.person.firstName();
      user.lastName = faker.person.lastName();
      user.username = faker.internet.username();
      user.password = faker.internet.password();
      users.push(user);
    }

    return await userRepository.save(users);
  }

  async generateFakePostsForAllUsers(count: number): Promise<PostEntity[]> {
    const userRepository = this.dataSource.getRepository(User);
    const postRepository = this.dataSource.getRepository(PostEntity);

    // Fetch all users
    const users = await userRepository.find();
    const allPosts: PostEntity[] = [];

    // Generate fake posts for each user
    for (const user of users) {
      for (let i = 0; i < count; i++) {
        const post = postRepository.create({
          title: faker.lorem.sentence(),
          body: faker.lorem.paragraph(),
          user, // Link to the actual user entity
        });
        allPosts.push(await postRepository.save(post));
      }
    }

    return allPosts;
  }

  async getHello() {
    return 'Hello world!';
    //
  }
}
