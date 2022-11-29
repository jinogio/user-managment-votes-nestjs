import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class IAuthDataDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'g.bakuradze@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '111',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
