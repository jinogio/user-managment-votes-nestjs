import { Module } from '@nestjs/common';
import { EmailSesController } from './email.controller';
import { EmailSesService } from './email.service';
import { UsersService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/database/schemas/user.schema';
import { EncryptPassword } from 'src/common/utils/encrypt.password';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [EmailSesController],
  providers: [EmailSesService, UsersService, EncryptPassword],
  exports: [EmailSesService],
})
export class EmailSesModule {}
