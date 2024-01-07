export class UserDto {
  id: number;
  username: string;
  email: string;
  userType?: string;
  // Exclude the password and any other sensitive fields
}
