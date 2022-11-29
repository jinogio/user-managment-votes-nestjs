import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';

import { User } from 'src/database/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isUUID } from 'class-validator';
import { User_Error_Message } from '../constants/user.error.messages';

@Injectable()
export class admindoesNotDeleteItself implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user, params } = context.switchToHttp().getRequest();

    if (!isUUID(params.userID)) {
      throw new BadRequestException(User_Error_Message.UUID_VALIDATION_ERROR);
    }

    if (user.role === 'admin') {
      if (user.userID !== params?.userID && requiredRole?.includes(user.role)) {
        return true;
      }
    }

    return false;
  }
}
