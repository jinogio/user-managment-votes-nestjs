import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IUserUpdateDataDto {
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
}
