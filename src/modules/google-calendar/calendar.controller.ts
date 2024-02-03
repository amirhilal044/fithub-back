// src/calendar/calendar.controller.ts

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { JwtAuthGuard } from '../auth/local-auth.guard';
import { UsersService } from '../users/users.service';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/token')
  // @UseGuards(JwtAuthGuard)
  // async saveGoogleCalendarToken(
  //   @User() user: UserDto,
  //   @Body() body: { idToken: string },
  // ) {
  //   await this.usersService.saveGoogleCalendarToken(user.id, body.idToken);
  //   return { message: 'Token saved successfully' };
  // }
  async verifyToken(@Body() body: { token: string }) {
    return this.calendarService.verifyToken(body.token);
  }

  @Get('/get-token')
  @UseGuards(JwtAuthGuard)
  async getGoogleCalendarToken(@User() user: UserDto) {
    const token = await this.usersService.getGoogleCalendarToken(user.id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    return { googleCalendarToken: token };
  }
}
