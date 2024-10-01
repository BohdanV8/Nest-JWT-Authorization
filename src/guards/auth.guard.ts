import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { TokensService } from 'src/tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokensService: TokensService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is empty');
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Access token is empty');
    }
    const userData = this.tokensService.validateAccessToken(accessToken);
    if (!userData) {
      throw new UnauthorizedException('Access token is not valid anymore');
    }
    if (!userData.isActivated) {
      throw new ForbiddenException('User account is not activated');
    }
    request.user = userData;
    return true;
  }
}
