import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  providers: [CalendarService],
  controllers: [CalendarController],
  imports: [UsersModule],
})
export class CalendarModule {}
