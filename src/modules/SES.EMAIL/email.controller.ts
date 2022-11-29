import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  BadGatewayException,
} from '@nestjs/common';
import { json } from 'stream/consumers';
import { EmailSesService } from './email.service';
import { IEmailDataDto } from './dto/email.body.dto';
const adminEmail = process.env.admin;

@Controller()
export class EmailSesController {
  constructor(private readonly emailSesService: EmailSesService) {}

  @Post('email')
  async sendEmailData(@Body() emailData: IEmailDataDto) {
    try {
      console.log(emailData);
      const result = await this.emailSesService.sesTest(adminEmail, emailData);
      return await result;
    } catch (error) {
      throw new Error('cudi bichi');
    }
  }
}
