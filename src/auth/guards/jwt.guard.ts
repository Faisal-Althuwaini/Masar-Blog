import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

// This JwtGuard class is a custom NestJS guard that extends the AuthGuard from @nestjs/passport.
//  It adds a check to determine whether an endpoint should be publicly accessible or require a valid JWT token for access.

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Get the 'isPublic' metadata value from the handler or class
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    // If the route is public (no JWT required), allow access
    if (isPublic) return true;

    // If the route is not public, enforce JWT validation
    return super.canActivate(context);
  }
}
