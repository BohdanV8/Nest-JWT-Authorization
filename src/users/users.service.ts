import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateTokenPayloadDto } from './dto/create-token-payload.dto';
import { TokensService } from './tokens.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService, private readonly tokenService: TokensService) {}
  async registration(data: CreateUserDto) {
    let existingUser = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User with this username is already exist');
    }

    const hashPassword = await bcrypt.hash(data.password, 4);
    let newUser: User = await this.prisma.user.create({
      data: { ...data, password: hashPassword },
    });

    const payload = new CreateTokenPayloadDto(newUser)

    const tokens = await this.tokenService.generateTokens({ ...payload })
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
