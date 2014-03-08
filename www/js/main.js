
var Archive = (function(){

    var jsonArray = false;
    var max;

    function init(_jsonArray){ 
        jsonArray = _jsonArray;
        max = jsonArray.length; 
        current = 0; 
        populate(current);

        $('#archive-next-button').click(function(){
          if(((current*12)+max%12)<max){
            current++; 
          }
          $('.archive-row').html('');
          populate(current);

        });

        $('#archive-previous-button').click(function(){
          if(current>0){
            current--; 
          }
          $('.archive-row').html('');
          populate(current);
        });

    }   

    function populate(where){
      if(where==0){
          $('#archive-previous-button').addClass('hidden');
      }else{
          $('#archive-previous-button').removeClass('hidden');
      }
      if((where)==Math.floor(max/12)){
          $('#archive-next-button').addClass('hidden');
      }else{
          $('#archive-next-button').removeClass('hidden');
      }

      if(where<0){
        where=0; 
      }

      var firstImage=(max-(12*where)-1);
      var lastImage = firstImage-12; 

      if((firstImage-12)<0){
        lastImage=-1; 
      }

      for (var i=firstImage;i>lastImage;i--){
        $('.archive-row').append('<div class="column small-4 medium-3 large-2 archive-image-wrap"><a class="archive-image" href="javascript:void(0)" data-index="'+i+'"><img class="archive-thumb" src="img/thumbnails/'+jsonArray[i].code+'"></a></div>');
      }


    }
    return {
        init: init
    };

}());

var Content = (function(){

    var jsonArray = false;
    var max;

    var preloadArray = new Array();

    function init(_jsonArray){ 
        jsonArray = _jsonArray;
        max = jsonArray.length; 
        initArrows(jsonArray.length);

        $('#main-image-wrapper').click(function(){
          openLightbox();
        });

        $('.grey-cover').click(function(){
          closeLightbox();
        });

        $('.popup-img').click(function(){
          closeLightbox();
        });


        $(window).hashchange( function(){
          var hash = location.hash.substr(1);
          if(!hash || !$.isNumeric(hash) || hash>jsonArray.length-1 || hash<0 || hash % 1 != 0){
            location.hash='#'+(jsonArray.length-1);
            hash = location.hash.substr(1);
          }

          GetPage(hash);

        })
        $(window).hashchange();
    }

    function openLightbox(){
        var current = $('#main-image-wrapper').data('current');
        $('.grey-cover').removeClass('hidden');
        $('.popup-img').css({'background-image': 'url("../img/gal/'+jsonArray[current].code+'")'}).removeClass('hidden');

    }

    function closeLightbox(){
       $('.grey-cover').addClass('hidden');
       $('.popup-img').addClass('hidden');
    }

    function preload(page){
        for (var i=0;i<10;i++){
          var index = parseInt(page)+(parseInt(i)-5)
          if(index in jsonArray){
            preloadArray[i] = new Image();
            preloadArray[i].src = '../img/gal/'+jsonArray[index].code;
          }
        }
    }

    function initArrows(){
      $('.left').click(function(){
         prevImage();
      });
      $('.right').click(function(){
         nextImage();
      });
    }

    function prevImage(){
        var hash = parseInt(location.hash.substr(1));
        if(!hash<1){
            window.location = "#"+(hash-1); 
        }
    }

    function nextImage(){
       var hash = parseInt(location.hash.substr(1));
        if(!(hash>max-2)){
            window.location = "#"+(hash+1); 
        }
    }


    function GetPage(page){
        var image = new Image();
        image.src = "../img/gal/"+jsonArray[page].code;
        image.onload = function(){
          $('.main-image-wrapper').css({
            "background-image": "url('../img/gal/"+jsonArray[page].code+"')"
          }).data('current', page);
          $('#text-description').text(jsonArray[page].about);
          preload(page);
        }
       
    }
    
    return {
        init: init
    };

}());


var Navigation = (function() {

    function init() {
        Nav();  
    }

    function goHome(){
        $('.main-page-arrows').removeClass('hidden');
        $('.content-container').addClass('loader');
        $('.info').removeClass('hidden');
        setTimeout(function(){
          $('.info').removeClass('fade');
        },50);
        changeCurrent("home");

    }

    function goPage(which){
        $('.main-page-arrows').addClass('hidden');
        $('.content-container').removeClass('loader');
        $('.info').addClass('fade');
        setTimeout(function(){
          $('.info').addClass('hidden');
        },50);
        changeCurrent(which);

    }

    function changeCurrent(newpage){
        $('.current').addClass('fade').addClass('hidden').removeClass('current');
        $('.'+newpage+'-page').addClass('current').removeClass('hidden');
        setTimeout(function(){
            $('.'+newpage+'-page').removeClass('fade');
        },0);
    }

    
    function Nav(){

       $(document).on('click', '.archive-image', function(){
          var index = $(this).data('index');
          window.location.href = "#"+index;
          goHome();
        });

       $(document).on('click', '.nav-link', function(){
            $( ".container" ).animate({
                left: "0"
            }, 500);
            $('.mobile-menu').addClass('hidden').addClass('fade');
            var location = $(this).data('location');
            if(location!='home'){
              goPage(location);
            }else{
              goHome();
            }
           
        });

       $('.mobile-menu-trigger').click(function(){
          if($('.mobile-menu').hasClass('hidden')){
            $( ".container" ).animate({
                left: "-180px"
            }, 500);
            $('.mobile-menu').removeClass('hidden');
                setTimeout(function(){
                  $('.mobile-menu').removeClass('fade');
                },50);
          }else{
             $( ".container" ).animate({
                left: "0"
              }, 500);
              $('.mobile-menu').addClass('hidden').addClass('fade');
          }       
        });
    }
    return {
        init: init
    };

}());

var Main = (function() {
    
    function init() {
        contentLoad();
        Navigation.init();
    }

    function contentLoad(){
      $.ajax({
          url : '../php/start.php',
          type : 'POST',
          dataType : 'json',
          success : function (result) {
             Content.init(result);
             Archive.init(result);
          },
          error : function () {
             console.log("AJAX Error");
          }
      });    
    }

    return {
        init: init 
    };

})();