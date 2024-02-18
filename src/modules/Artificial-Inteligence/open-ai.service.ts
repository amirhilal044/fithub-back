import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import { Options } from 'src/entites/option.entity';
import { Users } from 'src/entites/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Options)
    private optionsRepository: Repository<Options>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,

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

  async createWorkoutPlan(
    userId: number,
    messageContent: string,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user?.aiRequestToken && user?.aiRequestToken > 0) {
      try {
        user.aiRequestToken -= 1;
        await this.userRepository.save(user);
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
  }

  async createMealPlan(userId: number, messageContent: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user?.aiRequestToken && user?.aiRequestToken > 0) {
      try {
        user.aiRequestToken -= 1;
        await this.userRepository.save(user);
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
}
