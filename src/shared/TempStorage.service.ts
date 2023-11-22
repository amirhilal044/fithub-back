import { Injectable } from '@nestjs/common';
import { AddUserDto } from 'src/dto/AddUser.dto';

@Injectable()
export class TempStorageService {
  private verificationCodes = new Map<string, string>();
  private userDataStore = new Map<string, AddUserDto>();

  async storeVerificationCode(email: string, code: string): Promise<void> {
    this.verificationCodes.set(email, code);
    // Set a timeout to delete the code after a certain period
    setTimeout(() => this.verificationCodes.delete(email), 300000); // 5 minutes
  }

  async getVerificationCode(email: string): Promise<string | undefined> {
    return this.verificationCodes.get(email);
  }

  async storeUserData(email: string, userData: AddUserDto): Promise<void> {
    this.userDataStore.set(email, userData);
  }

  async getUserData(email: string): Promise<AddUserDto | undefined> {
    return this.userDataStore.get(email);
  }

  async clearVerificationData(email: string): Promise<void> {
    this.verificationCodes.delete(email);
    this.userDataStore.delete(email);
  }
}
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class TempStorageService {
//   private verificationCodes = new Map<string, string>();
//   private userDataStore = new Map<string, any>();
//   private readonly timeout = 300000; // e.g., 5 minutes

//   storeVerificationCode(email: string, code: string): void {
//     this.verificationCodes.set(email, code);
//     setTimeout(() => this.verificationCodes.delete(email), this.timeout);
//   }

//   storeUserData(email: string, userData: any): void {
//     this.userDataStore.set(email, userData);
//     setTimeout(() => this.userDataStore.delete(email), this.timeout);
//   }

//   getVerificationCode(email: string): string | undefined {
//     return this.verificationCodes.get(email);
//   }

//   getUserData(email: string): any {
//     return this.userDataStore.get(email);
//   }

//   clearVerificationData(email: string): void {
//     this.verificationCodes.delete(email);
//     this.userDataStore.delete(email);
//   }
// }
