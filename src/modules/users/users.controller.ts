import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AddUserDto } from 'src/dto/AddUser.dto';
import { CreateClientDto, GhostClientDto } from 'src/dto/client.dto';
import { TrainerDto } from 'src/dto/trainer.dto';
import { VerificationDto } from 'src/dto/verification.dto';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { Trainer } from 'src/entites/trainer.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() addUserDto: AddUserDto) {
    return this.usersService.create(addUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: AddUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('assign-client-to-trainer/:clientId/:trainerId')
  async assignClientToTrainer(
    @Param('clientId') clientId: number,
    @Param('trainerId') trainerId: number,
  ): Promise<TrainerDto> {
    return this.usersService.assignClientToTrainer(clientId, trainerId);
  }

  @Get(':trainerId/clients')
  async getTrainerWithClients(
    @Param('trainerId', ParseIntPipe) trainerId: number,
  ): Promise<TrainerDto> {
    return this.usersService.findTrainerWithClients(trainerId);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyCodeAndCreateUser(@Body() verificationDto: VerificationDto) {
    return this.usersService.verifyCodeAndCreateUser(
      verificationDto.email.toLowerCase(),
      verificationDto.code,
    );
  }

  @Post('create-ghost-client')
  async createGhostClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<GhostClientDto> {
    const ghostClient =
      await this.usersService.createGhostClient(createClientDto);
    return ghostClient;
  }

  @Get('get-id-by-user/:userId')
  async getTrainerIdByUser(@Param('userId') userId: number): Promise<number | null> {
    return this.usersService.getTrainerIdByUser(userId);
  }
}
