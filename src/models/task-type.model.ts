import mongoose, { Schema } from "mongoose";

export interface TaskType {
  name: String;
  code: String;
  icon?: String;
  isActive: Boolean;
  isSubTask: Boolean;
}

export const taskTypeSchema = new Schema<TaskType>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    icon: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isSubTask: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const TaskTypeModel = mongoose.model<TaskType>('TaskType', taskTypeSchema);
export default TaskTypeModel;