import * as mongoose from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Role } from 'src/common/enums/role.enum';

export const UserSchema = new mongoose.Schema(
  {
    userID: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    idCard: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    role: { type: String, default: Role.Basic, enum: [Role.Basic, Role.Admin] },
    passwordRecoveryCode: { type: String, default: null },
  },
  { timestamps: true, validateBeforeSave: false },
);

UserSchema.plugin(softDeletePlugin);
