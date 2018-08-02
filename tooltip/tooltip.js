(function($){
	//����jQuery����
	$.fn.tmTip = function(options){
		return this.each(function(){
			var opts = $.extend({},$.fn.tmTip.defaults,options);//,$.fn.tmTip.parseOptions($(this))
			//��ʼ������
			if(opts.event == 'hover'){
				$(this).hover(function(){
					tipInit($(this),opts);
				},function(){
					$('.tm-tips').remove();
				});
			}else if(opts.event == 'click'){
				$(this).click(function(){
					tipInit($(this),opts);
				});
			}
			
			//$(this).blur(function(){
			//	$('.tm-tips').remove();
			//}).mouseleave(function(){
			//	$('.tm-tips').remove();
			//});
		});
	};
	
	//��ʼ������
	function tipInit($this,opts){
		$('.tm-tips').remove();
		
		$("body").append('<div class="tm-tips"><div class="tm-window-tip tooltip-nightlys animated bounceInLeft"><div id="tm-tip-contents"></div></div><div class="tooltip-nightlys-arrow animated bounceInRight"></div><div>');
		
		$(".tooltip-nightlys-arrow").addClass("tooltip-nightlys-"+opts.arrow+"-black");
		$('#tm-tip-contents').css("textAlign",opts.contentAlign).html(opts.tip);
		if(opts.width!=0){$(".tm-window-tip").css({width:opts.width});}/*���ø߶����߶�����Ϊ0����Ϊ�Զ��߶�*/
		if(opts.height!=0){$(".tm-window-tip").css({height:opts.height});}/*���ø߶����߶�����Ϊ0����Ϊ�Զ��߶�*/
		
		var _selfWidth = $(".tm-window-tip").width();//tip��Ŀ��
		var _selfHeight = $(".tm-window-tip").height();//tip��ĸ߶�
		var height = $this.height();/*Ԫ������߶�*/
		var width = $this.width();/*Ԫ��������*/
		var offsetLeft = $this.offset().left;/*Ԫ�ص������߾�*/
		var offsetTop = $this.offset().top;/*Ԫ�ص���Զ�������*/
		var bodyWidth = $("body").innerWidth();
		var bodyHeight = $("body").innerHeight();
		var fixWidth = offsetLeft + _selfWidth + width;//Ԫ�ص������߾�+tip��Ŀ��+Ԫ��������
		var fixHeight = offsetTop + _selfHeight + height;
		var left = 0;
		var top = 0;
		var arrowLeft = 0;
		var arrowTop = 0;
		
		//Ԫ�������ߵľ���=0����С��tip��Ŀ��
		if(offsetLeft == 0 || offsetLeft < _selfWidth){
			if(opts.arrow=='rightTop')opts.arrow = "leftTop";
			if(opts.arrow=='rightMiddle')opts.arrow = "leftMiddle";
			if(opts.arrow=='rightBottom')opts.arrow = "leftBottom";
			if(opts.arrow=='topRight')opts.arrow = "topLeft";
			if(opts.arrow=='topMiddle')opts.arrow = "topLeft";
			if(opts.arrow=='bottomMiddle')opts.arrow = "bottomLeft";
			if(opts.arrow=='bottomRight')opts.arrow = "bottomLeft";
		}
		
		//Ԫ����Զ����ľ���=0����С��tip��ĸ߶�
		if(offsetTop == 0 || offsetTop < _selfHeight){
			//opts.arrow = "topMiddle";
		}
		
		//Ԫ�ص������߾�+tip��Ŀ��+Ԫ�������ȳ�����������Ŀ��
		if(fixWidth > bodyWidth ){
			if(opts.arrow == 'topLeft')opts.arrow = "topRight";
			if(opts.arrow == 'topMiddle')opts.arrow = "topRight";
			if(opts.arrow == 'bottomMiddle')opts.arrow = "bottomRight";
			if(opts.arrow == 'bottomLeft')opts.arrow = "bottomRight";
			if(opts.arrow == 'leftTop')opts.arrow = "rightTop";
			if(opts.arrow == 'leftMiddle')opts.arrow = "rightMiddle";
			if(opts.arrow == 'leftBottom')opts.arrow = "rightBottom";
		}
		
		//�߶ȳ�����������ĸ߶�
		if(fixHeight > bodyHeight){
		//	opts.arrow = "bottomMiddle";
		}	
		
		
		if(opts.arrow == 'topMiddle'){
			left = offsetLeft + width/2 - _selfWidth/2;
			top = offsetTop + height + 12;
			arrowLeft = offsetLeft + width/2 -5 ;
			arrowTop = offsetTop + height ;
		}else if(opts.arrow == 'topLeft'){
			left = offsetLeft + width/2;
			top = offsetTop + height +16;
			arrowLeft = offsetLeft + (width/2) +7;
			arrowTop = offsetTop  +height +4;
		}else if(opts.arrow == 'topRight'){
			left = offsetLeft - _selfWidth+width/2;
			top = offsetTop + height+16;
			arrowLeft = offsetLeft + width/2 -16;
			arrowTop = offsetTop + height +4 ;
		}else if(opts.arrow == 'bottomLeft'){
			top = offsetTop - _selfHeight -20 ;
			left = offsetLeft + width/2;
			arrowLeft = offsetLeft + width/2 +12 ;
			arrowTop = offsetTop -16;
		}else if(opts.arrow == 'bottomMiddle'){
			top = offsetTop - _selfHeight - 18;
			left = offsetLeft - _selfWidth/2 + width/2 ;
			arrowLeft = offsetLeft + width/2 -4 ;
			arrowTop = offsetTop -12;
		}else if(opts.arrow == 'bottomRight'){
			top = offsetTop - _selfHeight -20;
			left = offsetLeft - _selfWidth+width/2;
			arrowLeft = offsetLeft + width/2 -18;
			arrowTop = offsetTop -16;
		}else if(opts.arrow == 'leftTop'){
			left = offsetLeft + width +14;
			top = offsetTop;
			arrowLeft = offsetLeft + width +2;
			arrowTop = offsetTop +12;
		}else if(opts.arrow == 'leftMiddle'){
			left = offsetLeft + width +12;
			top = offsetTop - _selfHeight/2 +2;
			arrowLeft = offsetLeft + width -2;
			arrowTop = offsetTop;
		}else if(opts.arrow == 'leftBottom'){
			left = offsetLeft + width +12;
			top = offsetTop - _selfHeight +12;
			arrowLeft = offsetLeft + width;
			arrowTop = offsetTop -1;
		}else if(opts.arrow == 'rightTop'){
			left = offsetLeft - _selfWidth -16;
			top = offsetTop;
			arrowLeft = offsetLeft -14;
			arrowTop = offsetTop + 12;
		}else if(opts.arrow == 'rightMiddle'){
			left = offsetLeft -_selfWidth -16;
			top = offsetTop - _selfHeight/2 + 4;
			arrowLeft = offsetLeft -12;
			arrowTop = offsetTop;
		}else if(opts.arrow == 'rightBottom'){
			left = offsetLeft -_selfWidth -16;
			top = offsetTop - _selfHeight;
			arrowLeft = offsetLeft - 14;
			arrowTop = offsetTop - 16;
		}

		if(isEmpty(opts.arrow))opts.arrow = "bottomMiddle";
		if(opts.hideArrow){
			$(".tooltip-nightlys-arrow").removeClass("tooltip-nightlys-"+opts.arrow+"-black");
		}
		var st = 2;
		$(".tooltip-nightlys-arrow").css({left:(arrowLeft + opts.offLeft),top:(arrowTop + opts.offTop)});
		$(".tm-window-tip").css({left:left+"px",top:(top+st),opacity:1,border:opts.border,background:opts.background,color:opts.fontColor});
		
		$('.tm-tips').click(function(){$(this).remove();});
	};

	//$.fn.tmTip.parseOptions = function($target) {
	//	return {
	//		width : $target.data("width"),
	//		height : $target.data("height"),
	//		tip : $target.attr("tip"),
	//		title:$target.attr("title"),
	//		event:$target.data("event"),
	//		arrow:$target.data("arrow"),
	//		offLeft:$target.data("offLeft"),
	//		offTop:$target.data("offTop"),
	//		background:$target.data("background"),
	//		border:$target.data("border"),
	//		color:$target.data("color"),
	//		proxy:$target.data("proxy")
	//	};
	//};

	$.fn.tmTip.defaults ={
		width : 0,//���
		height : 0,//�߶����Ϊ0��Ϊ�Զ��߶�
		event:"click",//�������¼�����
		arrow:"leftMiddle",
		hideArrow:false,//�Ƿ����ط����ͷ
		background:"#fefe89",//���ñ���
		border:"2px solid red",
		tip: "��ʾ����",//����
		contentAlign:"center",
		offLeft:0,//��ƫ��
		offTop:0,//�����ƶ�
		color:"#333",
	};

})(jQuery);

/**
 * �жϷǿ�
 * @param val
 * @returns {Boolean}
 */
function isEmpty(val) {
	val = $.trim(val);
	if (val == null)
		return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
}