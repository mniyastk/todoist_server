import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId,
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: String,
  lastName: String,
  profileImage: String
}, { 
  timestamps: true 
});

export const User = mongoose.model<IUser>('User', UserSchema);