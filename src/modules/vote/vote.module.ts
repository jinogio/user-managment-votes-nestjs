import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { EncryptPassword } from 'src/utils/encrypt-password';

import { AuthModule } from 'src/authentication/auth.module';
import { UserSchema } from 'src/database/schemas/user.schema';
import { UsersController } from '../user/user.controller';
import { UsersService } from '../user/user.service';
import { VoteSchema } from 'src/database/schemas/vote.schema';
import { VotesController } from './vote.controller';
import { VotesService } from './vote.service';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Vote', schema: VoteSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesController],
  exports: [VotesService],
  
})
export class VotesModule {}
