import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { Options } from 'src/entites/option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Options)
    private optionsRepository: Repository<Options>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      organization: this.configService.get<string>('OPENAI_ORG'),
    });
  }

  async findAll(): Promise<Options[]> {
    // Should return an array of Option entities
    return this.optionsRepository.find();
  }

  async createWorkoutPlan(messageContent: any): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a personal trainer.',
          },
          {
            role: 'user',
            content: messageContent,
          },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }

  async createMealPlan(messageContent: any): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a nutritionist.',
          },
          {
            role: 'user',
            content: messageContent,
          },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw error;
    }
  }
}
