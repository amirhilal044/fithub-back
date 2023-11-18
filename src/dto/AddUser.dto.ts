import { IsNotEmpty } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  userTypeId: number;
  
}
