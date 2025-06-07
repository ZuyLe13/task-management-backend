import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
  id: number;
  fullName: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: ROLE;
  createdAt: Date,
  updatedAt: Date
}

export enum ROLE {
  ADMIN = 'admin',
  OWNER = 'owner',
  MEMBER = 'member'
}

const userSchema = new Schema<User>(
  {
  id: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  role: { type: String, enum: ROLE, default: ROLE.MEMBER }
  }, { timestamps: true }
);

export const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;