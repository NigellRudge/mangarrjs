export class AuthenticationError extends Error {
    statusCode: number = 401;
    constructor(public message: string) {
        super(message);
    }
}

export class GeneralError extends Error {
    statusCode: number = 500;
    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends Error {
    statusCode = 404;
    constructor(public message: string) {
        super(message);
    }
}
