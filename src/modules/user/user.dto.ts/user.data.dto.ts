import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IUserDataDto {
  @ApiProperty({
    description: 'The firstname of the User',
    example: 'giorgi',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  firstname: string;

  @ApiProperty({
    description: 'The lastname of the User',
    example: 'bakuradze',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'The idCard of the User',
    example: '60001078283',
  })
  @IsString()
  @IsNotEmpty()
  idCard: string;

  @ApiProperty({
    description: 'The email of the User',
    example: 'g.bakuradze@gmail.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the User',
    example: '1111',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'The role of the User',
    example: 'basic',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
