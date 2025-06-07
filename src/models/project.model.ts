import { Document, Types } from "mongoose";

export interface Project extends Document {
  name: string;
  desc?: string;
  workspace: Types.ObjectId;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}