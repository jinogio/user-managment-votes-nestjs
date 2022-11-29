import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/database/interfaces/user.interface';
import { IEmailDataDto } from './dto/email.body.dto';
import * as AWS from 'aws-sdk';
const ses = new AWS.SES({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});
// const adminEmail = process.env.admin;
@Injectable()
export class EmailSesService {
  constructor(
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
  ) {}

  async sesTest(admin: string, emailData: IEmailDataDto) {
    const params = {
      Destination: {
        ToAddresses: [emailData.email],
      },
      Message: {
        Body: {
          Text: {
            Data: `From Contract ${emailData.name} -${emailData.message}`,
          },
        },
        Subject: {
          Data: `Name ${emailData.email}`,
        },
      },
      Source: admin,
    };

    return ses.sendEmail(params).promise();
  }
}
