const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const PORT = '9001';
const {getWP, getArticleText} = require('./utils/cheerioScraping');
const Article = require('./models/article');

// set mongoose Promise implementation (because it's deprecated) to the global implementation
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(morgan('common'));

//main html serving page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

// serve articles

app.get('/articles', (req, res) => {
  return Article
    .find()
    .then((articles) => {
      return res.json({articles});
    })
    .catch((err) => {
      console.log('something went wrong looking for the articles');
      return res.status(500).json({message:"Internal server error"});
    })

});


app.post('/article', (req, res) => {
  var url = req.body.url;
  console.log(url, 'URL')
  getArticleText(url, res)

});



function connnectMongoose() {

  const connectionString = 'mongodb://localhost:13000';
  return mongoose.connect(connectionString);
}


connnectMongoose()
  .then(() => {
    console.log('Connected to mongoose on port 13000.')
    app.listen(PORT, () => {
      console.log(`Our server has started on port ${PORT}`)
      getWP();
    });
  })
  .catch((err) => {
    console.log('there was an error connecting to mongoose, or something else went wrong');
  })




