import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { Options } from 'src/entites/option.entity';
import { Repository } from 'typeorm';

const openai = new OpenAI({
  apiKey: process.env.openAiKey,
  organization: process.env.openAiOrg, // Optional, only if you're part of an organization
});
@Injectable()
export class OpenAiService {
  constructor(
    @InjectRepository(Options)
    private optionsRepository: Repository<Options>,
  ) {}

  async createWorkoutPlan(messageContent: any): Promise<any> {
    try {
      const completion = await openai.chat.completions.create({
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

  async findAll(): Promise<Options[]> {
    // Should return an array of Option entities
    return this.optionsRepository.find();
  }
}
