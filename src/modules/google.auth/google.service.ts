import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserAlreadyExistError } from 'src/common/errors/user.custome.errors';
import { User } from 'src/database/interfaces/user.interface';
import { IGoogleUserDataDto } from './google.dto/google.user.data.dto';

@Injectable()
export class GoogleService {
  constructor(
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
  ) {}
  //NOTE sfd;fefewfewfwef
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return {
      message: 'User Info from Google',
      user: req.user,
    };
  }

  async createUserByGoogle(lastname: string, email: string) {
    const existingUser = await this.userModel.findOne({
      email: email,
    });
    if (existingUser) {
      throw new UserAlreadyExistError();
    }

    const googleUser = new this.userModel({
      lastname,
      email,
    });

    return await googleUser.save();
  }
}
