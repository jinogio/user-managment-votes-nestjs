import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

import { LocalAuthGuard } from './guard/local.auth.guard';
import { LocalStrategy } from './strategy/local.strategy';
import { EncryptPassword } from 'src/common/utils/encrypt.password';
import { UsersModule } from 'src/modules/user/user.module';
import { UserSchema } from 'src/database/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    EncryptPassword,
    AuthService,
    JwtStrategy,
    LocalAuthGuard,
    LocalStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
