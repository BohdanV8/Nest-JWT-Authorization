import { Injectable } from '@nestjs/common';
import { CreateTokenPayloadDto } from './dto/create-token-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { Token } from '@prisma/client';
@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async generateTokens(payload: CreateTokenPayloadDto) {
    const accessToken: string = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '20m',
    });
    const refreshToken: string = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '20d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData: Token = await this.prisma.token.findUnique({
      where: {
        userId,
      },
    });

    if (tokenData) {
      return await this.prisma.token.update({
        where: { id: tokenData.id },
        data: { refreshToken },
      });
    }

    const token = await this.prisma.token.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        refreshToken,
      },
    });

    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await this.prisma.token.delete({
      where: {
        refreshToken,
      },
    });

    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await this.prisma.token.findUnique({
      where: {
        refreshToken,
      },
    });

    return tokenData;
  }

  validateAccessToken(token: string) {
    try {
      const userData: CreateTokenPayloadDto = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData: CreateTokenPayloadDto = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return userData;
    } catch (e) {
      return null;
    }
  }
}
