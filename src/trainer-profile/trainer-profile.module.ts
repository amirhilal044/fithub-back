import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from 'src/entites/trainer.entity';
import { TrainerProfileController } from './trainer-profile.controller';
import { TrainerProfileService } from './trainer-profile.service';

@Module({
  controllers: [TrainerProfileController],
  imports: [TypeOrmModule.forFeature([Trainer])],
  providers: [TrainerProfileService],
})
export class TrainerProfileModule {}
