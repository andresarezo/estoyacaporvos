const Users = require("../models/user");
const Profiles = require("../models/profile");
const moment = require("moment");
const mongoose = require("mongoose");
var User = mongoose.model("user");
var Profile = mongoose.model("profile");
var jwt = require("jwt-simple");
var axios = require("axios");
var SECRET = require("../config").SECRET;
var profile = new Profile({
    userId: "",
    address: "",
    phone: "",
    language: "spanish"
  });


function tokenForUser(user) {
  var obj = {
    sub: user._id,
    iat: new Date().getTime()
  };
  return jwt.encode(obj, SECRET);
}

exports.requireAuth = function(req, res, next) {
  var authHeader = req.get("Authorization");
  var jwtToken = jwt.decode(authHeader, SECRET);
  var user_id = jwtToken.sub;
  User.findById(user_id, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("User not found."));
    }
    req.user = user;
    next();
  });
};

exports.auth = function(req, res, next) {
  var token = req.body.user.accessToken;
  var type = req.body.user.authType;
  switch (type) {
    case "Facebook":
      axios
        .get(
          `https://graph.facebook.com/v2.8/me?fields=id,name,email,picture&access_token=${token}`
        )
        .then(function(response) {
          var oauth_id = response.data.id;
          var name = response.data.name;
          var email = response.data.email;
          var picture = response.data.picture.data.url;
          User.find({ auth_id: oauth_id }, function(err, users) {
            user = users[0];
            if (err) {
              return next(err);
            }
            if (!user) {
              var user = new User({
                auth_id: oauth_id,
                email: email,
                name: name,
                authType: type,
                picture: picture,
                password: "",
                last_date_access: Date.now()
              });
              user.save(function(err) {
                if (err) {
                  return res.json({
                    dbErrorCode: err.code ? err.code : err.message
                  });
                }          
                profile.userId = user.id;
                profile.save();
                res.json({
                  token: tokenForUser(user),
                  user: user,
                  profile: profile
                });
            })
            } else {
              const update = { last_date_access: Date.now() };

              Profile.findOne({ userId: user.id }, function(err, res) {
                profile = res;
              });

              User.findByIdAndUpdate(user.id, update, function(
                err,
                userUpdated
              ) {
                if (err) {
                  res.send(err);
                }
                res.json({
                  token: tokenForUser(user),
                  user: userUpdated,
                  profile: profile
                });
              });
            }
          });
        })
        .catch(function(error) {
          return next(error);
        });
      break;
    case "Google":
      User.find({ auth_id: req.body.user.accessToken.id }, function(
        err,
        users
      ) {
        user = users[0];
        if (err) {
          return next(err);
        }
        if (!user) {
          var user = new User({
            auth_id: req.body.user.accessToken.id,
            email: req.body.user.email,
            name: req.body.user.accessToken.name,
            authType: type,
            picture: req.body.user.picture,
            password: "",
            last_date_access: Date.now()
          });
          user.save(function(err) {
            if (err) {
              return res.json({
                dbErrorCode: err.code ? err.code : err.message
              });
            }
            profile.userId = user.id;
            profile.save();
            res.json({
              token: tokenForUser(user),
              user: user,
              profile: profile
            });
          });
        } else {
          const update = { last_date_access: Date.now() };

          Profile.findOne({ userId: user.id }, function(err, res) {
            profile = res;
          });

          User.findByIdAndUpdate(user.id, update, function(err, userUpdated) {
            if (err) {
              res.send(err);
            }
            res.json({
              token: tokenForUser(user),
              user: userUpdated,
              profile: profile
            });
          });
        }
      });
      break;
    case "Local":
      User.find(
        { password: req.body.user.password, email: req.body.user.email },
        function(err, users) {
          user = users[0];
          if (err) {
            return next(err);
          }
          if (!user) {
            var user = new User({
              auth_id: "",
              email: req.body.user.email,
              name: req.body.user.name,
              authType: type,
              picture: "",
              password: req.body.user.password,
              last_date_access: Date.now()
            });
            user.save(function(err) {
              if (err) {
                return res.json({
                  dbErrorCode: err.code ? err.code : err.message
                });
              }
              profile.userId = user.id;
              profile.save();
              user.password = "";
              res.json({
                token: tokenForUser(user),
                user: user,
                profile: profile
              });
            });
          } else {
            const update = { last_date_access: Date.now() };

            Profile.findOne({ userId: user.id }, function(err, res) {
              profile = res;
            });

            userUpdated.password = "";
            User.findByIdAndUpdate(user.id, update, function(err, userUpdated) {
              if (err) {
                res.send(err);
              }
              res.json({
                token: tokenForUser(user),
                user: userUpdated,
                profile: profile
              });
            });
          }
        }
      );
      break;
    case "LoginLocal":
      User.find(
        { password: req.body.user.password, email: req.body.user.email },
        function(err, users) {
          user = users[0];
          if (err) {
            return next(err);
          }
          if (user) {
            Profile.findOne({ userId: user.id }, function(err, res) {
              profile = res;
            });

            const update = { last_date_access: Date.now() };
            User.findByIdAndUpdate(user.id, update, function(err, userUpdated) {
              if (err) {
                res.send(err);
              }
              userUpdated.password = "";
              res.json({
                token: tokenForUser(user),
                user: userUpdated,
                profile: profile
              });
            });
          } else {
            res.json({ result: "userNotFound" });
          }
        }
      );
      break;
    default:
      return next(err);
      break;
  }
};

function createProfile(user) {
  var profile = new Profile({
    userId: user.id,
    address: "",
    phone: "",
    language: "spanish"
  });

 profile.save(function(err) {
    if (!err) {
      return profile;
    }
  });
}
