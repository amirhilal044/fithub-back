import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { OptionsModule } from './modules/Artificial-Inteligence/AI.module';
import { AuthModule } from './modules/auth/auth.module';
import { CalendarModule } from './modules/google-calendar/calendar.module';
import { UsersModule } from './modules/users/users.module';
import { TempStorageService } from './shared/TempStorage.service';
@Module({
  imports: [
    UsersModule,
    OptionsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',

        port: 465,
        secure: true,
        auth: {
          user: 'growtopiay7@gmail.com',
          pass: 'exdiavbasfbeizjs',
        },
      },
      defaults: {
        from: 'No Reply <growtopiay7@gmail.com>',
      },
    }),
    AuthModule,
    CalendarModule,
  ],
  controllers: [],
  providers: [TempStorageService],
})
export class AppModule {}
