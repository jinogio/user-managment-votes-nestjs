import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/interfaces/user.interface';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { IAuthDataDto } from './auth-dto/auth.data.dto';
import { EncryptPassword } from 'src/common/utils/encrypt.password';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserNotFoundError,
  UserIsDeletedError,
  UserIsAlreadyPausedError,
  EmeailOrPasswordIncorrectError,
} from 'src/common/errors/user.custome.errors';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
    private readonly encryptPassword: EncryptPassword,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const profile = await this.userModel.findOne({
      email,
    });

    if (!profile) {
      throw new EmeailOrPasswordIncorrectError();
    }
    const [salt] = profile.password.split('.');
    const hashedPassword = await this.encryptPassword.encrypt(password, salt);

    if (profile.get('isDeleted')) {
      throw new UserIsDeletedError();
    }
    if (!profile.isActive) {
      throw new UserIsAlreadyPausedError();
    }

    if (profile.password !== hashedPassword) {
      throw new EmeailOrPasswordIncorrectError();
    }

    return this.login(profile);
  }

  async login(profile_data: User) {
    const payload = {
      userID: profile_data.userID,
      email: profile_data.email,
      firstname: profile_data.firstname,
      lastname: profile_data.lastname,
      role: profile_data.role,
    };
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.KEY }),
    };
  }
}
