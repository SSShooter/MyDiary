$('button').click(function(e) {
	$(this).siblings().removeClass('active');
	$(this).addClass('active');
});