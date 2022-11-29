import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class IGoogleUserDataDto {
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
