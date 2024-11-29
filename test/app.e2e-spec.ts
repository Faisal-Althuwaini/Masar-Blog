import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('E2E Tests', () => {
  let app: INestApplication;
  let tokenX: string;
  let tokenY: string;
  let articleId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // good
  it('Guest user can register', async () => {
    const payload = {
      username: 'guestuser1212223',
      firstName: 'Guest',
      lastName: 'User',
      password: 'password123',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload);
    console.log('Response Body:', response.body); // Log the error details

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });

  // good
  it('Guest user can log in with correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'guestuser1212', password: 'password123' });

    console.log('Response Body:', response.body); // Log the error details

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
    tokenX = response.body.access_token;
  });

  // good
  it('Login fails with incorrect credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'guest@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(401);
  });

  // good
  it('Guest user can explore articles', async () => {
    const response = await request(app.getHttpServer()).get(
      '/posts?page=1&pageSize=10',
    );
    console.log('Response Body:', response.body); // Log the error details

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  // good
  it('Guest user cannot create an article', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'New Article', body: 'Content' });
    expect(response.status).toBe(401);
  });

  // good
  it('Logged-in user can create a post', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${tokenX}`)
      .send({ title: 'User X Article', body: 'Content' });

    expect(response.status).toBe(201);
    articleId = response.body.id;
    console.log(articleId);
  });

  // good
  it('Creating an article fails without a body', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${tokenX}`)
      .send({});

    expect(response.status).toBe(500);
  });

  // good
  it('Follow user functionality works', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/follow/120')
      .set('Authorization', `Bearer ${tokenX}`);
    expect(response.status).toBe(201);
  });

  it('Authorization: User Y cannot edit User X’s article', async () => {
    // to register User Y
    // const payload = {
    //   username: 'TestUserY3',
    //   firstName: 'Guest',
    //   lastName: 'User',
    //   password: 'password123',
    // };
    // const response = await request(app.getHttpServer())
    //   .post('/auth/register')
    //   .send(payload);

    // expect(response.status).toBe(201);

    const loginY = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'TestUserY3', password: 'password123' });
    tokenY = loginY.body.access_token;

    const editResponse = await request(app.getHttpServer())
      .put(`/posts/${articleId}`)
      .set('Authorization', `Bearer ${tokenY}`)
      .send({ title: 'Unauthorized Edit' });
    console.log('Response Body:', editResponse.body); // Log the error details

    expect(editResponse.status).toBe(403);
  });
});
