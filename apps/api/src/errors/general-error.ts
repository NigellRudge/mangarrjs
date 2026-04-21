export default class GeneralError extends Error {
  statusCode: number = 500;
  constructor(message: string) {
    super(message);
  }
}
