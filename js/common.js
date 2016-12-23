$.fn.popUpPop = function(boxId){
	var target = boxId || $(this[0]).data('poptarget');
	if(this.length){
		if(!window.popUpPopObject)window.popUpPopObject={};
		if(!popUpPopObject[target]){
			var top = ($('#'+target).height()-$('#'+target).children('.pop-up-box').height())/2;
			popUpPopObject[target] = top;
			$('#'+target).css('display','none');
			$('#'+target).children('.pop-up-box').css('top',top-40);
			for(var i = 0;i < this.length;i++){
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
		}else{
			$('#'+target).children('.pop-up-box').css('top',top-40);
			for(var i = 0;i < this.length;i++){
				this[i].addEventListener("click",function(){
					$('#'+target).velocity({ opacity: 1 }, { display: "block" });
					$('#'+target).children('.pop-up-box').velocity({ top: popUpPopObject[target], opacity: 1 }, { display: "block" });
				}); 
			}
		}
	}else{
		$('#'+target).css('display','none');
		$('#'+target).children('.pop-up-box').css('top',top-40);
	}
};