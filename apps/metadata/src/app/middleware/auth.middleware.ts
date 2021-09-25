import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  HttpService,
} from '@nestjs/common';
import {
  Request,
  Response,
  NextFunction
} from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private httpService: HttpService) { }

  async use(req: Request, _: Response, next: NextFunction) {
    const accessToken: string = req.headers['authorization'];
    if (accessToken) {
      try {
        const headersRequest = {
          Authorization: accessToken,
        };
        await this.httpService.get(`${process.env.AUTH_URL}/auth`, { headers: headersRequest }).toPromise();
        next();
      } catch (err) {
        throw new UnauthorizedException()
      }
    } else {
      throw new UnauthorizedException()
    }
  }
}
