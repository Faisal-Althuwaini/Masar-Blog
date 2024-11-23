import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../src/users/entities/user.entity';
import { AccessToken } from './types/AccessToken';
import { UsersService } from '../../src/users/users.service';
import { RegisterRequestDto } from './dtos/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // Inject JwtService to create and verify JWT tokens
  ) {}

  // Method to validate user credentials during login
  async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.usersService.findOneByEmail(username); // Retrieve user by email
    if (!user) {
      // Check if user does not exist
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password); // Compare the password
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user; // Return the user object if validation is successful
  }

  // Method to generate JWT token after successful login
  async login(user: User): Promise<AccessToken> {
    const payload = { username: user.username, id: user.id }; // Prepare payload containing user info
    return { access_token: this.jwtService.sign(payload) }; // Return the JWT token with the payload
  }

  // Method to handle user registration
  async register(user: RegisterRequestDto): Promise<AccessToken> {
    const existingUser = await this.usersService.findOneByEmail(user.username); // Check if user already exists

    // If username already exists
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password using bcrypt
    const newUser: User = {
      ...user,
      password: hashedPassword,
      posts: [],
      following: [],
      followers: [],
    }; // Create new user object with hashed password
    await this.usersService.create(newUser); // Save the new user in the database
    return this.login(newUser); // Log the new user in and return an access token
  }
}
