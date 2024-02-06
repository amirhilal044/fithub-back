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
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AddUserDto } from 'src/dto/AddUser.dto';
import { ClientDto, CreateClientDto, GhostClientDto } from 'src/dto/client.dto';
import { TrainerDto, TrainerProfileDto } from 'src/dto/trainer.dto';
import { UserDto } from 'src/dto/user.dto';
import { VerificationDto } from 'src/dto/verification.dto';
import { Trainer } from 'src/entites/trainer.entity';
import { JwtAuthGuard } from '../auth/local-auth.guard';
import { UsersService } from './users.service';

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

  @Get(':userId/clients')
  async getTrainerWithClients(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ClientDto[]> {
    const trainerId = (await this.usersService.findTrainerIdByUserId(userId))
      .id;
    return this.usersService.findTrainerClients(trainerId);
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
  async getTrainerIdByUser(
    @Param('userId') userId: number,
  ): Promise<number | null> {
    return this.usersService.getTrainerIdByUser(userId);
  }

  @Post('trainer-profile')
  @UseGuards(JwtAuthGuard)
  updateTrainerProfile(
    @User() user: UserDto,
    @Body() trainerProfileDto: TrainerProfileDto,
  ): Promise<Trainer | null> {
    const userId = user.id;
    return this.usersService.updateTrainerProfile(userId, trainerProfileDto);
  }

  @Get('trainer-profile/:id')
  @UseGuards(JwtAuthGuard)
  async getTrainerProfile(@Param('id') userId: number): Promise<Trainer> {
    try {
      const id = userId;
      const trainerProfile = await this.usersService.findTrainerIdByUserId(id);

      if (!trainerProfile) {
        throw new Error('Trainer profile not found');
      }
      return trainerProfile;
    } catch (error) {
      // Handle the error appropriately, log it, or throw a custom error
      console.error(`Error fetching trainer profile: ${error.message}`);
      throw new Error('Unable to fetch trainer profile');
    }
  }
}
