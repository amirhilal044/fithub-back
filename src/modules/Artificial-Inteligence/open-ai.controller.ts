import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { OptionsDTO } from 'src/dto/options.dto';
import { UserDto } from 'src/dto/user.dto';
import { WorkoutPlanTrainerDto } from 'src/dto/workoutPlanTrainerI.dto';
import { JwtAuthGuard } from '../auth/local-auth.guard';
import { OpenAiService } from './open-ai.service';
@UseGuards(JwtAuthGuard)
@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Get('/workout-options')
  findAll(): Promise<OptionsDTO[]> {
    return this.openAiService.findAll();
  }

  @Post('/workout-plan')
  async createWorkoutPlan(
    @User() user: UserDto,
    @Body() workoutPlanDto: WorkoutPlanTrainerDto,
  ) {
    const userId = user.id;

    const prompt = `As my personal trainer, based on this information: ${JSON.stringify(
      workoutPlanDto,
    )} please create a custom workout plan for me.`;
    const response = await this.openAiService.createWorkoutPlan(userId, prompt);
    return response;
  }

  @Post('/meal-plan')
  async createMealPlan(@User() user: UserDto, @Body() mealPlanDto: any) {
    const userId = user.id;

    const prompt = `As my nutritionist, based on this information: ${JSON.stringify(
      mealPlanDto,
    )} please create a custom meal plan for me.`;
    const response = await this.openAiService.createMealPlan(userId, prompt);
    return response;
  }
}
