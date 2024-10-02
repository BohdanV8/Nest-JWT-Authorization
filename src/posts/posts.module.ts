import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma.service';
import { TokensService } from 'src/tokens.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, TokensService, JwtService],
})
export class PostsModule {}
