import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from 'src/entites/option.entity';
import { FitnessGoalController } from './AI.controller';
import { AIService } from './AI.service';

@Module({
  imports: [TypeOrmModule.forFeature([Options])],
  providers: [AIService],
  controllers: [FitnessGoalController],
})
export class OptionsModule {}
