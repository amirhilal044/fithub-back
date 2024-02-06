import { Module } from '@nestjs/common';
import { TrainerProfileController } from './trainer-profile.controller';
import { TrainerProfileService } from './trainer-profile.service';

@Module({
  controllers: [TrainerProfileController],
  providers: [TrainerProfileService]
})
export class TrainerProfileModule {}
