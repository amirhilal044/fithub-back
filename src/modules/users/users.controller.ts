import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDto } from 'src/dto/AddUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  async getAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @Get('/:id')
  async getOneUser(@Param('id') id: number) {
    return await this.usersService.findOneUser(id);
  }

  @Post('/add')
  @UsePipes(ValidationPipe)
  async addUser(@Body() addUserDto: AddUserDto) {
    return await this.usersService.addOneUser(addUserDto);
  }

  @Put('/:id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: AddUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
