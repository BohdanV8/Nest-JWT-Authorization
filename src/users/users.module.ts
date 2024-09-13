import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService,  PrismaService, TokensService, JwtService, MailService],
})
export class UsersModule {}
