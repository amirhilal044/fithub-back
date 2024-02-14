import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AddUserDto } from 'src/dto/AddUser.dto';
import { CreateGhostClientDto } from 'src/dto/client.dto';
import { UserDto } from 'src/dto/user.dto';
import { VerificationDto } from 'src/dto/verification.dto';
import { JwtAuthGuard } from '../auth/local-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchUsers(@Query('query') query: string) {
    return this.usersService.searchByUsername(query);
  }

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

  // only trainer will assign clients to them
  // to be fixed
  // @Post('assign-client-to-trainer')
  // async assignClientToTrainer(
  //   @Body() clientTrainerObject:any
  // ): Promise<TrainerDto> {
  //   return this.usersService.assignClientToTrainer(clientTrainerObject);
  // }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyCodeAndCreateUser(@Body() verificationDto: VerificationDto) {
    return this.usersService.verifyCodeAndCreateUser(
      verificationDto.email.toLowerCase(),
      verificationDto.code,
    );
  }

  @Post('create-ghost-client')
  @UseGuards(JwtAuthGuard)
  async createGhostClient(
    @User() user: UserDto,
    @Body() createClientDto: CreateGhostClientDto,
  ): Promise<CreateGhostClientDto> {
    const userId = user.id;
    const ghostClient = await this.usersService.createGhostClient(
      createClientDto,
      userId,
    );
    return ghostClient;
  }
}
