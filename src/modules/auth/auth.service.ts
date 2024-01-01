// auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/Login.dto';
import { UserDto } from 'src/dto/user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<UserDto | undefined> {
    const user = await this.usersService.findOneByUsernameOrEmail(identifier);
    if (!user) throw new BadRequestException();

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException();
    return user;
  }

  async login(user: LoginDto): Promise<{
    accessToken: string;
    user: { userId: number; username: string; email: string };
  }> {
    const validatedUser = await this.validateUser(user.username, user.password);

    if (!validatedUser) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: validatedUser.id,
      username: validatedUser.username,
      email: validatedUser.email,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        userId: payload.sub,
        username: payload.username,
        email: payload.email,
      },
    };
  }
}
