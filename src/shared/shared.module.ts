import { Global, Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/modules/auth/local-auth.guard';
import { UsersService } from 'src/modules/users/users.service';

@Global()
@Module({
  providers: [AuthService, UsersService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, UsersService, JwtStrategy, JwtAuthGuard],
})
export class SharedModule {}
