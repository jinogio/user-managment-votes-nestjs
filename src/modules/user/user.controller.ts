import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';

import { IUserDataDto } from './user.dto.ts/user.data.dto';
import { UsersService } from './user.service';
import { IUserUpdateDataDto } from './user.dto.ts/user.update.dto';
import { EmailSesService } from '../SES.EMAIL/email.service';
import { JwtAuthGuard } from 'src/authentication/guard/jwt.auth.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RecoveryPasswordDataDto } from './user.dto.ts/recovery.password.data.dto';
import { LocalAuthGuard } from 'src/authentication/guard/local.auth.guard';
import { Routes } from 'src/common/router/routes';
import { userErrorHandler } from 'src/common/handler/user.error.handler';
import { UserPermissionsRolesGuard } from 'src/common/guard/user.permissions.roles.guard';
import { IUserChangePasswordDataDto } from './user.dto.ts/change.password.data.dto';
import { RequestPasswordResetDataDto } from './user.dto.ts/request.password.reset.dto';
import { admindoesNotDeleteItself } from 'src/common/guard/admin.roles.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiProperty,
  ApiParam,
} from '@nestjs/swagger';
import { MESSAGE } from 'src/common/constants/swagger.description';
import { IAuthDataDto } from 'src/authentication/auth-dto/auth.data.dto';

