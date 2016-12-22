$.fn.popUpPop = function(){
	for(var i = 0;i < this.length;i++){
		var target = $(this[i]).data('poptarget');
		var top = $('#'+target).children('.pop-up-box').css('top');
		$('#'+target).children('.pop-up-box').css('top',parseInt(top)-100);
		this[i].addEventListener("click",function(){
			$('#'+target).velocity({ opacity: 1 }, { display: "block" });
			$('#'+target).children('.pop-up-box').velocity({ top: top, opacity: 1 }, { display: "block" });
		}); 
	}
	document.getElementById(target).addEventListener("touchend",function(){
		$('#'+target).velocity('reverse', { display: "none" });
		$('#'+target).children('.pop-up-box').velocity('reverse', { display: "none" });
	});
	document.getElementById(target).addEventListener("touchmove",function(e){
		e.preventDefault();//防止滚动
	});
	document.getElementById(target).children[0].addEventListener("touchend",function(e){
		e.stopPropagation();//防止冒泡
	});
};