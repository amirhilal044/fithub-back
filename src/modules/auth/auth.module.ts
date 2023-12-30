// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client, GhostClient } from 'src/entites/client.entity';
import { Trainer } from 'src/entites/trainer.entity';
import { Users } from 'src/entites/users.entity';
import { TempStorageService } from 'src/shared/TempStorage.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET|| "e4df0955c771cc403d9def4c3277a0b6c8e4bdf4ece422d27876f8ed54a4eb88",
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    TypeOrmModule.forFeature([Users, Trainer, Client, GhostClient]),
  ],
  providers: [AuthService, UsersService, LocalStrategy,TempStorageService],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
