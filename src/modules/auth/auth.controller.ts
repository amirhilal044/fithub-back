import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService, ResetPasswordDto } from './auth.service';
import { JwtAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest): Promise<{
    accessToken: string;
    user: {
      id: number;
      username: string;
      email: string;
      userType: string | undefined;
    };
  }> {
    const { accessToken, user } = await this.authService.login(req.body);

    console.log(user);

    return {
      accessToken,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.forgotPassword(email);
    return {
      message:
        'If a user with that email exists, a password reset email has been sent.',
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Your password has been successfully reset.' };
  }
}
