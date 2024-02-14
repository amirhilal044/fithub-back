import { UserDto } from './user.dto';

export class ClientDto {
  id: number;
  user: UserDto | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
}

export class CreateGhostClientDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

// export class GhostClientDto {
//   id: number;
//   trainer: TrainerDto;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
// }
