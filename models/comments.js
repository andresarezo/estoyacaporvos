var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({ 
  parentId:{
    type: Number
  },
  comment: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  asociatedId: {
    type: String
  },
  registrationDate: {
    type: Date,
    default: Date.now()
  }, 
  status:{
    type: String,
    default:"active"
  } ,
  user: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});


module.exports = mongoose.model("comment", commentSchema);
