import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from 'src/entites/option.entity';
import { Users } from 'src/entites/users.entity';
import { OpenAiController } from './open-ai.controller';
import { OpenAiService } from './open-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Options, Users])],
  providers: [OpenAiService],
  controllers: [OpenAiController],
})
export class OptionsModule {}
