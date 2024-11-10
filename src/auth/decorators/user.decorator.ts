import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom User decorator

export const User = createParamDecorator(
  // createParamDecorator takes a function to extract data
  (data: unknown, ctx: ExecutionContext) => {
    // Switch context to HTTP and get the request object
    const request = ctx.switchToHttp().getRequest();
    // Return the 'user' property, which should be added after authentication (e.g., from a JWT payload
    return request.user;
  },
);
