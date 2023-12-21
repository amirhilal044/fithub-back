import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
    });
  }

  async createWorkoutPlan(prompt: string): Promise<any> {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      });
      return chatCompletion.data;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}
