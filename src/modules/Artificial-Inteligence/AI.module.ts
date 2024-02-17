import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Options } from 'src/entites/option.entity';
import { OpenAiController } from './open-ai.controller';
import { OpenAiService } from './open-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Options])],
  providers: [OpenAiService],
  controllers: [OpenAiController],
})
export class OptionsModule {}
