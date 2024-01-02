// auth.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/Login.dto';
import { UserDto } from 'src/dto/user.dto';
import { Trainer } from 'src/entites/trainer.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';

export class ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
    private readonly mailerService: MailerService,
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
    user: {
      userId: number;
      username: string;
      email: string;
      trainerId?: number;
    };
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

    const trainer = await this.trainerRepository.findOne({
      where: { user: validatedUser },
    });

    const accessToken = this.jwtService.sign(payload);

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

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Even if the user is not found, do not reveal it to the requester
      return;
    }
    const resetToken = uuidv4();

    // might need to change https to http, ##### LOCALHOST WILL NEED TO BE CHANGED TO THE ACTUAL URL, PLACE THIS IN ENV FILE
    const resetUrl = `https://localhost:4200/auth/new-password?token=${resetToken}`;

    // Save the token in your database associated with the user
    await this.usersService.saveResetToken(email, resetToken);

    // Send the token to the user's email
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      text: `Please click the following link to reset your password: ${resetUrl}`,
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { email, token, newPassword } = dto;

    // Validate the reset token
    const user = await this.usersService.validateResetToken(email, token);
    if (!user) {
      throw new NotFoundException('Invalid or expired reset token');
    }
    // Hash the new password and update it in the database
    await this.usersService.updatePassword(email, newPassword);
  }
}
