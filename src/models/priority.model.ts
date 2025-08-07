import mongoose, { Document, Schema } from "mongoose";

export interface Priority extends Document {
  name: string;
  code: string;
  level: number;
  color: string;
  isActive: boolean;
  isDefault: boolean;
}

const prioritySchema = new Schema<Priority>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  level: { type: Number, required: true },
  color: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

export const PriorityModel = mongoose.model<Priority>("Priority", prioritySchema);
export default PriorityModel;
