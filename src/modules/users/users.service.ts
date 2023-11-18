import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserDto } from 'src/dto/AddUser.dto';
import { Users } from 'src/entites/users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: UsersRepository,
  ) {}

  async findAllUsers(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async findOneUser(id: number): Promise<Users> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async addOneUser(new_user: AddUserDto) {
    return await this.usersRepository.save(new_user);
  }

  async updateUser(id: number, updateUserDto: AddUserDto): Promise<Users> {
    await this.usersRepository.update(id, updateUserDto);
    return await this.usersRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
