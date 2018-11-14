var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
  },
  authType: {
    type: String,
  },
  auth_id: {
    type: String
  },
  name:{
    type: String
  },
  picture:{
    type: String
  },
  last_date_access:{
      type:Date
  },
  registrationDate:{
      type:Date,
      default: Date.now()
  }
});

module.exports = mongoose.model('user', userSchema);