
const mongoose = require('mongoose');


const articleSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }    

});


var Article = mongoose.model('article', articleSchema);


module.exports = Article;


