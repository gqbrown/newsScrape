const cheerio = require('cheerio');
const rp = require('request-promise');
const Article = require('./../models/article');

function getArticleText(url, res) {
  return rp(url)
    .then((html) => {
      var article = processArticleText(html);
      return res.json({message: 'Here is the article text', article })
    })
    .catch(error => {console.log(error); });
};


function createArticle(article) {
  return Article 
    .create(article)
    .then((article) => {
      console.log('article created', article)
    })
    .catch((err) => {
      console.log('article creation failed, because reasons', err);
    })
}


function processArticleText(html) {
  var $ = cheerio.load(html);
  var articleText = [];
  $('article.paywall').find('p').each((i, htmlelement) => {
    var paragraph = $(htmlelement).text();
    articleText.push(paragraph);
  });
  return articleText;

  
}


function processHTML(html) {
  var $ = cheerio.load(html);

  $('.headline').each((i, htmlElement) => {
    // console.log(htmlElement);
    // console.log($(htmlElement).parent().find('.blurb').text().trim())
    var summary = $(htmlElement).parent().find('.blurb').text().trim();
    var headline = $(htmlElement).find('a').text();
    var url = $(htmlElement).find('a').attr('href');

    if (summary && headline && url) {
      createArticle({summary, headline, url});
    }
    // console.log(url);
  })



  

}


function getWP() {
  return rp('https://www.washingtonpost.com')
    .then((html) => {
      // console.log(html);
      processHTML(html);

    })
    .catch(err => console.log(err));
};

module.exports = {getWP, getArticleText};