import { Client, GhostClient } from 'src/entites/client.entity';

export class CreateBundleDto {
  clientId: number;
  sessionsNumber: number;
  totalPrice: number;
  description: string;
  isGhost: boolean;
}

export class BundleDto {
  id: number;
  sessionsNumber: number;
  totalPrice: number;
  description: string;
  client?: Client | null;
  ghostClient?: GhostClient | null;
  remainingSessions?: number;
}
