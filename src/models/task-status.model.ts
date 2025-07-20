import mongoose, { Document, Schema } from "mongoose";

export interface TaskStatus extends Document {
  name: string;
  code: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
}

const taskStatusSchema = new Schema<TaskStatus>({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  color: { type: String, required: true, unique: true },
  isActive: { type: Boolean, required: true },
  isDefault: { type: Boolean, required: true },
});

export const TaskStatusModel = mongoose.model<TaskStatus>("TaskStatus", taskStatusSchema);
export default TaskStatusModel;