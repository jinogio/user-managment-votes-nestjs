import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptPassword } from 'src/common/utils/encrypt.password';
import { AuthModule } from 'src/authentication/auth.module';
import { UserSchema } from 'src/database/schemas/user.schema';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
// import { EmailSesService } from '../SES.EMAIL/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, EncryptPassword, UsersController],
  exports: [UsersService],
})
export class UsersModule {}
