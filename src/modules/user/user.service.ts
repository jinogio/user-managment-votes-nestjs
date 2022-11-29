import { User } from 'src/database/interfaces/user.interface';

import { promisify } from 'util';
import { generateOTP } from 'src/common/helpers/OTP.generator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EncryptPassword } from 'src/common/utils/encrypt.password';
import { generateUUIDV4 } from 'src/common/helpers/generate.uuid';
import { RequestPasswordResetDataDto } from './user.dto.ts/request.password.reset.dto';
import { IUserDataDto } from './user.dto.ts/user.data.dto';
import { IUserUpdateDataDto } from './user.dto.ts/user.update.dto';
import { IUserChangePasswordDataDto } from './user.dto.ts/change.password.data.dto';
import { RecoveryPasswordDataDto } from './user.dto.ts/recovery.password.data.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

import {
  UserAlreadyExistError,
  UserNotFoundError,
  UserIsAlreadyPausedError,
  UserIsDeletedError,
  UserIsAlreadyRestoredError,
  UserPermissionError,
  DontDeleteOtherUserError,
  NotFoundUsersListError,
  UserPasswordIncorrectError,
} from 'src/common/errors/user.custome.errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
    private readonly encryptPassword: EncryptPassword,
  ) {}

  async createUser(userData: IUserDataDto): Promise<Partial<User>> {
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });

    if (existingUser) {
      throw new UserAlreadyExistError();
    }

    const hashedUserPassword = await this.encryptPassword.encrypt(
      userData.password,
    );

    const user = new this.userModel({
      ...userData,
      password: hashedUserPassword,
      userID: generateUUIDV4(),
    });

    await user.save();
    const { password, _id, __v, ...registeredUserData } = user.toObject();

    return registeredUserData;
  }

  async updateUser(
    userID: string,
    userUpdateData: IUserUpdateDataDto,
  ): Promise<Partial<User>> {
    const userData = await this.userModel
      .findOne({
        userID: userID,
      })
      .select(['-password', '-__v']);

    if (!userData) {
      throw new UserNotFoundError();
    }
    if (userData.get('isDeleted')) {
      throw new UserIsDeletedError();
    }
    if (!userData.isActive) {
      throw new UserIsAlreadyPausedError();
    }
    Object.assign(userData, userUpdateData);
    return await userData.save();
  }

  async getUser(userID: string): Promise<Partial<User>> {
    const existingUser = await this.userModel
      .findOne({ userID: userID })
      .select(['-password', '-__v']);

    if (!existingUser) {
      throw new UserNotFoundError();
    }
    if (existingUser.get('isDeleted')) {
      throw new UserIsDeletedError();
    }
    if (!existingUser.isActive) {
      throw new UserIsAlreadyPausedError();
    }

    return existingUser;
  }

  async getUserList(): Promise<Partial<User>[]> {
    const allUsers = await this.userModel.find().select(['-password', '-__v']);
    if (!allUsers) {
      throw new NotFoundUsersListError();
    }
    return allUsers;
  }

  async listUserPagination(
    page: number,
    size: number,
  ): Promise<Partial<User>[]> {
    const usersList = await this.userModel
      .find()
      .sort({ _id: 'asc' })
      .skip((page - 1) * size)
      .limit(size)
      .select(['-password', '-__v']);

    if (usersList.length <= 0) {
      throw new NotFoundUsersListError();
    }

    return usersList;
  }

  async changePassword(
    reqUserID: string,
    changePasswordData: IUserChangePasswordDataDto,
  ): Promise<Partial<User>> {
    const userData = await this.userModel.findOne({ userID: reqUserID });

    if (!userData) {
      throw new UserNotFoundError();
    }
    const [salt] = userData.password.split('.');
    const hashedOldPassword = await this.encryptPassword.encrypt(
      changePasswordData.oldPassword,
      salt,
    );
    const hashedNewPassword = await this.encryptPassword.encrypt(
      changePasswordData.newPassword,
    );
    if (userData.password !== hashedOldPassword) {
      throw new UserPasswordIncorrectError();
    }
    userData.password = hashedNewPassword;

    await userData.save();
    const { password, _id, __v, ...registeredUserData } = userData.toObject();

    return registeredUserData;
  }

  async requestPasswordReset(reqUserResetData: RequestPasswordResetDataDto) {
    const userData = await this.userModel.findOne({
      email: reqUserResetData.email,
    });
    if (!userData) {
      throw new UserNotFoundError();
    }

    const code = await generateOTP(10);

    userData.passwordRecoveryCode = code;

    return await userData.save();
  }

  async recoveryPassword(
    passwordRecoveryCode: string,
    recoveryPasswordData: RecoveryPasswordDataDto,
  ): Promise<Partial<User>> {
    const userData = await this.userModel.findOne({
      passwordRecoveryCode: passwordRecoveryCode,
    });

    if (!userData) {
      throw new UserNotFoundError();
    }
    const hashedRecoveryPassword = await this.encryptPassword.encrypt(
      recoveryPasswordData.recoveryNewPassword,
    );
    userData.password = hashedRecoveryPassword;
    userData.passwordRecoveryCode = null;
    await userData.save();
    const { password, _id, __v, ...registeredUserData } = userData.toObject();

    return registeredUserData;
  }

  async deleteUser(userID: string): Promise<{ deleted: number }> {
    const userData = await this.userModel.findOne({
      userID: userID,
    });
    if (!userData) {
      throw new UserNotFoundError();
    }
    if (!userData.get('isActive')) {
      throw new UserIsAlreadyPausedError();
    }
    if (userData.get('isDeleted')) {
      throw new UserIsDeletedError();
    }

    const deletedUserData = await this.userModel.softDelete({
      userID: userData.userID,
    });
    return deletedUserData;
  }

  async restoreUser(userID: string): Promise<{ restored: number }> {
    const userData = await this.userModel.findOne({
      userID: userID,
    });
    if (!userData) {
      throw new UserNotFoundError();
    }
    if (!userData.get('isDeleted')) {
      throw new UserIsAlreadyRestoredError();
    }

    const restoreUserData = await this.userModel.restore({
      userID: userData.userID,
    });
    return restoreUserData;
  }

  async stopUser(userID: string): Promise<Partial<User>> {
    const userData = await this.userModel.findOne({
      userID: userID,
    });
    if (!userData) {
      throw new UserNotFoundError();
    }
    if (userData.get('isDeleted')) {
      throw new UserIsDeletedError();
    }
    if (!userData.isActive) {
      throw new UserIsAlreadyPausedError();
    }
    userData.isActive = false;
    return await userData.save();
  }

  async restorePausedUser(userID: string): Promise<Partial<User>> {
    const userData = await this.userModel.findOne({
      userID: userID,
    });
    if (!userData) {
      throw new UserNotFoundError();
    }
    if (userData.get('isDeleted')) {
      throw new UserIsDeletedError();
    }
    if (userData.isActive) {
      throw new UserIsAlreadyRestoredError();
    }
    userData.isActive = true;

    return await userData.save();
  }
}
