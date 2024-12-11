import mongoose, { Schema, Document } from 'mongoose';

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4
}

export interface ITask extends Document {
  title: string;
  description?: string;
  project: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId;
  priority: TaskPriority;
  dueDate?: Date;
  labels: mongoose.Types.ObjectId[];
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  assignee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  priority: { 
    type: Number, 
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM 
  },
  dueDate: Date,
  labels: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Label' 
  }],
  status: { 
    type: String, 
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO' 
  },
  isRecurring: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);