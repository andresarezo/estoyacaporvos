var mongoose = require("mongoose");

var favoriteBeneficiarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  beneficiaryId:{
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now()
  }
 });

module.exports = mongoose.model("FavoriteBeneficiary", favoriteBeneficiarySchema);
