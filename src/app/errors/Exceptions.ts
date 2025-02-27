export class NotFoundException extends Error {
  public statusCode: number;

  constructor(message: string, stack = '') {
    super(message);
    this.statusCode = 404;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class UnauthorizedException extends Error {
  public statusCode: number;

  constructor(message: string, stack = '') {
    super(message);
    this.statusCode = 401;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ForbiddenException extends Error {
  public statusCode: number;

  constructor(message: string, stack = '') {
    super(message);
    this.statusCode = 403;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequestException extends Error {
  public statusCode: number;

  constructor(message: string, stack = '') {
    super(message);
    this.statusCode = 400;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
