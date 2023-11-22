import { ClientDto } from './client.dto';
import { UserDto } from './user.dto';

export class TrainerDto {
  id: number;
  user: UserDto;
  clients: ClientDto[];
  // Include any other trainer-specific properties
}
