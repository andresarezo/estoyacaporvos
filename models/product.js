
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

        var productSchema = new Schema({
            title:  String,
            state: String,
            currency: String,
            price: Number,
            description: String,
            categoryTitle: String,
            categoryId: Number,
            subCategoryTitle: String,
            subCategoryId: Number,
            image1: String,
            image2: String,
            image3: String,
            image4: String,
            image5: String,
            date:{
              type:Date,
              default: Date.now()
            },
            status:{
              type: String,
              default:"active"
            },
            userId:{
              type: String,
              required: true
            }
          });
          
module.exports = mongoose.model('product', productSchema);