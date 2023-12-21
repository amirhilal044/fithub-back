import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Options } from 'src/entites/option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AIService {
  constructor(
    @InjectRepository(Options) // Should be the entity, not DTO
    private optionsRepository: Repository<Options>, // Corrected variable name
  ) {}

  async findAll(): Promise<Options[]> {
    // Should return an array of Option entities
    return this.optionsRepository.find();
  }
}
