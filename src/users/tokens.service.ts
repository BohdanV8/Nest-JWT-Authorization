import { Injectable } from '@nestjs/common';
import { CreateTokenPayloadDto } from './dto/create-token-payload.dto';

@Injectable()
export class TokensService {
  generateTokens(payload: CreateTokenPayloadDto) {
    return 'This action adds a new token';
  }
}