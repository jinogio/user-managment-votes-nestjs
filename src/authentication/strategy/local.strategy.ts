import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { userErrorHandler } from 'src/common/handler/user.error.handler';
import { request } from 'https';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const getUserToken = await this.authService.validateUser(email, password);

      return getUserToken;
    } catch (error) {
      userErrorHandler(error);
    }
  }
}
