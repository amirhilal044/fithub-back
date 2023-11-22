import { IsEmail, IsString, Length } from 'class-validator';

export class VerificationDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 4)
  code: string;
}
