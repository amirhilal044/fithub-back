import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bundle } from 'src/entites/bundle.entity';
import { Client, GhostClient } from 'src/entites/client.entity';
import { Trainer } from 'src/entites/trainer.entity';
import { Users } from 'src/entites/users.entity';
import { TrainerProfileController } from './trainer-profile.controller';
import { TrainerProfileService } from './trainer-profile.service';

@Module({
  controllers: [TrainerProfileController],
  imports: [
    TypeOrmModule.forFeature([Trainer, Client, GhostClient, Users, Bundle]),
  ],
  providers: [TrainerProfileService],
})
export class TrainerProfileModule {}
