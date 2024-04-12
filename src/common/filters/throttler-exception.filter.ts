import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(HttpStatus.TOO_MANY_REQUESTS)  // 429 status code
      .json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        timestamp: new Date().toISOString(),
        message: 'Too Many Requests',
      });
  }
}