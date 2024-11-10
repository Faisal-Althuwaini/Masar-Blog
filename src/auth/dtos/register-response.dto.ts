import { AccessToken } from '../types/AccessToken';
// In your registration process, when a user successfully registers,
//  you may return a response containing an access token.
//   The response is structured as RegisterResponseDTO:

export type RegisterResponseDTO = AccessToken;
