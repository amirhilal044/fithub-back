import { Body, Controller, Get, Post } from '@nestjs/common';
import { OptionsDTO } from 'src/dto/options.dto';
import { WorkoutPlanTrainerDto } from 'src/dto/workoutPlanTrainerI.dto';
import { OpenAiService } from './open-ai.service';

@Controller('options')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Get()
  findAll(): Promise<OptionsDTO[]> {
    return this.openAiService.findAll();
  }

  @Post()
  async createWorkoutPlan(@Body() workoutPlanDto: WorkoutPlanTrainerDto) {
    const prompt = `As my personal trainer, based on this information: ${JSON.stringify(
      workoutPlanDto,
    )} please create a custom workout plan for me.`;
    console.log(`Sending prompt to OpenAI: ${prompt}`); // Debugging log
    const response = await this.openAiService.createWorkoutPlan(prompt);
    return response;
  }
}
