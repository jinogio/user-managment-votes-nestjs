import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/user.module';
import { VotesModule } from './modules/vote/vote.module';
import { GoogleModule } from './modules/google.auth/google.module';
import { EmailSesModule } from './modules/SES.EMAIL/email.module';

@Module({
  imports: [
    UsersModule,
    VotesModule,
    GoogleModule,
    EmailSesModule,
    MongooseModule.forRoot(process.env.MONGO_URL),
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
