import { Types } from "mongoose";


export enum TASK_STATUS {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  SELF_TEST = 'self_test',
  DONE = 'done'
}

export interface Task {
  title: String;
  desc?: String;
  status: TASK_STATUS;
  project: Types.ObjectId;
  assignee?: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}