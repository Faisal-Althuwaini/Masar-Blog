import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FollowsModule } from './follows/follows.module';

describe('AppController', () => {
  let appController: AppController;
  const mockAppService = {
    getHello: jest.fn(() => 'Hello World!'),
  };
  beforeEach(async () => {
    const entitiesPath = __dirname + '/**/*.entity{.ts,.js}';

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: 5432,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          entities: [entitiesPath],
          synchronize: false,
          logging: false,
        }),

        PostsModule,
        UsersModule,
        AuthModule,
        FollowsModule,
      ],
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: APP_GUARD, useClass: JwtGuard },
        JwtStrategy,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  afterAll(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
