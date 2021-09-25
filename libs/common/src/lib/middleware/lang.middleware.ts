import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LangMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const language: string = req.headers['accept-language'];
    let lang = ''
    switch (language) {
      case 'th':
        lang = 'th'
        break;
      case 'en':
        lang = 'en'
        break;
      default:
        lang = 'th'
        break;
    }
    req.headers['accept-language'] = lang
    next();
  }
}
