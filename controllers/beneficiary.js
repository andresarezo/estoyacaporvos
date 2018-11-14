const Beneficiaries = require("../models/beneficiary");
const moment = require("moment");
const mongoose = require("mongoose");
var Beneficiary = mongoose.model("beneficiary");
const FavoriteBeneficiaries = require("../models/FavoriteBeneficiary");
var FavoriteBeneficiary = mongoose.model("FavoriteBeneficiary");

exports.insertBeneficiary = function(req, res, next) {
  new Beneficiary({
    image1: req.body.beneficiary.images[0]
      ? req.body.beneficiary.images[0].base64
      : "",
    image2: req.body.beneficiary.images[1]
      ? req.body.beneficiary.images[1].base64
      : "",
    image3: req.body.beneficiary.images[2]
      ? req.body.beneficiary.images[2].base64
      : "",
    image4: req.body.beneficiary.images[3]
      ? req.body.beneficiary.images[3].base64
      : "",
    image5: req.body.beneficiary.images[4]
      ? req.body.beneficiary.images[4].base64
      : "",
    userId: req.body.beneficiary.userId,
    state: req.body.beneficiary.state,
    title: req.body.beneficiary.title,
    contactEmail: req.body.beneficiary.contactEmail,
    description: req.body.beneficiary.description,
    address: req.body.beneficiary.address,
    contactPhone: req.body.beneficiary.contactPhone
  }).save(function(err, beneficiary, count) {
    //res.send(beneficiary);
    if (err) {
      if (err) return res.status(500).send(err);
    } else {
      res.json({ beneficiaryId: beneficiary.id });
    }
  });
};

exports.findBeneficiaries = function(req, res, next) {
  var perPage = 5,
    page = Math.max(0, req.query.page);
  Beneficiary.find()
    .limit(perPage)
    .skip(perPage * page)
    .sort({
      registrationDate: "desc"
    })
    //.where('status').equals('active')
    .exec(function(err, beneficiaries) {
      if (err) return res.status(500).send(err);
      Beneficiary.count().exec(function(err, count) {
        if (err) return res.status(500).send(err);
        console.debug(new Date().toISOString());
        res.json({
          beneficiaries: beneficiaries,
          page: page,
          pages: count / perPage
        });
      });
    });
};

exports.findBeneficiariesBasicData = function(req, res, next) {
  var perPage = 5,
    page = Math.max(0, req.query.page);
  Beneficiary.find()
    .limit(perPage)
    .sort({
      registrationDate: "desc"
    })
    //.where('status').equals('active')
    .select({ image1: 1, title: 1, description: 1 })
    .exec(function(err, beneficiaries) {
      Beneficiary.count().exec(function(err, count) {
        if (err) return res.status(500).send(err);
        res.json({
          beneficiaries: beneficiaries,
          page: page
        });
      });
    });
};

exports.searchBeneficiaries = function(req, res, next) {
  var queryCond = {};
  if (req.query.title) {
    queryCond.title = { $regex: req.query.title, $options: "i" };
  }
  // if (req.query.state) {
  //   queryCond.state = req.query.state;
  // }
  if (req.query.description) {
    queryCond.description = { $regex: req.query.description, $options: "i" };
  }
  if (req.query.email) {
    queryCond.email = req.query.contactEmail;
  }
  Beneficiary.find(queryCond).exec(function(err, beneficiaries) {
    if (err) return res.status(500).send(err);
    res.json({
      beneficiaries: beneficiaries
    });
  });
};

exports.saveFavoriteBeneficiary = function(req, res, next) {
  new FavoriteBeneficiary({
    userId: req.body.userId,
    beneficiaryId: req.body.beneficiaryId
  }).save(function(err, FavoriteBeneficiary, count) {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ id: FavoriteBeneficiary.id });
    }
  });
};

exports.likeBeneficiary = function(req, res, next) {
  Beneficiary.findById(req.body.beneficiaryId, function(err, beneficiary) {
    const likes = beneficiary.likes + 1;
    Beneficiary.findOneAndUpdate(
      {
        _id: req.body.beneficiaryId
      },
      {
        $set: {
          likes: likes
        }
      },
      {
        new: true
      },
      function(err, doc) {
        if (err) {
          return res.json({
            error: err.code ? err.code : err.message
          });
        } else {
          res.json({ likes: doc.likes });
        }
      }
    );
  });
};

exports.getFavoriteBeneficiaries = function(req, res, next) {
  var queryCond = {};
  queryCond.userId = req.query.userId;
  FavoriteBeneficiary.find(queryCond).exec(function(err, beneficiaries) {
    if (err) return res.status(500).send(err);
    res.json({
      beneficiaries: beneficiaries
    });
  });
};

exports.getFavoriteBeneficiariesById = function(req, res, next) {
  var queryCond = {};
  queryCond.userId = req.query.userId;
  queryCond.beneficiaryId = req.query.beneficiaryId;
  FavoriteBeneficiary.find(queryCond).exec(function(err, beneficiaries) {
    if (err) return res.status(500).send(err);
    res.json({
      beneficiaries: beneficiaries
    });
  });
};

exports.deleteFavoriteBeneficiary = function(req, res, next) {
  FavoriteBeneficiary.remove(
    { userId: req.body.userId, beneficiaryId: req.body.beneficiaryId },
    function(err) {
      if (err) return res.status(500).send(err);
      const response = {
        message: "OK"
      };
      return res.status(200).send(response);
    }
  );
};
