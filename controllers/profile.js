const Profiles = require("../models/profile");
const moment = require("moment");
const mongoose = require("mongoose");
var Profile = mongoose.model("profile");

exports.updateProfile = function(req, res, next) {
  Profile.findOneAndUpdate(
    { 
        userId: req.body.profile.userId 
    },
    {
      $set: {
        address: req.body.profile.address,
        phone: req.body.profile.phone,
        language: req.body.profile.language,
        pushNotifications: req.body.profile.pushNotifications
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
        res.json({ profile: doc });
      }
    }
  );
};

exports.findProfile = function(req, res, next) {
  Profile.find({ userId: req.query.userId }, function(err, profiles) {
    if (err) {
      return res.json({
        error: err.code ? err.code : err.message
      });
    } else {
      res.json({ profile: profiles[0] });
    }
  });
};
