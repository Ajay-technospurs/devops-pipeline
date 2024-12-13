import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for TypeScript
export interface GitHubProjectType extends Document {
  owner: string;
  name: string;
  url: string;
  token?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  isShared?:boolean;
  children?:GitHubProjectType[]
}

// Define the schema
const RepositorySchema = new Schema<GitHubProjectType>({
  owner: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  url: { type: String, required: true, unique: true },
  token: { type: String },
  isPrivate: { type: Boolean, default: false },
  isShared: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Use `mongoose.models` to avoid OverwriteModelError
export const Projects =
  mongoose.models.Projects || mongoose.model<GitHubProjectType>('Projects', RepositorySchema,"projects");
