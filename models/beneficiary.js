var mongoose = require("mongoose");

var beneficiarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  contactEmail: {
    type: String
  },
  registrationDate: {
    type: Date,
    default: Date.now()
  },
  description: {
    type: String
  },
  address: {
    type: String
  },
  state: {
    type: String
  },
  contactPhone: {
    type: String
  },
  status:{
    type: String,
    default:"active"
  },
  likes:{
    type: Number,
    default:1
  },
  image1: String,
  image2: String,
  image3: String,
  image4: String,
  image5: String,
});

module.exports = mongoose.model("beneficiary", beneficiarySchema);
