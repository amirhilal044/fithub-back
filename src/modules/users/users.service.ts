import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUserDto } from 'src/dto/AddUser.dto';
import { Users } from 'src/entites/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(addUserDto: AddUserDto): Promise<Users> {
    const newUser = this.usersRepository.create(addUserDto);
    return this.usersRepository.save(newUser);
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
}
