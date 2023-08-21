import { IsString, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
