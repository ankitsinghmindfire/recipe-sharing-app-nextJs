const { default: mongoose } = require('mongoose')

const usersModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
})
export const userSchema =
  mongoose.models.users || mongoose.model('users', usersModel)
