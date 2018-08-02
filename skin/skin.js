;(function($){
	var loadingCss = {
		css: function(path){
			var path = this.getParentPath() + path;
			if(!path || path.length === 0){
				throw new Error('argument "path" is required !');
			}
			var head = document.getElementsByTagName('head')[0];
			var link = document.createElement('link');
			link.href = path;
			link.rel = 'stylesheet';
			link.type = 'text/css';
			head.appendChild(link);
		},
		getParentPath:function(){
			var ParentPath = document.scripts;
			ParentPath = ParentPath[ParentPath.length-1].src.substring(0,ParentPath[ParentPath.length-1].src.lastIndexOf("/")+1);
			return ParentPath;
		}
	};
	loadingCss.css("skin/icomoon/style.css");
	loadingCss.css("skin/skin.css");

	//jquery方法
	$.fn.kimSkin = function(options){
		return this.each(function() {
			var opts = $.extend({},$.fn.kimSkin.defaults,options);
			skinInit($(this),opts);
			skinEvent($(this),opts);
		});
	};
						
	//初始化方法
	function skinInit($this,opts){
		
		var firstLi = "", mainLi = "", lastLi = "";
		if(opts.skinLi && opts.backgroundImg){
			for(var i=0;i<4;i++){
				lastLi += "<li>"+
						  "	 <div class='overlay'><h5>"+opts.skinLi[i].title+"</h5></div>"+
						  "	 <img src='"+opts.skinLi[i].src+"' class='skinLi' data-color='"+opts.skinLi[i].colorClass+"' style='background:"+opts.skinLi[i].background+"'>"+
						  "	 <span class='kimicon-check-circle'></span>"+
						  "</li>";
			}
			for(var i=0;i<opts.skinLi.length;i++){
				mainLi += "<li>"+
						  "	 <div class='overlay'><h5>"+opts.skinLi[i].title+"</h5></div>"+
						  "	 <img src='"+opts.skinLi[i].src+"' class='skinLi' data-color='"+opts.skinLi[i].colorClass+"' style='background:"+opts.skinLi[i].background+"'>"+
						  "	 <span class='kimicon-check-circle'></span>"+
						  "</li>";
			}
			for(var i=opts.skinLi.length-4;i<opts.skinLi.length;i++){
				firstLi += "<li>"+
						  "	 <div class='overlay'><h5>"+opts.skinLi[i].title+"</h5></div>"+
						  "	 <img src='"+opts.skinLi[i].src+"' class='skinLi' data-color='"+opts.skinLi[i].colorClass+"' style='background:"+opts.skinLi[i].background+"'>"+
						  "	 <span class='kimicon-check-circle'></span>"+
						  "</li>";
			}
		}else{
			for(var i=0;i<4;i++){
				lastLi += "<li>"+
						  "	 <div class='overlay'><h5>"+opts.skinLi[i].title+"</h5></div>"+
						  "	 <div class='skinLi' data-color='"+opts.skinLi[i].colorClass+"' style='background:"+opts.skinLi[i].background+"'></div>"+
						  "	 <span class='kimicon-check-circle'></span>"+
						  "</li>";
			}
			for(var i=0;i<opts.skinLi.length;i++){
				mainLi += "<li>"+
						  "	 <div class='overlay'><h5>"+opts.skinLi[i].title+"</h5></div>"+
						  "	 <div class='skinLi' data-color='"+opts.skinLi[i].colorClass+"' style='background:"+opts.skinLi[i].background+"'></div>"+
						  "	 <span class='kimicon-check-circle'></span>"+
						  "</li>";
			}
			for(var i=opts.skinLi.length-4;i<opts.skinLi.length;i++){
				firstLi += "<li>"+
						  "	 <div class='overlay'><h5>"+opts.skinLi[i].title+"</h5></div>"+
						  "	 <div class='skinLi' data-color='"+opts.skinLi[i].colorClass+"' style='background:"+opts.skinLi[i].background+"'></div>"+
						  "	 <span class='kimicon-check-circle'></span>"+
						  "</li>";
			}
		}
		
		var skinList = firstLi + mainLi + lastLi;
		var skinTemp =  "<div id='skinWrap'>"+
					    "	<div class='skinbox'>"+
					    "		<span class='kimicon-chevron-left2 arrow prev'></span>"+
						"		<div class='contains'>"+
						"			<ul class='skinList'>"+skinList+"</ul>"+
						"		</div>"+
						"		<span class='kimicon-chevron-right2 arrow next'></span>"+
						"	</div>"+
						"	<div class='closeBtn' title='收起换肤图层'>"+
						"		<span class='kimicon-x-circle' style='font-size: 32px;'></span>"+
						"	</div> "+
						"</div>";

		$this.append(skinTemp);
		
		//修改展示框位置
		if(opts.skinPosition === "top"){
			$("#skinWrap").css("top",0);
			$("#skinWrap .closeBtn").css("top","2px");
		}else if(opts.skinPosition === "bottom"){
			$("#skinWrap").css("bottom",0);
			$("#skinWrap .closeBtn").css("bottom","200px");
		}

	};

	//初始化事件
	function skinEvent($this,opts){

		//初始化选中
		var classArr = $("body").attr("class").split(" ");
		var bodyColor = "";
		for(var i=0;i<classArr.length;i++){
			if(classArr[i].indexOf(opts.classPrefix)!==-1){
				bodyColor = classArr[i].substring(opts.classPrefix.length);
				alert(bodyColor)
				break;
			}
		}
		
		//标识已选中的背景
		$("#skinWrap ul li").each(function(){
			if($(this).find(".skinLi").attr("data-color") === bodyColor){
				$(this).find("span.kimicon-check-circle").css("display","block");
			}
		});
		
		//展开收起换肤层
		$("#skinWrap .closeBtn").click(function(){
			toggleSkin();
		});

		//选择换肤列表
		$("#skinWrap ul li").click(function(e){
			//获取当前li下的src属性
			var className = $(this).find(".skinLi").attr("data-color");
			//获取到的src绑定到背景图片中去
			var classArr = $("body").attr("class").split(" ");
			for(var i=0;i<classArr.length;i++){
				if(classArr[i].indexOf(opts.classPrefix)!==-1){
					$("body").removeClass(classArr[i]).addClass(opts.classPrefix+className);
					break;
				}
			}
			/*对号等于当前li的下标则显示*/
			$("#skinWrap ul li").find(".skinLi[data-color="+className+"]").next().show();
			$("#skinWrap ul li").find(".skinLi[data-color!="+className+"]").next().hide();
			
			//选择后回调
			if(opts.callback){
				opts.callback.call($this,className);
			}

			//阻止事件冒泡
			e.stopPropagation();
		});
		
		//点击document触发换肤事件
		$("html").click(function(){
			$("#skinWrap").slideUp();
			$("#skinWrap .hf").find("i").addClass("fa fa-chevron-down").removeClass("fa fa-chevron-up");
		});
		
		//li的切换
		var index = 4;
		var nowTime = 0;
		var len = $("#skinWrap .skinList").find("li").length;
		var width = 200;//$("#skinWrap .skinList").find("li").eq(0).width()
		$("#skinWrap .skinList").css("width",width*len+(len-1)*10);
		//点击下一张	
		$("#skinWrap .next").click(function(e){
			e.stopPropagation();
			var time = new Date() - nowTime;//避免狂点的问题
			if(time > 400){
				nowTime = new Date();
				if(index == len-4){
					index = 4;
				}else{
					index++;
				}
			}
			$("#skinWrap .skinList").stop(true,true).animate({"left":-(width+10)*index},300,
			function(){
				if(index == len-4){
					$("#skinWrap .skinList").css("left",-(width+10)*4);
					index = 4;
				}
			});
		}).mousedown(function(){return false;});//狂点出现的问题
		//点击上一张
		$("#skinWrap .prev").click(function(e){
			e.stopPropagation();
			var time = new Date() - nowTime;
			if(time > 400){
				nowTime = new Date();
				if(index == 0){
					index = len-8;
				}else{
					index--;
				}
			}
			$("#skinWrap .skinList").stop(true,true).animate({"left":-(width+10)*index},300,
			function(){
				if(index == 0){
					$("#skinWrap .skinList").css("left",-(width+10)*(len-8));
					index = len-8;
				}
			});
		}).mousedown(function(){return false;});
		
	};

	//默认参数
	$.fn.kimSkin.defaults = {
		skinPosition: 'bottom', //弹出层出现的位置 top/bottom
		backgroundImg: false, //背景是否为图片，如果为false则skinLi中的src不生效
		classPrefix: "skin-", //默认class前缀
		skinLi: [
			{title: '蓝色风格', src: '', colorClass: 'blue', background: '#40beed'},	
			{title: '紫色风格', src: '', colorClass: 'purple', background: '#605ca8'},	
			{title: '白色风格', src: '', colorClass: 'black-light', background: '#ffffff'},	
			{title: '绿色风格', src: '', colorClass: 'green', background: '#00a65a'},	
			{title: '黄色风格', src: '', colorClass: 'yellow-light', background: '#f39c12'},
			{title: '红色风格', src: '', colorClass: 'red-light', background: '#dd4b39'},
		],
		callback: function(className){ //回调函数
			//alert(className)
		}
	};

	//展开收起
	function toggleSkin(){
		if($("#skinWrap").css("display") === "block"){
			$("#skinWrap").slideUp();
			$("#skinWrap .closeBtn").fadeOut(1);
		}else{
			$("#skinWrap").slideDown();
			$("#skinWrap .closeBtn").fadeIn(1000);
		}
	}

	//空判断
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
	//非空判断
	function isNotEmpty(val) {
		return !isEmpty(val);
	}
	//阻止事件冒泡
	function stopPropagation(e) {
		e = e || window.event || arguments.callee.caller.arguments[0]; 
		// 如果提供了事件对象，则这是一个非IE浏览器
		if (e && e.stopPropagation){
			// 因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		}else{
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	};

})(jQuery);
