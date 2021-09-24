import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

interface Error {
  code: number;
  message: string;
  error?: any;
}

interface ErrorRes {
  error: Error
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) { }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const message = await this.i18n.translate(`response.${statusCode}`, { lang: request.headers['accept-language'] });
    const jsRes: ErrorRes = {
      error: {
        code: statusCode,
        message: message,
      }
    }
    response
      .status(statusCode)
      .json(jsRes);
  }
}