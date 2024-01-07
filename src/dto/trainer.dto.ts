import { ClientDto } from './client.dto';
import { UserDto } from './user.dto';

export class TrainerDto {
  id: number;
  user: UserDto;
  clients: ClientDto[];
  // Include any other trainer-specific properties
}

export class TrainerProfileDto {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly briefBio?: string;
  readonly profilePicture?: string;
  readonly specialities?: string[];
  readonly educationalBackground?: string;
  readonly certifications?: string[];
  readonly phoneNumber?: string;
  readonly email?: string;
  readonly tiktok?: string;
  readonly instagram?: string;
  readonly linkedin?: string;
}
