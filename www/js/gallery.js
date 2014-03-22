$(document).on('click', '.gallery-pod', function(){
	show($(this));
});

$(document).on('click', '.gallery-grey', function(){
	hide();
});

$(document).on('click', '.gallery-popup-img', function(){
	hide();
});

function show(that){
	$('.gallery-grey').removeClass('hidden');
	$('body').addClass('body-limit');
	$('.gallery-popup-img').css({'background-image': 'url(..'+that.data('img')+')'}).removeClass('hidden');

}

function hide(){
	$('.gallery-grey').addClass('hidden');
	$('body').removeClass('body-limit');
	$('.gallery-popup-img').addClass('hidden');
}