import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  color?: string;
  owner: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    default: '#808080' 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  collaborators: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  isDefault: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);