import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MailService } from './mail.service';
import { TokensService } from './tokens.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateTokenPayloadDto } from './dto/create-token-payload.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly tokenService: TokensService,
  ) {}

  async registration(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email is already exist');
    }

    const hashPassword = await bcrypt.hash(data.password, 4);
    const activationLink = uuidv4();
    let newUser: User = await this.prisma.user.create({
      data: { ...data, password: hashPassword, activationLink },
    });

    await this.mailService.sendActivationMail(
      data.email,
      `${process.env.API_URL}/api/users/activate/${activationLink}`,
    );

    const payload: CreateTokenPayloadDto = new CreateTokenPayloadDto(newUser);
    const tokens = await this.tokenService.generateTokens({ ...payload });
    const refreshToken = await this.tokenService.saveToken(
      newUser.id,
      tokens.refreshToken,
    );
    return { ...tokens, user: payload };
  }

  async login(email: string, password: string) {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (isPassEquals) {
      const payload: CreateTokenPayloadDto = new CreateTokenPayloadDto(user);
      const tokens = await this.tokenService.generateTokens({ ...payload });
      const refreshToken = await this.tokenService.saveToken(
        user.id,
        tokens.refreshToken,
      );
      return { ...tokens, user: payload };
    } else {
      throw new BadRequestException('Password is not correct');
    }
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  async activate(activationLink: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        activationLink,
      },
    });

    if (!user) {
      throw new BadRequestException('Activation link is not corect');
    }

    const activatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isActivated: true,
      },
    });

    return activatedUser;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is empty');
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const refreshTokenFromDB = await this.tokenService.findToken(refreshToken);
    if (!userData || !refreshTokenFromDB) {
      throw new UnauthorizedException('Refresh token is not valid anymore');
    }

    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });

    const payload: CreateTokenPayloadDto = new CreateTokenPayloadDto(user);
    const tokens = await this.tokenService.generateTokens({ ...payload });
    const newRefreshToken = await this.tokenService.saveToken(
      user.id,
      tokens.refreshToken,
    );
    return { ...tokens, user: payload };
  }
}
