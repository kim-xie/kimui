/********************tab***************************/
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
	loadingCss.css("skin/tab.css");

	$.fn.kimTab = function(options){
		var opts = $.extend({},$.fn.kimTab.methods,$.fn.kimTab.defaults,options);
		this.each(function(){
			var optss = $.extend({},opts);
			opts.init($(this),optss);
		});
	};

	$.fn.kimTab.methods = {
		init : function($tab,opts){
			$tab.addClass("kimui-tabs");
			var headerDiv = $("<div class='kimui-tabs-header'></div>");
			var contentDiv = $("<div class='kimui-tabs-content'></div>");
			var $ul = $("<ul class='kimui-tabs-nav'></ul>");
			var liHtml = "";
			var contentHtml = "";
			var jdata = opts.tabDatas;
			var length = jdata.length;
			var className = "kimui-tabs-default";
			if(opts.index == 0 || opts.index > length){
				opts.index = 0;//边界判断
			}
			for(var i=0;i<length;i++){
				var classStyle = "display:none";
				if(opts.index == i){
					className = "kimui-tabs-active kimui-state-active";
					classStyle = "";
				}
				liHtml += "<li tab='tab-"+i+"' data-url='"+jdata[i].url+"' class='"+ className +"'><a href='javascript:void(0)'>"+jdata[i].title+"</a></li>";
				contentHtml += "<div id='tab-"+i+"' class='kimui-tabs-panel' style='"+classStyle+"'>"+jdata[i].content+"</div>";
				className = "";
			}

			//面板标题
			$ul.html(liHtml);
			headerDiv.append($ul);
			$tab.append(headerDiv);

			//面板内容
			contentDiv.append(contentHtml);
			$tab.append(contentDiv);
			
			//样式
			if(opts.width)$tab.width(opts.width);
			if(opts.height)$tab.height(opts.height);
			if(opts.activeBackground){
				$tab.find(".kimui-tabs-active.kimui-state-active").css("background",opts.activeBackground);
			}
			if(opts.activeColor){
				$tab.find(".kimui-tabs-active.kimui-state-active a").css("color",opts.activeColor);
			}
			if(opts.center){
				$tab.css({"position":"absolute","z-index":"1993"});
				kimUtil.position($tab);
				kimUtil.resize($tab);
			}
			$tab.find(".kimui-tabs-content").height($tab.height() - 44).css({"background":opts.contentBackground});
			$tab.find(".kimui-tabs-nav > li:first").css({"border-left":"none"});
			if(opts.showShade){
				$tab.parents("body").prepend("<div id='tabOverlay'></div>");
				$("#tabOverlay").height($(window).height());
				kimUtil.position($("#tabOverlay"));
				kimUtil.resize($("#tabOverlay"));
				$tab.css({"position":"absolute","z-index":"1993"});
			}
			if(opts.titleBackground){
				$tab.find(".kimui-tabs-header").css("background",opts.titleBackground);
			}
			if(opts.border){
				$tab.css("border",opts.border);
			}
			
			//点击阴影层触发弹窗关闭
			if(opts.shadeClose){
				$("#tabOverlay").click(function(){
					$tab.remove();
					$(this).remove();
				});
			}
			
			//关闭弹窗
			if(opts.closeBtn){
				$tab.find(".kimui-tabs-header").append("<i class='fa fa-times tabClose' aria-hidden='true'></i>");
				$tab.find(".kimui-tabs-header .tabClose").click(function(){
					$tab.remove();
					$("#tabOverlay").remove();
				});
			}
			
			//最大化最小化
			if(opts.maxmin){
				$tab.find(".kimui-tabs-header").append("<i class='fa fa-expand tabMax' aria-hidden='true'></i>");
				$tab.find(".kimui-tabs-header .tabMax").click(function(){
					if($tab.height() < $(window).height()){
						$tab.height($(window).height());
						$tab.width($(window).width());
						kimUtil.position($tab);
						kimUtil.resize($tab);
						$tab.css({"margin":"3px 0 0 2px"});
						$tab.find(".kimui-tabs-content").height($tab.height() - 44).css({"background":opts.contentBackground});
					}else{
						$tab.height(opts.height);
						$tab.width(opts.width);
						kimUtil.position($tab);
						kimUtil.resize($tab);
						$tab.find(".kimui-tabs-content").height($tab.height() - 44).css({"background":opts.contentBackground});
					}
				});
			}
			
			$tab.find(".kimui-tabs-nav > li").hover(function(){
				if(!$(this).hasClass("kimui-tabs-active kimui-state-active")){
					$(this).find("a").css("color",opts.activeColor);
				}
			},function(){
				if(!$(this).hasClass("kimui-tabs-active kimui-state-active")){
					$(this).find("a").css("color","");
				}
			});
			
			//切换标题
			$tab.find(".kimui-tabs-nav > li").on(opts.event,function(){
				$tab.find(".kimui-tabs-active.kimui-state-active").css("background","");
				$tab.find(".kimui-tabs-active.kimui-state-active a").removeAttr("style");

				$(this).addClass("kimui-tabs-active kimui-state-active").siblings().removeClass("kimui-tabs-active kimui-state-active");
				
				if(opts.activeBackground){
					$tab.find(".kimui-tabs-active.kimui-state-active").css("background",opts.activeBackground);
				}
				if(opts.activeColor){
					$tab.find(".kimui-tabs-active.kimui-state-active a").css("color",opts.activeColor);
				}
				
				$tab.find(".kimui-tabs-nav > li").hover(function(){
					if(!$(this).hasClass("kimui-tabs-active kimui-state-active")){
						$(this).find("a").css("color",opts.activeColor);
					}
				},function(){
					if(!$(this).hasClass("kimui-tabs-active kimui-state-active")){
						$(this).find("a").css("color","");
					}
				});
				
				$tab.find(".kimui-tabs-panel").hide();
				
				//获取标题对应的内容
				var tab = $(this).attr("tab");
				var $content = $tab.find("#"+tab);
				$tab.find(".kimui-tabs-content").height($tab.height() - 44);
				var url = $(this).data("url");
				if(url){
					$content.empty();
					$content.append("<iframe src='"+url+"' allowtransparency='true' style='background-color:transparent' frameborder='0' width='100%' height='100%'></iframe>");
					$content.show();
				}
				//返回当前点击的对象及对应的内容
				if(opts.callback)opts.callback($(this),$content);
				
			});

			//是否触发默认打开的标签事件
			if(isNotEmpty(opts.index) && opts.triggerEvent){
				$tab.find(".kimui-tabs-nav > li:eq("+opts.index+")").trigger(opts.event);
			}
		}
	};

	$.fn.kimTab.defaults = {
		width:500,//选项卡的宽度
		height:300,//选项卡的高度
		event:"click",//选项卡的事件类型
		titleBackground:"#4684b2",//标题背景色
		activeBackground:"#f8f8f8",//选中的标题背景颜色
		activeColor:"red",//选中的标题颜色
		contentBackground:"#fff",//内容背景色
		center:true,//弹窗是否以屏幕居中
		border:"2px solid #4684b2",//边框
		showShade:true,//是否显示阴影曾
		shadeClose:true,//是否可以点击阴影层触发关闭
		maxmin:true,//是否可以最大最小化
		closeBtn:true,//是否显示关闭按钮
		index:0,//默认打开第几个tab
		triggerEvent:true,//默认打开是否触发事件
		callback:function($current,$content){
			
		},
		tabDatas:[
			{title:"选项卡1",content:"内容111",url:"http://www.baidu.com"},
			{title:"选项卡2",content:"内容222",url:"http://www.163.com"},
			{title:"选项卡3",content:"内容333",url:"http://www.weibo.com"}
		]
	};

	//定位工具
	var kimUtil = {
		position : function($dom,amark){//居中定位
			var windowWidth = $(window).width();
			var windowHeight= $(window).height();
			var width = $dom.width();
			var height = $dom.height();
			var left = (windowWidth - width)/2;
			var top = (windowHeight - height)/2;
			if(!amark)$dom.css("top",top).animate({left:left});
			if(amark==0)$dom.animate({left:left,"top":top});
			if(amark==1)$dom.css("left",left).animate({"top":top});
			if(amark==2)$dom.css({left:left,"top":top});
			return this;
		},

		positionParent : function($dom,$parent,atop){//相对父元素居中定位
			var parentWidth = $parent.width();
			var parentHeight= $parent.height();
			var width = $dom.width();
			var height = $dom.height();
			var left = (parentWidth - width)/2;
			var top = (parentHeight - height)/2;
			$dom.css({left:left,top:top-(atop||0)});
			return this;
		},

		resize : function($dom){//窗体响应式
			var $this = this;
			$(window).resize(function(){
				$this.position($dom);	
			});
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
})(jQuery);