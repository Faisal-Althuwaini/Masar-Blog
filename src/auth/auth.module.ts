import { Module } from '@nestjs/common';
import { UsersModule } from '../../src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule for JWT-based authentication
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService to manage application configuration
import { LocalStrategy } from './strategy/local.strategy'; // Local strategy for username/password authentication
import { AuthController } from './auth.controller'; // Import the controller to handle routes related to authentication
import { JwtStrategy } from './strategy/jwt.strategy'; // JWT strategy to validate the JWT token during subsequent requests

@Module({
  imports: [
    UsersModule,
    // Asynchronously configure JWT module using the application's configuration
    JwtModule.registerAsync({
      // Import ConfigModule to access configuration properties
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.getOrThrow<string>(
              'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
            ),
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy], // providers for handling authentication logic and strategies
  exports: [AuthService, JwtModule], // Export AuthService and JwtModule to be used in other modules
})
export class AuthModule {}
