
$('#articles_container').on('click', '.headline', function (event) {

  if ($(this).closest('.article').find('.articleText').text().length != 0) {
    
    var url = $(this).attr('url');
    var id = $(this).closest('.article').attr('id');
    console.log('the id', id);
    getArticleText(url, id)
  }
})



function getArticleText(url, id) {
  console.log(url, 'url inside getArticleText')
  var options = {
    method: "POST",
    url: "/article",
    data: {
      url
    }
  }

  return $.ajax(options)
    .then((data) => {
      console.log(data);
      renderArticleText(data.article, id)
    })
    .catch((err) => {console.log(err)})


}


function renderArticleText (article, id) {
  var container = `.articleText#article${id}`;
  console.log(container);
  $(container).empty();
  // var articleHtml = `
  // <div class="articleText" id="${id}">
  // </div>`;
  // $(`.articleText#${id}`).append(articleHtml);
  
  article.forEach((paragraph) => {
    var paragraphHtml = `<p>${paragraph}</p>`;
    $(container).append(paragraphHtml);


  })
}


function renderArticles(articles) {

  $('#articles_container').empty();

  articles.forEach((article, index) => {
    var articleTemplate = `
      <div class="article" id="${index}">
        <h1 style="pointer:cursor;" class="headline" url="${article.url}">${article.headline}
        </h1>
        <p>${article.summary}</p>
        <div class="articleText" id="article${index}">
        </div>
      </div>`;

      

    $('#articles_container').append(articleTemplate);

    if (index % 2 === 0) {
      $(`.article[id=${index}]`).css('background-color', '#b5e2b7')   
    }



    
  });

}


function getArticles () {
  return $.ajax('/articles')
    .then((data) => {
      console.log('we have the articles');
      console.log(data);
      // TODO write articles to the page
      renderArticles(data.articles);

    })
}



$('#load_articles').click(function(event){
  event.preventDefault();
  getArticles()
})

