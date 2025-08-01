import mongoose, { Schema, Types } from "mongoose";

export interface Task {
  taskKey: String;
  title: String;
  description?: String;
  status: String;
  assignee?: String;
  reporter?: String;
  startDate?: Date;
  endDate?: Date;
  label?: String[];
  taskType?: String;
  priority?: String;
  comments: String[];
  createdAt: Date;
  updatedAt: Date;
}

export const taskSchema = new Schema<Task>(
  {
    taskKey: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    assignee: { type: String },
    reporter: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    label: { type: [String], default: [] },
    taskType: { type: String },
    priority: { type: String },
    comments: { type: [String], default: [] }
  }, { timestamps: true }
);

export const TaskModel = mongoose.model<Task>('Task', taskSchema);
export default TaskModel;