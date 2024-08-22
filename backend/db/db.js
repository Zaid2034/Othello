const mongoose = require ('mongoose');
const dotenv = require ('dotenv');
dotenv.config ();

const uri = process.env.MONGO_URL;

mongoose
  .connect (process.env.MONGO_URL)
  .then (res => {
    console.log ('Db connect');
  })
  .catch (err => {
    console.log ('Error', err);
  });

const userSchema = mongoose.Schema ({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    maxLength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});
const User = mongoose.model ('User', userSchema);
module.exports = {
  User,
};
