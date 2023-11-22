import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AddUserDto } from 'src/dto/AddUser.dto';
import { ClientDto } from 'src/dto/client.dto';
import { TrainerDto } from 'src/dto/trainer.dto';
import { Client } from 'src/entites/client.entity';
import { Trainer } from 'src/entites/trainer.entity';
import { Users } from 'src/entites/users.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(addUserDto: AddUserDto): Promise<Users> {
    const { email, username, password, userType } = addUserDto;

    // Email and username uniqueness check
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ConflictException('Email or username is already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = this.usersRepository.create({
      ...addUserDto,
      password: hashedPassword,
    });
    const user = await this.usersRepository.save(newUser);

    // Handle user type
    if (userType === 'trainer') {
      await this.trainerRepository.save({ user });
    } else if (userType === 'client') {
      await this.clientRepository.save({ user });
    } else {
      throw new NotFoundException('Invalid user type specified');
    }

    return user;
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: AddUserDto): Promise<Users> {
    const user = await this.usersRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async assignClientToTrainer(
    clientId: number,
    trainerId: number,
  ): Promise<TrainerDto> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId },
      relations: ['clients', 'user'],
    });
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });

    if (!trainer || !client) {
      throw new NotFoundException('Trainer or client not found');
    }

    // Check if the client is already assigned to the trainer to avoid duplicates
    const isAlreadyAssigned = trainer.clients.some(
      (existingClient) => existingClient.id === clientId,
    );
    if (isAlreadyAssigned) {
      // Handle the case where the client is already assigned
      throw new BadRequestException(
        'Client is already assigned to this trainer',
      );
    }

    trainer.clients.push(client);
    await this.trainerRepository.save(trainer);

    const trainerDto: TrainerDto = {
      id: trainer.id,
      user: {
        id: trainer.user.id,
        username: trainer.user.username,
        email: trainer.user.email,
        // Do not include the password field
      },
      clients: trainer.clients.map(
        (client) =>
          ({
            id: client.id,
            user: {
              id: client.user.id,
              username: client.user.username,
              email: client.user.email,
              // Do not include the password field
            },
          }) as ClientDto,
      ),
      // Add any additional trainer-specific properties
    };

    return trainerDto;
  }
  async findTrainerWithClients(trainerId: number): Promise<TrainerDto> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId },
      relations: ['clients', 'clients.user'],
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${trainerId} not found`);
    }

    // Transform to TrainerDto, excluding sensitive information
    const trainerDto: TrainerDto = {
      id: trainer.id,
      user: {
        id: trainer.user.id,
        username: trainer.user.username,
        email: trainer.user.email,
        // Do not include the password field
      },
      clients: trainer.clients.map(
        (client) =>
          ({
            id: client.id,
            user: {
              id: client.user.id,
              username: client.user.username,
              email: client.user.email,
              // Do not include the password field
            },
          }) as ClientDto,
      ),
      // Add any additional trainer-specific properties
    };

    return trainerDto;
  }
}
