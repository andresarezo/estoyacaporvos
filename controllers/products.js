const Products = require("../models/product");
const moment = require("moment");
const mongoose = require("mongoose");
var Product = mongoose.model("product");
const FavoriteProducts = require("../models/FavoriteProduct");
var FavoriteProduct = mongoose.model("FavoriteProduct");

exports.insertProduct = function(req, res, next) {
  new Product({
    image1: req.body.product.images[0] ? req.body.product.images[0].base64 : "",
    image2: req.body.product.images[1] ? req.body.product.images[1].base64 : "",
    image3: req.body.product.images[2] ? req.body.product.images[2].base64 : "",
    image4: req.body.product.images[3] ? req.body.product.images[3].base64 : "",
    image5: req.body.product.images[4] ? req.body.product.images[4].base64 : "",
    title: req.body.product.title,
    state: req.body.product.state, 
    currency: req.body.product.currency,
    price: req.body.product.price,
    description: req.body.product.description,
    categoryTitle: req.body.product.categoryTitle,
    categoryId: req.body.product.categoryId,
    subCategoryTitle: req.body.product.subCategoryTitle,
    subCategoryId: req.body.product.subCategoryId,
    userId:req.body.product.userId
  }).save(function(err, product, count) {
    //res.send(product);
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ product: product });
    }
  });
};

exports.findProducts = function(req, res, next) {
  var perPage = 5
  , page = Math.max(0, req.query.page)
  Product.find()
  .limit(perPage)
  .skip(perPage * page) 
  .sort({
      date: 'desc'
  })
  .where('status').equals('active')
  .exec(function(err, products) {
    Product.count().exec(function(err, count) {
          res.json({
            products: products,
              page: page,
              pages: count / perPage
          })
      })
  })
};

exports.findProductsSlider = function(req, res, next) {
  var perPage = 5
  , page = Math.max(0, req.query.page)
  Product.find()
  .limit(perPage)
  .sort({
      date: 'desc'
  })
  .where('status').equals('active')
  .select({'image1':1,'title':1,'description':1})
  .exec(function(err, products) {
    Product.count().exec(function(err, count) {
          res.json({
            products: products,
              page: page
          })
      }) 
  })
};


exports.saveFavoriteProduct = function(req, res, next) {
  new FavoriteProduct({
    userId: req.body.userId,
    productId: req.body.productId
  }).save(function(err, FavoriteProduct, count) {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ id: FavoriteProduct.id });
    }
  });
};

// exports.likeBeneficiary = function(req, res, next) {
//   Beneficiary.findById(req.body.beneficiaryId, function(err, beneficiary) {
//     const likes = beneficiary.likes + 1;
//     Beneficiary.findOneAndUpdate(
//       {
//         _id: req.body.beneficiaryId
//       },
//       {
//         $set: {
//           likes: likes
//         }
//       },
//       {
//         new: true
//       },
//       function(err, doc) {
//         if (err) {
//           return res.json({
//             error: err.code ? err.code : err.message
//           });
//         } else {
//           res.json({ likes: doc.likes });
//         }
//       }
//     );
//   });
// };

exports.getFavoriteProducts = function(req, res, next) {
  var queryCond = {};
  queryCond.userId = req.query.userId;
  FavoriteProduct.find(queryCond).exec(function(err, products) {
    if (err) return res.status(500).send(err);
    res.json({
      products: products
    });
  });
};

exports.getFavoriteProductsId = function(req, res, next) {
  var queryCond = {};
  queryCond.userId = req.query.userId;
  queryCond.productId = req.query.productId;
  FavoriteProduct.find(queryCond).exec(function(err, products) {
    if (err) return res.status(500).send(err);
    res.json({
      products: products
    });
  });
};

exports.deleteFavoriteProduct = function(req, res, next) {
  FavoriteProduct.remove(
    { userId: req.body.userId, productId: req.body.productId },
    function(err) {
      if (err) return res.status(500).send(err);
      const response = {
        message: "OK"
      };
      return res.status(200).send(response);
    }
  );
};
