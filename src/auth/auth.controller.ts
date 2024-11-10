import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service'; // Service for authentication logic
import { AuthGuard } from '@nestjs/passport'; // Passport authentication guard (used for local strategy)
import { RegisterRequestDto } from './dtos/register-request.dto'; // DTO for the registration request
import { LoginResponseDTO } from './dtos/login-response.dto'; // DTO for the login response
import { RegisterResponseDTO } from './dtos/register-response.dto'; // DTO for the registration response
import { Public } from './decorators/public.decorator'; // Custom decorator to make routes public

@Public() // Custom decorator to mark this route as public, accessible without authentication
@Controller('auth') // Controller to handle requests to the '/auth' endpoint
export class AuthController {
  // Inject AuthService to handle auth logic
  constructor(private authService: AuthService) {}

  // Login route, uses the 'local' strategy guard (defined in JwtStrategy or other strategies)
  @UseGuards(AuthGuard('local')) // Applies Passport's 'local' strategy (checks username/password)
  @Post('login')
  async login(@Request() req): Promise<LoginResponseDTO | BadRequestException> {
    // Calls authService.login() with the user data attached to the request and returns the response
    return this.authService.login(req.user);
    // req.user is populated by Passport's 'local' strategy
  }

  // Register route to create a new user
  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto, // Takes the body of the request, which contains user data for registration
  ): Promise<RegisterResponseDTO | BadRequestException> {
    // Calls authService.register() with the data and returns a response
    return await this.authService.register(registerBody);
  }
}
