import * as mongoose from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

export interface User extends mongoose.Document {
  userID: string;
  firstname: string;
  lastname: string;
  idCard: string;
  email: string;
  password: string;
  isActive: boolean;
  role: Role;
  passwordRecoveryCode: string | null;
}
