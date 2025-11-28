import bcryptjs from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  resetOtp?: string | null;
  resetOtpExpiry?: Date | null;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  googleId?: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition with timestamps enabled
const userSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: function (this: IUser): boolean {
        return !this.googleId;
      },
      minlength: [6, 'Password must be at least 6 characters'],
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpiry: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcryptjs.compare(candidatePassword, this.password);
};

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

// Default export
export default User;