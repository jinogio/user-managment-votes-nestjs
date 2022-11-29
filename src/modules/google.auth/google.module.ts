import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { UsersService } from '../user/user.service';
import { GoogleStrategy } from './google.strategy';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/database/schemas/user.schema';
import { EncryptPassword } from 'src/common/utils/encrypt.password';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, UsersService, EncryptPassword],
  exports: [GoogleService],
})
export class GoogleModule {}
