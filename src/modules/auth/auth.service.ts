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
import { InjectRepository } from '@nestjs/typeorm';
import { Trainer } from 'src/entites/trainer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
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
    user: { userId: number; username: string; email: string; trainerId?: number };
  }> {
    const validatedUser = await this.validateUser(user.username, user.password);
  
    if (!validatedUser) {
      throw new UnauthorizedException();
    }
  
    const payload = {
      userId: validatedUser.id,
      username: validatedUser.username,
      email: validatedUser.email,
    };
  
    // Fetch the associated Trainer entity
    const trainer = await this.trainerRepository.findOne({
      where: { user: validatedUser },
    });
  
    const accessToken = this.jwtService.sign(payload);
  
    // Add trainerId to the response if a Trainer is associated with the user
    const userResponse = {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      trainerId: trainer ? trainer.id : undefined,
    };
  
    return {
      accessToken,
      user: userResponse,
    };
  }
  
}
