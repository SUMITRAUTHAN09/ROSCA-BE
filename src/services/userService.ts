import User, { IUser } from '../models/user.js';

// Check if a user exists by email
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

// Create a new user
export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

// Update user's reset OTP and expiry
export const updateResetOtp = async (
  email: string,
  otp: string,
  expiry: Date
): Promise<IUser | null> => {
  return await User.findOneAndUpdate(
    { email },
    { resetOtp: otp, resetOtpExpiry: expiry },
    { new: true }
  );
};

// Verify OTP for user
export const verifyUserOtp = async (
  email: string,
  otp: string
): Promise<IUser | null> => {
  return await User.findOne({ email, resetOtp: otp });
};

// Reset user password and clear OTP fields
export const resetPassword = async (
  email: string,
  hashedPassword: string
): Promise<IUser | null> => {
  return await User.findOneAndUpdate(
    { email },
    { password: hashedPassword, resetOtp: null, resetOtpExpiry: null },
    { new: true }
  );
};
