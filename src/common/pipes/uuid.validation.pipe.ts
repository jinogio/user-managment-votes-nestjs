import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Types } from 'mongoose';
import { User_Error_Message } from '../constants/user.error.messages';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  /* A function that takes two parameters. */
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type != 'param') {
      return value;
    }
    // console.log(Types.ObjectId.isValid(value));
    if (!isUUID(value)) {
      throw new BadRequestException(User_Error_Message.UUID_VALIDATION_ERROR);
    }

    return value;
  }
}
