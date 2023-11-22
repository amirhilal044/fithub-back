import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entites/users.entity';
import { Trainer } from 'src/entites/trainer.entity';
import { Client } from 'src/entites/client.entity';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([Users, Trainer, Client])]

})
export class UsersModule {}
