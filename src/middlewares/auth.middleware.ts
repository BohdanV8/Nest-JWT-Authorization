import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokensService } from 'src/users/tokens.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokensService: TokensService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is empty');
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Access token is empty');
    }

    const userData = this.tokensService.validateAccessToken(accessToken)
    if(!userData){
        throw new UnauthorizedException("Access token is not valid anymore")
    }

    next()
  }
}
