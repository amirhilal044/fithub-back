import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from 'src/entites/option.entity';
import { FitnessGoalController } from './AI.controller';
import { AIService } from './AI.service';
import { OpenAiService } from './open-ai.service';
import { WorkoutPlanController } from './workout-plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Options]), HttpModule],
  providers: [AIService, OpenAiService],
  controllers: [FitnessGoalController, WorkoutPlanController],
})
export class OptionsModule {}
