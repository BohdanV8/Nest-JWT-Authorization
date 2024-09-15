import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from 'src/auth/tokens.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokensService: TokensService, private readonly prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
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

    const user = await this.prisma.user.findUnique({
      where: {
        id: userData.id
      }
    })

    if(!user.isActivated){
      throw new UnauthorizedException("User account is not activated")
    }

    next()
  }
}
