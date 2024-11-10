import { AccessToken } from '../types/AccessToken';
// You would typically use this in an API response where the user logs in,
//  and the server returns an access token that can be used for authenticating future requests.

export type LoginResponseDTO = AccessToken;
