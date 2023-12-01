import { Injectable } from '@nestjs/common';
import { AddUserDto } from 'src/dto/AddUser.dto';

@Injectable()
export class TempStorageService {
  private verificationCodes = new Map<string, string>();
  private userDataStore = new Map<string, AddUserDto>();

  async storeVerificationCode(email: string, code: string): Promise<void> {
    const lowerCaseEmail = email.toLowerCase();
    this.verificationCodes.set(lowerCaseEmail, code);
    setTimeout(() => this.verificationCodes.delete(lowerCaseEmail), 300000); // 5 minutes
  }

  async getVerificationCode(email: string): Promise<string | undefined> {
    return this.verificationCodes.get(email.toLowerCase());
  }

  async storeUserData(email: string, userData: AddUserDto): Promise<void> {
    const lowerCaseEmail = email.toLowerCase();
    this.userDataStore.set(lowerCaseEmail, userData);
  }

  async getUserData(email: string): Promise<AddUserDto | undefined> {
    return this.userDataStore.get(email.toLowerCase());
  }

  async clearVerificationData(email: string): Promise<void> {
    const lowerCaseEmail = email.toLowerCase();
    this.verificationCodes.delete(lowerCaseEmail);
    this.userDataStore.delete(lowerCaseEmail);
  }
}
