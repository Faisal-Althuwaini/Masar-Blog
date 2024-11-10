import { SetMetadata } from '@nestjs/common'; // Import SetMetadata from NestJS to set custom metadata on route handlers

// Mark the route or controller as public by setting the 'isPublic' metadata to true
export const Public = () => SetMetadata('isPublic', true);
