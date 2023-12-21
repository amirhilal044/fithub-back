// auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'; // Fix the import statement
import { LoginDto } from 'src/dto/Login.dto';
import { UserDto } from 'src/dto/user.dto';

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
    access_token: string;
    user: {userId: number, username:string, email: string};
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

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        userId: payload.sub,
        username: payload.username,
        email: payload.email,
      },
    };
  }
}
