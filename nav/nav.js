(function($){
	//加载样式
	var loadingCss = {
		css: function(path){
			var path = loadingCss.getParentPath() + path;
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
	}
	loadingCss.css("skin/nav.css");

	//定义jquery对象
	$.fn.kimNav = function(options) {
		return this.each(function() {
			var opts = $.extend({}, $.fn.kimNav.defaults, options);
			init($(this), opts);
			initEvent($(this),opts);
		});
	};
	
	//初始化方法
	function init($this,opts){
		var kimNav = '<div id="kimNavWrap" class="kimNavWrap">';

		kimNav +=   '        <div class="nav-top">'+
					'            <div id="mini">'+
					'				<div class="btn_wrap">'+
					'					<i class="icon-reorder"></i>'+
					'				</div>'+
					'				<div class="search_wrap">'+
					'					<div class="search_input">'+
					'						<input type="text" placeholder="菜单搜索"/>'+
					'  						<i class="icon-search"></i>'+
					'					</div>'+
					'				</div>'+
					'			</div>'+
					'        </div>'+
					'        <ul>'+
					'            <li class="nav-item">'+
					'                <a href="javascript:;"><i class="nav-icon icon-camera-retro icon-2x"></i><span>网站配置</span><i class="icon-angle-right nav-more"></i></a>'+
					'                <ul>'+
					'                    <li><a href="javascript:;"><span title="网站设置">网站设置</span></a></li>'+
					'                    <li><a href="javascript:;"><span>友情链接</span></a></li>'+
					'                    <li><a href="javascript:;"><span>分类管理</span></a></li>'+
					'                    <li><a href="javascript:;"><span>系统日志</span></a></li>'+
					'                </ul>'+
					'            </li>'+
					'            <li class="nav-item">'+
					'                <a href="javascript:;"><i class="nav-icon icon-camera-retro icon-2x"></i><span>文章管理</span><i class="icon-angle-right nav-more"></i></a>'+
					'                <ul>'+
					'                    <li><a href="javascript:;"><span title="站内新闻">站内新闻</span></a></li>'+
					'                    <li><a href="javascript:;"><span>站内公告</span></a></li>'+
					'                    <li><a href="javascript:;"><span>登录日志</span></a></li>'+
					'                </ul>'+
					'            </li>'+
					'            <li class="nav-item">'+
					'                <a href="javascript:;"><i class="nav-icon icon-camera-retro icon-2x"></i><span>订单管理</span><i class="icon-angle-right nav-more"></i></a>'+
					'                <ul>'+
					'                    <li><a href="javascript:;"><span>订单列表</span></a></li>'+
					'                    <li><a href="javascript:;"><span>打个酱油</span></a></li>'+
					'                    <li><a href="javascript:;"><span>也打酱油</span></a></li>'+
					'                </ul>'+
					'            </li>'+
					'        </ul>';

		
		kimNav += "</div>";

		$this.append(kimNav);
		

	}

	//初始化事件
	function initEvent($this,opts){
		//输入框获取和失去焦点
		$this.find(".search_wrap .search_input input").focus(function(){
			$(this).parent().css({"border-color":"#3892ed","box-shadow":"0px 0px 4px #3892ed"});
		});
		$this.find(".search_wrap .search_input input").blur(function(){
			$(this).parent().css({"border-color":"#ccc","box-shadow":"none"});
		});

		//鼠标移入移出
		$this.find('.nav-item').hover(function(){
			if ($this.find('.kimNavWrap').hasClass('nav-mini')) {
				$(this).find("ul").show(300);
			}
		},function(){
			if ($this.find('.kimNavWrap').hasClass('nav-mini')) {
				$(this).find("ul").hide(100);
			}
		});

		//点击搜索按钮
		$this.find(".icon-search").click(function(){
			searchNav($this);
		});
		
		//键盘事件
		document.onkeydown = function(event){
		  var e = event || window.event || arguments.callee.caller.arguments[0];   
		  if(e && e.keyCode == 13){ // enter 键
			 searchNav($this);
		  }
		}; 

		//nav收缩展开
		$this.find('.nav-item>a').on('click',function(){
			if (!$this.find('.kimNavWrap').hasClass('nav-mini')) {
				if ($(this).next().css('display') == "none") {
					//展开未展开
					$this.find('.nav-item').children('ul').slideUp(300);
					$(this).next('ul').slideDown(300);
					$(this).parent('li').addClass('nav-show').siblings('li').removeClass('nav-show');
				}else{
					//收缩已展开
					$(this).next('ul').slideUp(300);
					$this.find('.nav-item.nav-show').removeClass('nav-show');
				}
			}
		});

		//nav-mini切换
		$this.find('.btn_wrap i').on('click',function(){
			if (!$this.find('.kimNavWrap').hasClass('nav-mini')) {
				$this.find(".search_wrap").hide('fast',function(){
					$this.find('.nav-item.nav-show').removeClass('nav-show');
					$this.find('.nav-item').children('ul').removeAttr('style');
					$this.find('.kimNavWrap').addClass('nav-mini');
				})
			}else{
				$this.find('.kimNavWrap').removeClass('nav-mini');
				$this.find(".search_wrap").show('fast');
			}
		});
		
		//点击下拉列表li
		$this.find(".nav-item ul li").click(function(){
			//如果当前父节点没有展开
			if(!$(this).parents("li.nav-item").hasClass("nav-show")){	
				$(this).parents("li.nav-item").addClass("nav-show");
				$(this).parents("li.nav-item").show();
				$(this).parents("li.nav-item").find("ul").slideDown(300);
				$(this).parents("li.nav-item").siblings().removeClass("nav-show");
				$(this).parents("li.nav-item").siblings().find("ul").slideUp(300);
			}
			//如果当前节点的父节点的兄弟元素展开
			if($(this).parents("li.nav-item").siblings().hasClass("nav-show")){	
				$(this).parents("li.nav-item").siblings().removeClass("nav-show");
				$(this).parents("li.nav-item").siblings().find("ul").slideUp(300);
			}
			//当前节点的样式
			$(this).addClass("on").siblings().removeClass("on");
			$(this).parents("li.nav-item").find("a:first-child").addClass("on");
			$(this).parents("li.nav-item").siblings().find("a:first-child").removeClass("on");
			$(this).parents("li.nav-item").siblings().find("ul li").removeClass("on");

			//收缩时点击二级节点
			if($(this).parents("#kimNavWrap").hasClass("nav-mini")){
				//$(this).parents("li.nav-item").find("ul").hide(300);
			}else{
				
			}
			
			
			
		});
		
	}
	
	// 搜索方法
	function searchNav(obj) {
		var inputVal = $.trim(obj.find(".search_input input").val());
		if(inputVal){
			//字符串方法indexOf
			var list = ['网站设置','站内新闻'];
			var len = list.length;
			var arr = [];
			for(var i=0;i<len;i++){
				//如果字符串中不包含目标字符会返回-1
				if(list[i].indexOf(inputVal)>=0){
					arr.push(list[i]);
				}
			}
			//点击展开
			if(obj.find('.nav-item span[title="'+arr[0]+'"]')){
				obj.find('.nav-item span[title="'+arr[0]+'"]').parent().parent().trigger("click");
			}
		}
	}
	
	//默认参数
	$.fn.kimNav.defaults = {
		leftWidth: "",//左边菜单栏的宽度
		datas: [],//菜单数据
		attributes: [],//菜单有关属性
		parentIcons: [],//父图标和父节点对应
		
	};

	//阻止事件冒泡
	function stopPropagation(e) {
		// 如果提供了事件对象，则这是一个非IE浏览器
		if (e && e.stopPropagation){
			// 因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		}else{
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	};

	//阻止浏览器的默认行为 
	function stopDefault(e) { 
		//阻止默认浏览器动作(W3C) 
		if ( e && e.preventDefault ){ 
			e.preventDefault(); 
		//IE中阻止函数器默认动作的方式 
		}else{
			window.event.returnValue = false; 
		}
		return false; 
	}

	// 判断空
	function isEmpty(val) {
		val = $.trim(val);
		if (val == null )
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

	//判断非空
	function isNotEmpty(val) {
		return !isEmpty(val);
	}

})(jQuery);