import { HttpException, HttpStatus } from '@nestjs/common';

import { User_Error_Message } from '../constants/user.error.messages';
export class UserAlreadyExistError extends Error {
  constructor() {
    super(User_Error_Message.USER_EXSIST_ERROR);
  }
}

export class NotFoundUsersListError extends Error {
  constructor() {
    super(User_Error_Message.NOT_FOUND_USERS_LIST_ERROR);
  }
}

export class UserPasswordIncorrectError extends Error {
  constructor() {
    super(User_Error_Message.USER_PASSWORD_INCORRECT_ERROR);
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super(User_Error_Message.USER_NOT_FOUND_ERROR);
  }
}

export class UserIsDeletedError extends Error {
  constructor() {
    super(User_Error_Message.USER_ALREADY_DELETED_ERROR);
  }
}

export class UserIsAlreadyPausedError extends Error {
  constructor() {
    super(User_Error_Message.USER_PAUSED_ERROR);
  }
}

export class UserIsAlreadyRestoredError extends Error {
  constructor() {
    super(User_Error_Message.USER_ALREADY_RESTORED_ERROR);
  }
}

export class UserPermissionError extends Error {
  constructor() {
    super(User_Error_Message.USER_ALREADY_RESTORED_ERROR);
  }
}

export class DontDeleteOtherUserError extends Error {
  constructor() {
    super(User_Error_Message.DONT_DELETE_OTHER_USER_ERROR);
  }
}

export class EmeailOrPasswordIncorrectError extends Error {
  constructor() {
    super(User_Error_Message.EMAIL_OR_PASSWORD_INVALID_ERROR);
  }
}

export class CanUserVoteThisTimeError extends Error {
  constructor() {
    super(User_Error_Message.CAN_USER_VOTE_ERROR);
  }
}

export class YouAlreadyVoteError extends Error {
  constructor() {
    super(User_Error_Message.YOU_ALREADY_VOTE);
  }
}

export class DontVoteYourselfError extends Error {
  constructor() {
    super(User_Error_Message.DONT_VOTE_YOURSELF);
  }
}

export class UserHasNotVotesError extends Error {
  constructor() {
    super(User_Error_Message.USER_HAS_NOT_VOTES);
  }
}

export class UuidIncorectError extends Error {
  constructor() {
    super(User_Error_Message.UUID_VALIDATION_ERROR);
  }
}

export class NumberIsIncorectError extends Error {
  constructor() {
    super(User_Error_Message.NUMBER_IS_INCORRECT);
  }
}
