// open-ai.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OpenAiService {
  constructor(private httpService: HttpService) {}

  async createWorkoutPlan(prompt: string): Promise<any> {
    const apiKey = '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'; // Use environment variable for the API key
    const headersRequest = {
      Authorization: `Bearer ${apiKey}`,
    };

    const body = {
      inputs: prompt,
      parameters: {
        max_length: 500, // Adjust this value as needed
      },
      options: {
        trust_remote_code: true, // Only set this if you trust the model source
      },
    };

    try {
      const response = this.httpService.post(
        'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
        body,
        { headers: headersRequest },
      );
      const responseData = await lastValueFrom(response);
      return responseData.data;
    } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      throw error;
    }
  }
}

// READ
// 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

// WRITE
// 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
