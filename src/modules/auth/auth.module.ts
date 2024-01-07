// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from 'src/entites/PasswordReset.entity';
import { Client, GhostClient } from 'src/entites/client.entity';
import { Trainer } from 'src/entites/trainer.entity';
import { Users } from 'src/entites/users.entity';
import { TempStorageService } from 'src/shared/TempStorage.service';
import { SharedModule } from 'src/shared/shared.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './local-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret:
        process.env.JWT_SECRET ||
        'e4df0955c771cc403d9def4c3277a0b6c8e4bdf4ece422d27876f8ed54a4eb88',
      signOptions: { expiresIn: '1h' },
    }),
    SharedModule,
    TypeOrmModule.forFeature([
      Users,
      Trainer,
      Client,
      GhostClient,
      PasswordReset,
    ]),
  ],
  providers: [AuthService, UsersService, LocalStrategy, TempStorageService],
  exports: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
