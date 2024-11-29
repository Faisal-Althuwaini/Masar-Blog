<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# NestJS CRUD Application

This project is a backend application for a Blog built with NestJS. It allows users to create and query articles with features such as following other users and pagination for queries.

> Note: This project was created as part of the Software Engineering Bootcamp by the [Masar Program](https://masarbysani.com) from [SANI](https://x.com/devWithSANI). It is intended for educational purposes and to successfully complete the bootcamp.

## Deployment URL

Production : https://masar-blog.onrender.com

Staging : https://masar-blog-staging.onrender.com

## Database diagram

<img src="/mysystem.jpg" alt="My system"/>

## Database indexing effect

i made indexing for an endpoint /users/:username to search for a user by username, i used HASH indexing method.
before the indexing :

<img src="/before-index.jpg" alt="My system"/>

after the indexing :

<img src="/after-index.jpg" alt="My system"/>

response time with users table of 700k rows, before index it was 157ms, after index it became 0.351ms !

## System Design

<img src="/system-design.png" alt="My system"/>

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
