import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BundleDto, CreateBundleDto } from 'src/dto/create-bundle.dto';
import { CreateSessionEventDto } from 'src/dto/create-session-event.dto';
import { TrainerProfileDto } from 'src/dto/trainer.dto';
import { Bundle } from 'src/entites/bundle.entity';
import { Client, GhostClient } from 'src/entites/client.entity';
import { SessionEvent } from 'src/entites/session-event.entity';
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

    @InjectRepository(SessionEvent)
    private sessionEventRepository: Repository<SessionEvent>,
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

  async createOrUpdateSessionEvent(
    createSessionEventDto: CreateSessionEventDto,
  ): Promise<SessionEvent> {
    let sessionEvent: SessionEvent;

    // Check if updating an existing session event
    if (createSessionEventDto.sessionsBundleSessionId) {
      sessionEvent = await this.sessionEventRepository.findOneOrFail({
        where: { id: createSessionEventDto.sessionsBundleSessionId },
      });
      // Update fields but ignore 'done' as it will be determined by time
      sessionEvent.description = createSessionEventDto.description;
      sessionEvent.location = createSessionEventDto.location;
      sessionEvent.startDateTime = createSessionEventDto.startDateTime;
      sessionEvent.endDateTime = createSessionEventDto.endDateTime;
      // Assume done is managed separately, e.g., by a scheduled task or manual update
    } else {
      // Creating a new session event, associating it with the bundle
      sessionEvent = this.sessionEventRepository.create({
        ...createSessionEventDto,
        sessionBundle: await this.bundleRepository.findOneOrFail({
          where: { id: createSessionEventDto.sessionsBundleId },
        }),
        done: false,

        // 'done' should not be set here; it's determined by time or manual action later
      });
    }

    await this.sessionEventRepository.save(sessionEvent);

    // No need to call updateBundleStatus here if 'done' is managed based on time
    return sessionEvent;
  }

  // async updateBundleStatus(bundleId: number): Promise<Bundle> {
  //   const bundle = await this.bundleRepository.findOneOrFail({
  //     where: { id: bundleId },
  //     relations: ['sessionEvents'],
  //   });

  //   const completedSessions = bundle.sessionEvents.filter(
  //     (session) => session.done,
  //   ).length;

  //   if (completedSessions >= bundle.sessionsNumber) {
  //     bundle.done = true;
  //     await this.bundleRepository.save(bundle);
  //   }

  //   return bundle;
  // }

  async getBundleById(bundleId: number): Promise<BundleDto> {
    const bundle = await this.bundleRepository.findOne({
      where: { id: bundleId },
      relations: ['client', 'ghostClient', 'sessionEvents'],
    });

    if (!bundle) {
      throw new NotFoundException(`Bundle with ID ${bundleId} not found`);
    }

    // Calculate remaining sessions
    const completedSessions = bundle.sessionEvents.filter(
      (session) => session.done,
    ).length;
    const remainingSessions = bundle.sessionsNumber - completedSessions;

    // Map to DTO
    const bundleDto: BundleDto = { ...bundle, remainingSessions };
    return bundleDto;
  }

  async getBundlesByClientId(
    clientId: number,
    isGhost: boolean,
  ): Promise<BundleDto[]> {
    let bundles;

    if (isGhost) {
      // Fetch bundles associated with a GhostClient
      bundles = await this.bundleRepository.find({
        where: { ghostClient: { id: clientId } },
        relations: ['sessionEvents', 'ghostClient'],
      });
    } else {
      // Fetch bundles associated with a regular Client
      bundles = await this.bundleRepository.find({
        where: { client: { id: clientId } },
        relations: ['sessionEvents', 'client'],
      });
    }

    // Optionally calculate remaining sessions for each bundle and map to DTOs
    const bundleDtos = bundles.map((bundle) => {
      const completedSessions = bundle.sessionEvents.filter(
        (session) => session.done,
      ).length;
      const remainingSessions = bundle.sessionsNumber - completedSessions;

      // Construct and return the DTO for each bundle
      return { ...bundle, remainingSessions };
    });

    return bundleDtos;
  }

  async getEventsByTrainerId(userId: number): Promise<any[]> {
    const trainerId = await this.getTrainerIdFromUserId(userId);

    const sessionEvents = await this.sessionEventRepository
      .createQueryBuilder('sessionEvent')
      .leftJoinAndSelect('sessionEvent.sessionBundle', 'bundle')
      .leftJoinAndSelect('bundle.client', 'client')
      .leftJoinAndSelect('bundle.ghostClient', 'ghostClient')
      .leftJoin('client.trainers', 'trainer')
      .leftJoin('ghostClient.trainer', 'gTrainer')
      .where('trainer.id = :trainerId OR gTrainer.id = :trainerId', {
        trainerId,
      })
      .select([
        'sessionEvent.id AS id',
        'sessionEvent.done AS done',
        'sessionEvent.startDateTime AS startDateTime',
        'sessionEvent.endDateTime AS endDateTime',
        'sessionEvent.description AS description',
        'sessionEvent.location AS location',
        // Select client or ghost client name, handle nulls directly in the query
        'COALESCE(client.firstName, ghostClient.firstName) AS firstName',
        'COALESCE(client.lastName, ghostClient.lastName) AS lastName',
      ])
      .getRawMany();

    // Transform the raw results to include a single 'clientName' field
    return sessionEvents;
  }
}
