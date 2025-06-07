import mongoose, { Document, Schema, Types } from "mongoose";
import { ROLE } from "./user.model";

export interface WorkspaceMember {
  user: Types.ObjectId;
  role: ROLE,
  joinedAt: Date
}

export interface Workspace extends Document {
  title: String;
  desc?: String;
  owner: Types.ObjectId;
  imageUrl?: String;
  members?: WorkspaceMember[];
  createdAt?: Date,
  updatedAt?: Date
}

const WorkspaceMemberSchema = new Schema<WorkspaceMember>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: Object.values(ROLE), default: ROLE.MEMBER },
  joinedAt: { type: Date, default: Date.now }
});

const WorkspaceSchema = new Schema<Workspace>(
  {
  title: { type: String, required: true },
  desc: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String },
  members: { type: [WorkspaceMemberSchema], default: [] },
  },
  { timestamps: true }
)

export const WorkspaceModel = mongoose.model<Workspace>("Workspace", WorkspaceSchema);
export default WorkspaceModel;