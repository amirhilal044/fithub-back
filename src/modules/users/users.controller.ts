import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AddUserDto } from 'src/dto/AddUser.dto';
import { UsersService } from './users.service';
import { Client } from 'src/entites/client.entity';
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
  ): Promise<Trainer> {
    return this.usersService.assignClientToTrainer(clientId, trainerId);
  }

  // @Get('trainers')
  // async getAllTrainers(): Promise<Trainer[]> {
  //   return this.usersService.findAllTrainers();
  // }

  // @Get('clients')
  // async getAllClients(): Promise<Client[]> {
  //   return this.usersService.findAllClients();
  // }
}
