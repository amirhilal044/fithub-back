import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from 'src/dto/Login.dto';
import { UserDto } from 'src/dto/user.dto';
import { AuthService, ResetPasswordDto } from './auth.service';
import { JwtAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: UserDto }> {
    const { accessToken, user } = await this.authService.login(loginDto);

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
