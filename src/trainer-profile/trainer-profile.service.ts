import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainerProfileDto } from 'src/dto/trainer.dto';
import { Trainer } from 'src/entites/trainer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrainerProfileService {
  constructor(
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
  ) {}

  async findTrainerByUserId(userId: number): Promise<Trainer> {
    const trainer = await this.trainerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with user ID ${userId} not found`);
    }

    return trainer;
  }
  
  async updateTrainerProfile(
    userId: number,
    trainerProfileDto: TrainerProfileDto,
  ): Promise<Trainer | null> {
    const trainer = await this.trainerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with user ID ${userId} not found.`);
    }

    const updateData: Partial<Trainer> = {};
    (Object.keys(trainerProfileDto) as Array<keyof TrainerProfileDto>).forEach(
      (key) => {
        if (trainerProfileDto[key] !== undefined) {
          updateData[key] = trainerProfileDto[key];
        }
      },
    );

    if (trainerProfileDto.hasOwnProperty('educationalBackground')) {
      updateData.educationalBackground = JSON.stringify(
        trainerProfileDto.educationalBackground,
      );
    }

    await this.trainerRepository.update(trainer.id, updateData);

    return this.trainerRepository.findOne({
      where: { id: trainer.id },
      relations: ['user'],
    });
  }
}
