import { Controller, Get } from '@nestjs/common';
import { OptionsDTO } from 'src/dto/options.dto';
import { AIService } from './AI.service';

@Controller('options')
export class FitnessGoalController {
  constructor(private readonly AIService: AIService) {}

  @Get()
  findAll(): Promise<OptionsDTO[]> {
    return this.AIService.findAll();
  }
}
