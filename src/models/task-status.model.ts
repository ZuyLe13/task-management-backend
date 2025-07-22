import mongoose, { Document, Schema } from "mongoose";

export interface TaskStatus extends Document {
  name: string;
  code: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
}

const taskStatusSchema = new Schema<TaskStatus>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  color: { type: String, required: true },
  isActive: { type: Boolean },
  isDefault: { type: Boolean },
});

export const TaskStatusModel = mongoose.model<TaskStatus>("TaskStatus", taskStatusSchema);
export default TaskStatusModel;