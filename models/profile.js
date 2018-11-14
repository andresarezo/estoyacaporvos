var mongoose = require('mongoose');

var profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
  },
  language: {
    type: String
  },  
  registrationDate:{
      type:Date,
      default: Date.now()
  },
  pushNotifications:{
    type:Boolean,
    default: true
}
});

module.exports = mongoose.model('profile', profileSchema);