var mongoose = require("mongoose");

var favoriteProductSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  productId:{
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now()
  }
 });

module.exports = mongoose.model("FavoriteProduct", favoriteProductSchema);
