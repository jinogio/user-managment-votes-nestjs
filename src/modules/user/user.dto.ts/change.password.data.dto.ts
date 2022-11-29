import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class IUserChangePasswordDataDto {
  @ApiProperty({
    description: 'The old password of the User',
    example: '1111',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password of the User',
    example: '2222',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
