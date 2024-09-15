import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Get, Body, Res, Req, Param } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.registration(createUserDto);
    response.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    return userData;
  }

  @Post('login')
  async login(
    @Body() email: string,
    password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.authService.login(email, password);
    response.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    return userData;
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const token = this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');
    return token;
  }

  @Get('/activate/:link')
  async activateLink(@Param('link') link: string) {
    return this.authService.activate(link);
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken } = request.cookies;
    const userData = await this.authService.refresh(refreshToken);
    response.cookie('refreshToken', userData.refreshToken, {
      httpOnly: true,
      maxAge: 20 * 24 * 60 * 60 * 1000,
    });
    return userData;
  }
}
