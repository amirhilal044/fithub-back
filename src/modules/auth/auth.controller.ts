import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: ExpressRequest,
  ): Promise<{
    accessToken: string;
    user: { id: number; username: string; email: string };
  }> {
    const { accessToken, user } = await this.authService.login(req.body);

    console.log(user);

    return {
      accessToken,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
      },
    };
  }
}
