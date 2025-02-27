import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { isEmail } from 'validator';
import config from '../../config';
import { USER_ROLES } from './user.constant';
import { TUser, TUserModel } from './user.interface';

const userSchema = new Schema<TUser, TUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email.'],
      validate: {
        validator: (value: string) => isEmail(value),
      },
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password must be 6 characters or more.'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await UserModel.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const UserModel = model<TUser, TUserModel>('User', userSchema);
