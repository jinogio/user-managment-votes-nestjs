import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

import {
  UserAlreadyExistError,
  NotFoundUsersListError,
  UserNotFoundError,
  UserIsDeletedError,
  UserIsAlreadyPausedError,
  UserIsAlreadyRestoredError,
  UserPermissionError,
  DontDeleteOtherUserError,
  UserPasswordIncorrectError,
  EmeailOrPasswordIncorrectError,
  CanUserVoteThisTimeError,
  YouAlreadyVoteError,
  DontVoteYourselfError,
  UserHasNotVotesError,
  UuidIncorectError,
  NumberIsIncorectError,
} from '../errors/user.custome.errors';

export function userErrorHandler(error) {
  if (error instanceof UserAlreadyExistError) {
    throw new HttpException(error.message, HttpStatus.CONFLICT);
  } else if (error instanceof NotFoundUsersListError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof UserNotFoundError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof UserIsDeletedError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof UserIsAlreadyPausedError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof UserIsAlreadyRestoredError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof UserPermissionError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  } else if (error instanceof DontDeleteOtherUserError) {
    throw new HttpException(error.message, HttpStatus.METHOD_NOT_ALLOWED);
  } else if (error instanceof UserPasswordIncorrectError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof EmeailOrPasswordIncorrectError) {
    throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
  } else if (error instanceof CanUserVoteThisTimeError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  } else if (error instanceof YouAlreadyVoteError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  } else if (error instanceof DontVoteYourselfError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  } else if (error instanceof UserHasNotVotesError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof UuidIncorectError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  } else if (error instanceof NumberIsIncorectError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  } else if (error instanceof UnauthorizedException) {
    throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
  } else {
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
