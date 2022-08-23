function menuFunction(){
    var $navMenu = $('.nav-bar');
    if( $navMenu.attr('class') === "nav-bar"){
        $navMenu.addClass("responsive");
    }else  {
        $navMenu.removeClass("responsive");
    }
}


function loadData(){
    var $main = $('.main-contents');
    var $nytElem = $('#nyt-articles');
    var $wikiElem = $('#wiki-links');
    var $headerText = $('.header-text h2');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var StreetStr = $('#str').val();
    var cityStr = $('#city').val();
    var address = StreetStr + ', '+ cityStr;

    $headerText.text('You now have access to check about ' + address);

    // request from google street view image
    var googleStreetURL = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=AIzaSyCNPPAK-O0YrwV1Ll2E0f4G-AYX4VCgHEI';
    $main.append('<img class="bgimg" src="'+googleStreetURL+'" />');

    // API request from New York Times websites
     var newYorkTimesURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + StreetStr + '&sort=newest&api-key=JAwxTDvA7UCzUtToYI55JL5RpQxPUn4B';
     $.getJSON(newYorkTimesURL, function(nytData){
        nytArticles = nytData.response.docs;
        nytArticles.map(function(article){
            $nytElem.append('<li class="article">'+'<a href="'+ article.web_url +'">' + article.headline.main +'</a>'+
            '<p>'+ article.lead_paragraph +'</p>'+
            '</li>')

        })
     }).error(function(){
        $nytElem.append('<h4 style="color:red";">New York Times could not not be loaded</h4>')
     });

     //API request from Wikipedia website

     var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + StreetStr +'&format=json&callback=wikiCallback';

     var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.append('<h4 style="color:red";">failed to load wikipedia resources</h4>')
     }, 8000)
     $.ajax({
        url:wikiURL,
        dataType:'jsonp',
        success: function(response){
            var wikiArticleStr = response[1];
            var  wikiLinks = response[3]
            for(var i = 0; i < wikiArticleStr.length; i++ ){
                $wikiElem.append('<li class="article">'+
                '<a href="'+ wikiLinks[i] +'">' + wikiArticleStr[i] +'</a>'+
                '</li>');

                clearTimeout(wikiRequestTimeout);
            } 
        }
     });

    return false;
};

// loadData();
$('#form-container').submit(loadData);
