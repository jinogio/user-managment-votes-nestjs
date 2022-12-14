export enum User_Error_Message {
  COMPANY_ALREADY_DELETED_ERROR = 'This company has already been deleted',
  NOT_FOUND_DELETED_COMPANYS = 'Not found deleted companys',
  NOT_FOUND_PAUSED_COMPANYS = 'Not found paused companys',
  USER_EXSIST_ERROR = 'this user already exist',
  NOT_FOUND_USERS_LIST_ERROR = 'not found users list',
  USER_NOT_FOUND_ERROR = 'This user Not found',
  USER_ALREADY_DELETED_ERROR = 'This user has already been deleted',
  USER_PAUSED_ERROR = 'This user is already paused',
  USER_ALREADY_RESTORED_ERROR = 'This user has already been restored',
  USER_PERMISSION_DELETED_ERROR = 'This user not has permission to delete enather user',
  DONT_DELETE_OTHER_USER_ERROR = 'This user does not have the authority to delete another user',
  USER_PASSWORD_INCORRECT_ERROR = 'this password is incorrect',
  EMAIL_OR_PASSWORD_INVALID_ERROR = 'Mail or password is invalid',
  CAN_USER_VOTE_ERROR = 'You can vote once per hour',
  YOU_ALREADY_VOTE = 'You have already voted this user',
  DONT_VOTE_YOURSELF = 'You have no right to like yourself',
  USER_HAS_NOT_VOTES = 'this user has not voted yet',
  UUID_VALIDATION_ERROR = 'The UUID is invalid, please enter the correct ID',
  NUMBER_IS_INCORRECT = 'this vote number is incorrect please enter the correct number',
}
