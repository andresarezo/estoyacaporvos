const express = require("express");
var router = express.Router();
// Import index action from product controller
const productsController = require("./controllers/products");
const beneficiaryController = require("./controllers/beneficiary");
const usersController = require("./controllers/users");
const profilesController = require("./controllers/profile");
const commentsController = require("./controllers/comments");
const mongoose = require("mongoose");
const configuration = require("../configuration.js");
var Product = mongoose.model("product");

router.get("/version", function(req, res, next) {
  res.send(configuration.version);
});
//Beneficiary
router.route("/insertBeneficiary").post(beneficiaryController.insertBeneficiary);

router.route("/beneficiaries").get(beneficiaryController.findBeneficiaries);

router.route("/beneficiariesBasicData").get(beneficiaryController.findBeneficiariesBasicData);

router.route("/searchBeneficiaries").get(beneficiaryController.searchBeneficiaries);

router.route("/deleteFavoriteBeneficiary").post(beneficiaryController.deleteFavoriteBeneficiary);

router.route("/saveFavoriteBeneficiary").post(beneficiaryController.saveFavoriteBeneficiary);

router.route("/getFavoriteBeneficiaries").get(beneficiaryController.getFavoriteBeneficiaries);

router.route("/getFavoriteBeneficiariesById").get(beneficiaryController.getFavoriteBeneficiariesById);

router.route("/likeBeneficiary").post(beneficiaryController.likeBeneficiary);
 
//Users
router.route("/auth").post(usersController.auth);

//Products
router.route("/insertProduct").post(productsController.insertProduct);

router.route("/products").get(productsController.findProducts);

router.route("/productsSlider").get(productsController.findProductsSlider);

router.route("/saveFavoriteProduct").post(productsController.saveFavoriteProduct);

router.route("/getFavoriteProducts").get(productsController.getFavoriteProducts);

router.route("/getFavoriteProductById").get(productsController.getFavoriteProductsId);

router.route("/deleteFavoriteProduct").get(productsController.deleteFavoriteProduct);
// router.get("/products", function(req, res) {
//   Product.find({}, function(err, products) {
//     res.json({ products: products });
//   });
// });

//Profile
router.route("/getProfile").get(profilesController.findProfile);

router.route("/updateProfile").post(profilesController.updateProfile);

//Comments
router.route("/findGeneralComments").get(commentsController.findGeneralComments);

router.route("/createComment").post(commentsController.createComment);

module.exports = router;
