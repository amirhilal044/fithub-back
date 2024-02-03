import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'googleapis-common';

@Injectable()
export class CalendarService {
  private clientId =
    '188626381328-2kqsqqh2dqatt51ahggabvors2f55q1e.apps.googleusercontent.com'; // Replace with your actual client ID
  private client = new OAuth2Client(this.clientId);

  async verifyToken(idToken: string) {
    console.log('idToken', idToken);
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    // If needed, you can now use the payload to check if the user is authorized
    console.log(payload);

    return payload;
  }
}
