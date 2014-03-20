
var UploadContent = (function(){

    var jsonArray = false;
    var max;

    function init(_jsonArray){ 
        jsonArray = _jsonArray;
        max = jsonArray.length; 
        current = 0; 
        populate(current);

        $('#next-button').click(function(){
        	if(((current*12)+max%12)<max){
        		current++; 
        	}
        	$('.archive-image-holder').html('');
        	populate(current);

        });

        $('#uploader-link').click(function(){
            $('#uploads').addClass('body-limit');
            $('.uploader').removeClass('hidden');
            $('#grey').removeClass('hidden');
        });


        $('#previous-button').click(function(){
        	if(current>0){
        		current--; 
        	}
        	$('.archive-image-holder').html('');
        	populate(current);

        });

        $('#grey').click(function(){
            $('#uploads').removeClass('body-limit');
            $('#grey').addClass('hidden');
            $('.popup').addClass('hidden');
            $('.uploader').addClass('hidden');
        });

        $(document).on('click', '.save', function(){
            $("html, body").animate({ scrollTop: "0" }, 500);
            var which = $(this).data('index');
            var text = $(this).siblings('textarea').val();
            popup("save", which, text);
        });
        $(document).on('click', '.delete', function(){
            $("html, body").animate({ scrollTop: "0" }, 500);
            var which = $(this).data('index');
            popup("delete", which, "");
        });

        $('#popup-cancel').click(function(){
            $('#uploads').removeClass('body-limit');
            $('#grey').addClass('hidden');
            $('.popup').addClass('hidden');

        });

        $('#popup-confirm').click(function(){
            var action = $('#popup-confirm').data('action');
            var index = $('#popup-confirm').data('index');
            var text = $('#edit-text').val();
            console.log(text);
            $.ajax({
              url : 'php/edit.php',
              type : 'POST',
              data: {
                        'id': jsonArray[index].code,
                        'action': action,
                        'text': text
                    },
              success : function () {
                 location.reload();
              },
              error : function () {
                 console.log("AJAX Error");
              }
            });

            
        });
    }

    function popup(action, which, text){
        if(action=="save"){
            $('.popup-thumb').attr('src', '../img/thumbnails/'+jsonArray[which].code);
            $('.popup').removeClass('hidden');
            $('#grey').removeClass('hidden');
            $('#uploads').addClass('body-limit');
            $('#popup-confirm').data('index', which).data('action', 'edit');
            $('.popup-text').html('').append('<h2>TEXT CHANGE</h2><h3>OLD:</h3><span><i>'+jsonArray[which].about+'</i></span><br><h3>NEW:</h3><textarea id="edit-text">'+text+'</textarea><br><h2></h2>');
        }else if(action=="delete"){
            $('.popup-thumb').attr('src', '../img/thumbnails/'+jsonArray[which].code);
            $('.popup').removeClass('hidden');
            $('#grey').removeClass('hidden');
            $('#uploads').addClass('body-limit');
            $('.popup-confirm').data('index', which).data('action', 'delete');
            $('.popup-text').html('').append('<h2>DELETE THIS PHOTO?</h2>');

        }else{
            console.log('js error in function popup');
        }
    }

    function populate(where){
    	if(where<0){
    		where=0; 
    	}

    	var firstImage=(max-(12*where)-1);
    	var lastImage = firstImage-12; 

    	if((firstImage-12)<0){
    		lastImage=-1; 
    	}

    	for (var i=firstImage;i>lastImage;i--){
    		$('.archive-image-holder').append('<div id="box" class="columns small-6 medium-4 large-2 image-block"><img src="../img/thumbnails/'+jsonArray[i].code+'"><div class="portfolio-block"><input class="portfolio" name="portfolio" type="checkbox"><h3>Portfolio</h3></div><textarea>'+jsonArray[i].about+'</textarea><a class="save" href="javascript:void(0)" data-index="'+i+'"></a><a class="delete" href="javascript:void(0)" data-index="'+i+'"></a></div>');
    	}
    }

    return {
        init: init
    };

}());


var UploadMain = (function() {
    
    function init() {
        uploadContentLoad();

        $('#button-link').click(function(){
		  $('#form-button').click(); 
		  return false;
		});

		$('#submit-link').click(function(){
		  $('#submit').click(); 
		  return false;
		});

    }

    function uploadContentLoad(){
      $.ajax({
          url : '../php/start.php',
          type : 'POST',
          dataType : 'json',
          success : function (result) {
             UploadContent.init(result);
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