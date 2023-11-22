import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserDto } from 'src/dto/AddUser.dto';
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
    // Check if the email is already in use
    const existingEmailUser = await this.usersRepository.findOne({
      where: { email: addUserDto.email },
    });
    if (existingEmailUser) {
      throw new ConflictException('Email is already in use');
    }

    // Check if the username is already in use
    const existingUsernameUser = await this.usersRepository.findOne({
      where: { username: addUserDto.username },
    });
    if (existingUsernameUser) {
      throw new ConflictException('Username is already in use');
    }

    // Create and save the new user
    const newUser = this.usersRepository.create(addUserDto);
    const user = await this.usersRepository.save(newUser);

    // Depending on the specified role, create a Trainer or Client entity
    if (addUserDto.userType === 'trainer') {
      const trainer = this.trainerRepository.create({ user });
      await this.trainerRepository.save(trainer);
    } else if (addUserDto.userType === 'client') {
      const client = this.clientRepository.create({ user });
      await this.clientRepository.save(client);
    } else {
      // Handle invalid role
      throw new NotFoundException('Invalid role specified');
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
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async assignClientToTrainer(
    clientId: number,
    trainerId: number,
  ): Promise<Trainer> {
    // Find the trainer and client entities
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId },
      relations: ['clients'],
    });
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
      relations: ['trainers'],
    });

    if (!trainer || !client) {
      throw new NotFoundException('Trainer or client not found');
    }

    // Assign the client to the trainer and save
    trainer.clients.push(client);
    await this.trainerRepository.save(trainer);
    return trainer;
  }

  
  // async findAllTrainers(): Promise<Trainer[]> {
  //   try {
  //     const trainers = await this.trainerRepository.find({ relations: ['clients', 'user'] });
  //     return trainers;
  //   } catch (error) {
  //     console.log('Error in findAllTrainers:', error.stack);
  //     throw error;
  //   }
  // }
  

}
