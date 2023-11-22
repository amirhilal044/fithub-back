import { MailerService } from '@nestjs-modules/mailer';
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
import { TempStorageService } from 'src/shared/TempStorage.service';
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
    private readonly mailerService: MailerService,
    private readonly tempStorageService: TempStorageService,
  ) {}

  async create(addUserDto: AddUserDto): Promise<void> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: addUserDto.email }, { username: addUserDto.username }],
    });
    if (existingUser) {
      throw new ConflictException('Email or username is already in use');
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    await this.mailerService.sendMail({
      to: addUserDto.email,
      subject: 'Verify Your Account',
      text: `Your verification code is ${verificationCode}`,
    });

    await this.tempStorageService.storeVerificationCode(
      addUserDto.email,
      verificationCode,
    );
    await this.tempStorageService.storeUserData(addUserDto.email, addUserDto);
  }

  async verifyCodeAndCreateUser(email: string, code: string): Promise<Users> {
    const storedCode = await this.tempStorageService.getVerificationCode(email);
    if (storedCode !== code) {
      throw new ConflictException('Verification code is incorrect');
    }

    const userData = await this.tempStorageService.getUserData(email);
    if (!userData) {
      throw new NotFoundException(
        'User data not found or verification code has expired',
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    await this.tempStorageService.clearVerificationData(email);

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
