import { Injectable } from '@nestjs/common';
import axios from 'axios';
import OpenAI from 'openai';
@Injectable()
export class OpenAiService {
  private readonly huggingFaceApiUrl = 'https://api-inference.huggingface.co/models/Rifky/Indobert-QA';
  async createWorkoutPlan(prompt: string): Promise<any> {
    try {
      const response = await axios.post(
        this.huggingFaceApiUrl,
        { text: prompt },
        {
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data;
    } catch (error) {
      // Log detailed error information
      console.error('Error sending request to Hugging Face:', error.response?.data || error.message);
      throw new Error('Failed to create workout plan');
    }
  }
  
}