//gigi
@ApiTags('user')
@Controller(Routes.USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiBody({
    description: MESSAGE.INPUT_USER_DATA_DESC,
    type: IUserDataDto,
  })
  @ApiCreatedResponse({
    description: MESSAGE.CREATE_USER_DESC,
  })
  @ApiBadRequestResponse({
    description: MESSAGE.DONT_REGISTER_DESC,
  })
  @Post('create')
  async signUp(@Body() userData: IUserDataDto) {
    try {
      const result = await this.usersService.createUser(userData);
      return result;
    } catch (error) {
      throw new userErrorHandler(error);
    }
  }
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    description: MESSAGE.INPUT_EMAIL_PASSWORD_DESC,
    type: IAuthDataDto,
  })
  @ApiOkResponse({
    description: MESSAGE.RESPONSE_TOKEN_DESC,
  })
  @Post('login')
  async signIn(@Request() req) {
    return req.user;
  }

  @ApiOkResponse({
    description: MESSAGE.UPDATE_USER_DESC,
  })
  @ApiForbiddenResponse({
    description: MESSAGE.USER_DONT_UPDATED_DESC,
  })
  @Put('update/:userID')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, UserPermissionsRolesGuard)
  @ApiBearerAuth()
  async updateUser(
    @Request() req,
    @Param('userID') userID: string,
    @Body() userUpdateData: IUserUpdateDataDto,
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(
        userID,
        userUpdateData,
      );
      return updatedUser;
    } catch (error) {
      userErrorHandler(error);
    }
  }
  @ApiOkResponse({
    description: MESSAGE.GET_ALL_USERS_LIST_DESC,
  })
  @ApiBadRequestResponse({
    description: MESSAGE.USERS_LIST_NOT_FOUND_DESC,
  })
  @UseGuards(JwtAuthGuard)
  @Get('get/usersList')
  async getUserList() {
    try {
      const profile = await this.usersService.getUserList();
      return profile;
    } catch (error) {
      throw new userErrorHandler(error);
    }
  }

  @ApiOkResponse({
    description: MESSAGE.PAGINATION_DESC,
  })
  @ApiBadRequestResponse({
    description: MESSAGE.USERS_LIST_NOT_FOUND_DESC,
  })
  @Get('myListPagination')
  async listUserPagination(
    @Query('page') page: number,
    @Query('size') size: number,
  ) {
    try {
      const usersList = await this.usersService.listUserPagination(page, size);

      return usersList;
    } catch (error) {
      userErrorHandler(error);
    }
  }

  @ApiBody({
    description: MESSAGE.INPUT_USER_UUID_DESC,
    type: String,
  })
  @ApiOkResponse({
    description: MESSAGE.GET_USER_BY_ID_DESC,
  })
  @ApiNotFoundResponse({
    description: MESSAGE.USER_NOT_FOUND_DESC,
  })
  @Get(':userID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUser(@Param('userID') userID: string) {
    try {
      const profile = await this.usersService.getUser(userID);
      return profile;
    } catch (error) {
      userErrorHandler(error);
    }
  }
  @ApiBody({
    description: MESSAGE.INPUT_OLDPASSWORD_AND_NEWPASSWORD_DESC,
    type: IUserChangePasswordDataDto,
  })
  @ApiOkResponse({
    description: MESSAGE.USER_CHANGE_PASSWORD_DESC,
  })
  @ApiNotFoundResponse({
    description: MESSAGE.USER_PASSWORD_IS_NOT_VALID,
  })
  @Put('changePassword')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async changePassword(
    @Request() req,

    @Body() userChangePasswordData: IUserChangePasswordDataDto,
  ) {
    try {
      const updatedUser = await this.usersService.changePassword(
        req.user.userID,
        userChangePasswordData,
      );
      return updatedUser;
    } catch (error) {
      userErrorHandler(error);
    }
  }

  // @ApiBody({
  //   description: MESSAGE.INPUT_EMAIL_PASSWORD_DESC,
  //   type: RequestPasswordResetDataDto,
  // })
  // @ApiOkResponse({
  //   description: MESSAGE.INPUT_USER_EMAIL_DESC,
  // })
  // @ApiNotFoundResponse({
  //   description: MESSAGE.EMAIL_IS_NOT_VALID_DESC,
  // })
  // @Put('resetPassword')
  // async requestPasswordReset(
  //   @Body() reqUserResetData: RequestPasswordResetDataDto,
  // ) {
  //   try {
  //     const updatedUser = await this.usersService.requestPasswordReset(
  //       reqUserResetData,
  //     );
  //     const sendRecoveryCode = await this.emailSesService.sesTest(
  //       adminEmail,
  //       updatedUser.email,
  //       updatedUser.passwordRecoveryCode,
  //     );
  //     console.log(sendRecoveryCode);
  //     // return { updatedUser, sendRecoveryCode };
  //   } catch (error) {
  //     userErrorHandler(error);
  //   }
  // }

  @ApiBody({
    description: MESSAGE.INPUT_EMAIL_PASSWORD_DESC,
    type: RequestPasswordResetDataDto,
  })
  @ApiOkResponse({
    description: MESSAGE.INPUT_USER_EMAIL_DESC,
  })
  @ApiNotFoundResponse({
    description: MESSAGE.EMAIL_IS_NOT_VALID_DESC,
  })
  @Put('resetPassword')
  async requestPasswordReset(
    @Body() reqUserResetData: RequestPasswordResetDataDto,
  ) {
    try {
      const updatedUser = await this.usersService.requestPasswordReset(
        reqUserResetData,
      );

      return await updatedUser;
    } catch (error) {
      userErrorHandler(error);
    }
  }

  @Put('recovery/:passwordRecoveryCode')
  async recoveryPassword(
    @Body() recoveryPasswordData: RecoveryPasswordDataDto,
    @Param('passwordRecoveryCode') passwordRecoveryCode: string,
  ) {
    try {
      const recoveryUser = await this.usersService.recoveryPassword(
        passwordRecoveryCode,
        recoveryPasswordData,
      );
      return recoveryUser;
    } catch (error) {
      userErrorHandler(error);
    }
  }

  //! userma sakutari tavi ar unda cashalos kodia shesacvleli
  // @ApiBody({
  //   description: MESSAGE.INPUT_EMAIL_PASSWORD_DESC,
  //   type: RequestPasswordResetDataDto,
  // })
  @ApiBody({
    description: 'input userID',
    type: String,
  })
  @ApiOkResponse({
    description: MESSAGE.DELETE_USER_DATA_DESC,
  })
  @ApiNotFoundResponse({
    description: MESSAGE.USED_DATA_DONT_FOUND_DESC,
  })
  @UseGuards(JwtAuthGuard, admindoesNotDeleteItself)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @Delete('delete/:userID')
  async deleteUser(@Request() req, @Param('userID') userID: string) {
    try {
      const profile = await this.usersService.deleteUser(userID);
      return profile;
    } catch (error) {
      userErrorHandler(error);
    }
  }

  //! gasarkvevia es nacili
  @ApiBody({
    description: 'input userID',
    type: String,
  })
  @ApiOkResponse({
    description: MESSAGE.RESTORE_USER_DATA_DESC,
  })
  @ApiNotFoundResponse({
    description: MESSAGE.USED_DATA_DONT_FOUND_DESC,
  })
  @UseGuards(JwtAuthGuard, UserPermissionsRolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @Put('restored/:userID')
  async restoreUser(@Param('userID') userID: string) {
    try {
      const profile = await this.usersService.restoreUser(userID);
      return profile;
    } catch (error) {
      userErrorHandler(error);
    }
  }
  @ApiBody({
    description: 'input userID',
    type: String,
  })
  @ApiOkResponse({
    description: MESSAGE.STOP_USER_DATA_DESC,
  })
  @ApiNotFoundResponse({
    description: MESSAGE.USED_DATA_DONT_FOUND_DESC,
  })
  @UseGuards(JwtAuthGuard, UserPermissionsRolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @Put('stop/:userID')
  async stopUser(@Param('userID') userID: string) {
    try {
      const profile = await this.usersService.stopUser(userID);
      return profile;
    } catch (error) {
      userErrorHandler(error);
    }
  }

  @ApiBody({
    description: 'input userID',
    type: String,
  })
  @ApiOkResponse({
    description: MESSAGE.RESTORE_STOPED_USER_DATA_DESC,
  })
  @ApiNotFoundResponse({
    description: MESSAGE.USED_DATA_DONT_FOUND_DESC,
  })
  @UseGuards(JwtAuthGuard, UserPermissionsRolesGuard)
  @Roles(Role.Admin)
  @Put('restorePauseUser/:userID')
  async restorePausedUser(@Param('userID') userID: string) {
    try {
      const profile = await this.usersService.restorePausedUser(userID);
      return profile;
    } catch (error) {
      userErrorHandler(error);
    }
  }
}
