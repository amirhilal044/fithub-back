import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Request as ExpressRequest } from 'express'; 

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest): Promise<{ access_token: string, user: { id: number, username: string , email: string} }> {

    const { access_token, user } = await this.authService.login(req.body);

    console.log(user);

    return {
      access_token,
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
      },
    };
  }
}
