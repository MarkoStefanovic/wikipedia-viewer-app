$(function(){

var $element = $('#code-output');
  // search random page
function searchRandomPage(){
  var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts%7Cpageimages&indexpageids=1&generator=random&exsentences=10&exsectionformat=plain&piprop=thumbnail&pithumbsize=300&pilimit=1&grnnamespace=0&grnlimit=1';
  return getData(url,'page');
}
  // search for list
function searchList(){
  var word = $('#word').val();
  var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&indexpageids=1&iwurl=1&generator=search&redirects=1&utf8=1&exsentences=1&exlimit=10&exintro=1&explaintext=1&exsectionformat=plain&gsrnamespace=0&gsrlimit=10&gsrsearch=' + word;
  return getData(url,'list');
}

  // search for a specific page from list and add event listeners to list elements
function searchPage(){
  $('.list-item').on('click', function() {
    var id = this.id;
    var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&indexpageids=1&pageids=' + id + '&origin=*&prop=extracts%7Cpageimages&iwurl=1&redirects=1&utf8=1&exsentences=10&exlimit=1&exintro=1&explaintext=1&exsectionformat=plain&piprop=thumbnail&pithumbsize=300';
    return getData(url,'page');
  });
}

  // get JSON data
  function getData(url,output){
    $.getJSON(url, function(json, textStatus) {
      console.log('MediaWiki API '+output+' is:'+textStatus);
      if(output == 'list'){
        renderList(json);
      }else if(output == 'page'){
        renderPage(json);
      }
    });
  }

  // render List
function renderList(json){

  var list = [];
  $element.html('');
    // output ino array list
  $.each(json.query.pages, function(key, val){
    list.push([val.pageid,val.title,val.extract,val.index]);

  });
  // sort list by val.index
  list.sort(function(a,b){
    return a[3] > b[3] ? 1:-1;
  });
  // output ordered list
  $.each(list,function(key,val){
    $element.append('<li id="'+val[0]+'" class="list-item"><h2>'+val[1]+'</h2><p>'+val[2]+'</p></li>');
  });
  searchPage();
}

  // render page
function renderPage(json){
  var id = json.query.pageids[0];
  var pageId = json.query.pages[id];

  var title = pageId.title;
  var text =pageId.extract;
  var htmlText = text.replace(/[.]\s+/g,'.</p><p>');

  var image = (!pageId.thumbnail)? '<p class="no-img">no thumbnail image</p>' :'<img src="'+pageId.thumbnail.source+'"/>';

  $element.html('<div class="page"><h2>'+title+'</h2>'+image+'<p>'+htmlText+'</p><p><a href="https://en.wikipedia.org/?curid='+id+'" target="_blank" class="link brackets">Go to wikipedia page</a></p></div>');
}

function searchListAnimation(){
  $('#content').addClass('row searchList');
  $('#search-box').addClass('search-tool search-done');
  $('#ring1').addClass('circle hide');
}

$('#clear').on('click', function(){
  $('#word').val('');
  $('#ring1').removeClass('hide');
  $('#search-box').removeClass('search-done');
  $('#content').removeClass('searchList');
  $element.html('');
});

$('#random').on('click', function(){
  searchListAnimation();
  setTimeout(searchRandomPage,800);
});

$('#button').on('click', function(){
  searchListAnimation();
  setTimeout(searchList, 800);
});

$('#word').keydown(function(event){
  if(event.which == 13){
    searchListAnimation();
    setTimeout(searchList, 800);
  }
});

});
