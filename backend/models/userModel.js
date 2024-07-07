import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    google_id: {
      type: String,
    },
    address: {
      type: String,
    },
    phonenumber: {
      type: String,
    },
    cart: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'products',
      },
    ],
    favorite: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'products',
      },
    ],
    ordered: [
      {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'orders',
      },
    ],
  },
  { timestamps: true }
);

userSchema.statics.checkValid = async function (username, email, password) {
  if (!username || !email || !password) {
    throw new AppError('Missing some user information', 400, false);
  }
};

const User = mongoose.model('users', userSchema);

export default User;
