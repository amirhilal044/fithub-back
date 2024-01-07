import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from 'src/entites/PasswordReset.entity';
import { Client, GhostClient } from 'src/entites/client.entity';
import { Trainer } from 'src/entites/trainer.entity';
import { Users } from 'src/entites/users.entity';
import { TempStorageService } from 'src/shared/TempStorage.service';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, TempStorageService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Trainer,
      Client,
      GhostClient,
      PasswordReset,
    ]),
    AuthModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
