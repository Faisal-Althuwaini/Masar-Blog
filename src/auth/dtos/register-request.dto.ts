// This RegisterRequestDto would typically be used to receive and validate the
// registration data sent in the request body when a user attempts to sign up.

export type RegisterRequestDto = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};
