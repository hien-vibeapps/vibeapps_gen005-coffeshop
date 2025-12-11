import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Log error for debugging
    if (!(exception instanceof HttpException)) {
      console.error('Unhandled exception:', exception);
      if (exception instanceof Error) {
        console.error('Error stack:', exception.stack);
        console.error('Error message:', exception.message);
      }
    }

    response.status(status).json({
      success: false,
      message: typeof message === 'string' ? message : (message as any).message,
      errors: typeof message === 'object' && 'errors' in message ? (message as any).errors : undefined,
    });
  }
}

