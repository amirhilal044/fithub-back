import { UserDto } from './user.dto';

export class ClientDto {
  id: number;
  user: UserDto;
  // Include any other properties of Client that should be exposed
}
