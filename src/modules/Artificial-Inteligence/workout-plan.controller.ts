import { Body, Controller, Post } from '@nestjs/common';
import { WorkoutPlanTrainerDto } from 'src/dto/workoutPlanTrainerI.dto';
import { OpenAiService } from './open-ai.service';

@Controller('workout-plan')
export class WorkoutPlanController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post()
  async createWorkoutPlan(@Body() workoutPlanDto: WorkoutPlanTrainerDto) {
    // Act as my personal trainer, i want you to create me a custom workout plan based on the following data

    const prompt = `Act as my personal trainer, based on this information: ${JSON.stringify(
      workoutPlanDto,
    )} create me a custom workout plan`;
    const response = await this.openAiService.createWorkoutPlan(prompt);
    return response;
  }
}
