import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  starBrightness: number;
  glowIntensity: number;
  connectionLines: boolean;
  nebulaEffects: boolean;
  animationSpeed: number;
}

const userSettingsSchema = new Schema<IUserSettings>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  starBrightness: { type: Number, default: 65, min: 0, max: 100 },
  glowIntensity: { type: Number, default: 42, min: 0, max: 100 },
  connectionLines: { type: Boolean, default: true },
  nebulaEffects: { type: Boolean, default: true },
  animationSpeed: { type: Number, default: 42, min: 0, max: 100 },
});

export const UserSettings = (mongoose.models['UserSettings'] as mongoose.Model<IUserSettings>) || mongoose.model<IUserSettings>('UserSettings', userSettingsSchema);
