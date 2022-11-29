import { Controller, Get, UseGuards, Req } from '@nestjs/common';

import { GoogleService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';

@Controller()
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const userData = await this.googleService.googleLogin(req);
    // console.log(userData.valueOf()['user']['email']);
    const result = await this.googleService.createUserByGoogle(
      userData.valueOf()['user']['lastname'],
      userData.valueOf()['user']['email'],
    );
    console.log({ data: result });
    return await result;
    // return this.googleService.googleLogin(req);
  }
}
