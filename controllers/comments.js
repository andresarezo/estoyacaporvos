const Users = require("../models/user");
const Comment = require("../models/comments");
const User = require("../models/user");
const moment = require("moment");
const mongoose = require("mongoose");
var Profile = mongoose.model("profile");
var jwt = require("jwt-simple");
var axios = require("axios");
var SECRET = require("../config").SECRET;

  exports.createComment =  function(req, res, next)  {
    var comment = new Comment({
      user: req.body.userId,
      comment: req.body.comment,
      asociatedId: req.body.asociatedId,
      type: req.body.type,
      parentId: req.body.parentId
    });
  
   comment.save(function(err) {
      if (!err) {
        //return comment;
        var queryCond = {};   
        queryCond.asociatedId = req.body.asociatedId;
        Comment.find(queryCond).limit(100)
        .sort({
            registrationDate: 'desc'
        }).populate( { path: 'user', select: 'email name picture' }).exec(function(err, comments) {
          if (err) return res.status(500).send(err);
          res.json({
            comments: comments
          });
        });
      }
    });
  }

  exports.deleteComment = function(user, comment) {  
    comment.remove(
        { userId: req.body.userId, commentId: req.body.commentId },
        function(err) {
          if (err) return res.status(500).send(err);
          const response = {
            message: "OK"
          };
          return res.status(200).send(response);
        }
      );
  }

  exports.findGeneralComments = function(req, res, next) {
    var queryCond = {};   
    queryCond.asociatedId = req.query.asociatedId;
    Comment.find(queryCond).limit(100)
    .sort({
        date: 'desc'
    }).populate( { path: 'user', select: 'email name picture' }).exec(function(err, comments) {
      if (err) return res.status(500).send(err);
      res.json({
        comments: comments
      });
    });
  };
