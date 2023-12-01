import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { TempStorageService } from './shared/TempStorage.service';

@Module({
  imports: [
    UsersModule,
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
  ],
  controllers: [],
  providers: [TempStorageService],
})
export class AppModule {}
// host: process.env.MAIL_HOST,
// port: Number(process.env.MAIL_PORT),
// secure: process.env.MAIL_SECURE === 'true',
// auth: {
//   user: process.env.MAIL_USER,
//   pass: process.env.MAIL_PASS,
// },
