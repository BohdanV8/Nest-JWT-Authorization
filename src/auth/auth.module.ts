import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from './mail.service';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService, TokensService, JwtService],
})
export class AuthModule {}
