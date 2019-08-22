import mongoose from 'mongoose';

const user = {
  id: {
    type: Number,
    required: true,
    trim: true,
  },
  city: {
    id: {
      type: Number,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
  },
};

const userSchema = mongoose.Schema(user, {
  collection: 'umbrello_users',
});

const User = mongoose.model('user', userSchema);

export default User;
