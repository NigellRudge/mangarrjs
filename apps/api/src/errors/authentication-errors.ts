export default class AuthenticationError extends Error {
  statusCode: number = 401;
  constructor(public message: string) {
    super(message);
  }
}
