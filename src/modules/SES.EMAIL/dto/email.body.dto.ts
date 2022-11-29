import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class IEmailDataDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
