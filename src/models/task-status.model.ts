import mongoose, { Document, Schema } from "mongoose";

export interface TaskStatus extends Document {
  name: string;
  code: string;
  color: string;
  active: boolean;
  default: boolean;
}

const taskStatusSchema = new Schema<TaskStatus>({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  color: { type: String, required: true, unique: true },
  active: { type: Boolean, required: true },
  default: { type: Boolean, required: true },
});

export const TaskStatusModel = mongoose.model<TaskStatus>("TaskStatus", taskStatusSchema);
export default TaskStatusModel;