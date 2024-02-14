import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBundleDto } from 'src/dto/create-bundle.dto';
import { TrainerProfileDto } from 'src/dto/trainer.dto';
import { Bundle } from 'src/entites/bundle.entity';
import { Client, GhostClient } from 'src/entites/client.entity';
import { Trainer } from 'src/entites/trainer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrainerProfileService {
  constructor(
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,

    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(Bundle)
    private bundleRepository: Repository<Bundle>,

    @InjectRepository(GhostClient)
    private ghostClientRepository: Repository<GhostClient>,
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

  async createBundleForClient(
    createBundleDto: CreateBundleDto,
    userId: number,
  ): Promise<Bundle> {
    const trainerId = await this.getTrainerIdFromUserId(userId);

    let associatedClient;
    if (createBundleDto.isGhost) {
      const ghostClient = await this.ghostClientRepository.findOneOrFail({
        where: { trainer: { id: trainerId }, id: createBundleDto.clientId },
      });

      associatedClient = ghostClient;
    } else {
      const client = await this.clientRepository.findOneOrFail({
        where: { trainers: { id: trainerId }, id: createBundleDto.clientId },
        relations: ['trainers'],
      });

      associatedClient = client;
    }

    if (!associatedClient) {
      throw new Error('Client does not belong to the trainer');
    }

    let bundle = this.bundleRepository.create({
      ...createBundleDto,
      client: createBundleDto.isGhost ? null : associatedClient,
      ghostClient: createBundleDto.isGhost ? associatedClient : null,
    });

    return this.bundleRepository.save(bundle);
  }

  async getTrainerIdFromUserId(userId: number): Promise<number> {
    const trainer = await this.trainerRepository.findOne({
      where: { user: { id: userId } },
      select: ['id'],
    });

    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    return trainer.id;
  }

  async getClientsByTrainer(userId: number): Promise<any[]> {
    const trainerId = await this.getTrainerIdFromUserId(userId);

    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId },
      relations: ['clients', 'ghostClients'],
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${trainerId} not found`);
    }

    const combinedClients = [
      ...trainer.clients,
      ...trainer.ghostClients.map((ghost) => ({ ...ghost, isGhost: true })),
    ];

    return combinedClients;
  }
}
