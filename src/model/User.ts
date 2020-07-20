import mongoose, { Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model<IUser>('jwtAuthUser', userSchema)
