export class CreateSessionEventDto {
  sessionsBundleSessionId?: number;
  done: boolean;
  sessionsBundleId: number;
  startDateTime: Date;
  endDateTime: Date;
  description: string;
  location: string;
}
