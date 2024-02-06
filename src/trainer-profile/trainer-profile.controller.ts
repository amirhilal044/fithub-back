import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { TrainerProfileDto } from 'src/dto/trainer.dto';
import { UserDto } from 'src/dto/user.dto';
import { Trainer } from 'src/entites/trainer.entity';
import { JwtAuthGuard } from 'src/modules/auth/local-auth.guard';
import { UsersService } from './../modules/users/users.service';
import { TrainerProfileService } from './trainer-profile.service';

@UseGuards(JwtAuthGuard)
@Controller('trainer')
export class TrainerProfileController {
  constructor(
    private trainerProfileService: TrainerProfileService,
  ) {}

  @Post('update')
  updateTrainerProfile(
    @User() user: UserDto,
    @Body() trainerProfileDto: TrainerProfileDto,
  ): Promise<Trainer | null> {
    const userId = user.id;
    return this.trainerProfileService.updateTrainerProfile(
      userId,
      trainerProfileDto,
    );
  }

  @Get('show')
  findTrainerProfileWithClients(@User() user: UserDto) {
    return this.trainerProfileService.findTrainerByUserId(user.id);
  }
}
