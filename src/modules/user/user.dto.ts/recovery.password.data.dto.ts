import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RecoveryPasswordDataDto {
  @ApiProperty({
    description: 'The recovery code of the User',
    example: '23231',
  })
  @IsString()
  @IsNotEmpty()
  recoveryNewPassword: string;
}
