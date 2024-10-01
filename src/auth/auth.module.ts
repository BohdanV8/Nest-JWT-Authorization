import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from './mail.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from 'src/tokens.service';
@Module({
  controllers: [AuthController],
  providers: [AuthService, MailService, TokensService, JwtService, PrismaService],
})
export class AuthModule {}
