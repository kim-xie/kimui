(function($){
	
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
	loadingCss.css("skin/form.css");

	//获取框的宽度
	var search_meWidth;
	var search_inWidth;

	//jquery方法
	$.fn.kimSearch = function(options){
		return this.each(function() {
			var opts = $.extend({},$.fn.kimSearch.defaults,options);
			searchInit($(this),opts);
			search_inWidth = $(this).find("#search_in").width();
			searchEvent($(this),opts);
			$(this).find("input").blur();
		});
	};	
		
	//初始化方法
	function searchInit($this,opts){
		var listLi = "";
		var searchBox = "<span id='search_box'>"+
						"	<span class='search_icon'><i class='fa "+opts.searchIcon+" searchIcon fa-2x cicon'></i></span>"+
						"	<span class='search_main'>"+
						"		<span id='search_me' class='search_me none'></span>"+
						"		<input type='text' id='search_in' class='search_in' maxlength="+opts.maxlength+" placeholder="+opts.placeholder+">"+
						"	</span>"+
						"	<i class='fa fa-times-circle inputclear cicon none'></i>"+
						"	<span class='search_button'><i class='fa fa-caret-right rightArrow'></i>"+opts.searchText+"</span>"+
						"</span>";
		
		var searchHtml = searchBox;
		if(isNotEmpty(opts.searchArg) && opts.useCondition){
			var listLen = opts.searchArg.length;
			for(var i=0; i<listLen; i++){
				listLi += "	<li><a href='javascript:void(0)' data-title='"+opts.searchArg[i]+"'>"+opts.searchArg[i]+"</a></li>";
			}
			var searchList = "<ul id='search_list' class='none'>"+listLi+"<li id='noData' style='display:none;text-align:center;line-height:32px;'>"+opts.noDataText+"</li></ul>";
			searchHtml += searchList;
		}

		if(isNotEmpty(opts.listContent) && !opts.useCondition){
			var listLen = opts.listContent.length;
			for(var i=0; i<listLen; i++){
				listLi += "	<li><a href='javascript:void(0)' data-title='"+opts.listContent[i]+"'>"+opts.listContent[i]+"</a></li>";
			}
			var searchList = "<ul id='search_list' class='none'>"+listLi+"<li id='noData' style='display:none;text-align:center;line-height:32px;'>"+opts.noDataText+"</li></ul>";
			searchHtml += searchList;
		}
		
		$this.append(searchHtml);

		$this.find(".search_me").css({fontSize:opts.searchFontSize+"px",color:opts.tipColor});
		$this.find(".search_in").css({fontSize:opts.searchFontSize+"px"});
		$this.find(".search_button").css({color:opts.listhovercl,background:opts.searchFocusCl,fontSize:opts.searchFontSize+"px"});
		
		
		if(opts.width != 0 && (opts.width).indexOf('%') == -1){$this.css({width:opts.width+"px"});}
		if((opts.width).indexOf('%') != -1){$this.css({width:$this.parent().width()});}
		if((opts.height).indexOf('%') != -1){
			$this.css({height:$this.parent().height()});
			$this.find("span").css({lineHeight:$this.parent().height()+"px"});
			$this.find(".searchIcon").css({lineHeight:($this.parent().height()-2)+"px",fontSize:opts.searchIconFS + 6 +"px"}).addClass(opts.searchIcon);
			$this.find(".inputclear").css({top:($this.parent().height() - opts.searchIconFS)/2 + "px",fontSize:opts.searchIconFS});
			$this.find(".rightArrow").css({top:($this.parent().height() - opts.searchIconFS)/2 + "px",fontSize:opts.searchIconFS});
		}
		if(opts.height!=0 && (opts.height).indexOf('%') == -1){
			$this.css({height:opts.height+"px"});
			$this.find("#search_list").css({top:opts.height + (opts.searchBoxborderWidth*2+2),left:-"1px",width:$("#searchBox").width() - opts.searchButtonWidth+ "px"});
			$this.find("span").css({lineHeight:opts.height+"px"});
			$this.find(".searchIcon").css({lineHeight:(opts.height-2)+"px",fontSize:opts.searchIconFS + 6 +"px"}).addClass(opts.searchIcon);
			$this.find(".inputclear").css({top:(opts.height - (opts.searchIconFS+1))/2 + "px",fontSize:opts.searchIconFS});
			$this.find(".rightArrow").css({top:(opts.height - opts.searchIconFS)/2 + "px",fontSize:opts.searchIconFS});
		}
		if(opts.searchButtonWidth){
			$this.find(".search_button").css({width:opts.searchButtonWidth});
		}
		if(opts.iconWidth){
			$this.find(".search_icon").css({width:opts.iconWidth});
		}
		if(opts.searchButtonWidth && opts.iconWidth){
			$this.find(".search_main").css("width", $("#searchBox").width() - opts.iconWidth - opts.searchButtonWidth+ "px");
			$this.find("#search_in").css("width", ($("#searchBox").width() - opts.iconWidth - opts.searchButtonWidth) * 0.94 + "px");
		}
		

		if(opts.searchBoxborder!=0){$this.find("#search_box").css({border:opts.searchBoxborder});}
		
		if(opts.hideArrow){$this.find(".rightArrow").hide();}
		if(opts.listBackground){$this.find("#search_list").css({background:opts.listBackground});}
		if(opts.listcolor){$this.find("#search_list").find("a").css({color:opts.listcolor,fontSize:opts.listFontSize+"px"});}
		if(opts.listborder){$this.find("#search_list").css({border:opts.listborder});}
		
		$this.find("#search_list a").hover(function(){
			$(this).css({background:opts.listhoverbg,color:opts.listhovercl});
		},function(){
			$(this).css({background:opts.listBackground,color:opts.listcolor});
		});
		
	};

	//初始化事件
	function searchEvent($this,opts){
		//选中下拉选择框
		$this.find("#search_list a").mousedown(function(){
			var input = $(this).val().trim();
			var text = $(this).text().trim();
			if(opts.useCondition){
				$(this).parents("#search_box").addClass("focus");
				$("#search_me").text(text+":  ").show();
				search_meWidth = $("#search_me").width();
				$("#search_in").width(search_inWidth - search_meWidth).focus();
			}
			if(opts.showClear){$(this).parents("#search_list").siblings().find(".inputclear").show();}
			if(input.indexOf(opts.placeholder1) !== -1){
				$(this).val("");
			}
		});

		$this.find("#search_list a").mouseup(function(){
			if(opts.useCondition){
				$("#search_in").val("").focus();
				$(this).parents("#search_list").hide();
			}else{
				$("#search_in").val($(this).text()).css({"font-size":"14px"}).removeClass("cplaceholder").addClass("cinput");
			}
			
		});

		//点击重置按钮
		$this.find(".inputclear").click(function(){
			opts.resetCallback();
			opts.onclick($(this),"","");
			$(this).parent().find("#search_me").text("").hide();
			$(this).parent().find("#search_in").val("");
			$("#search_in").width(search_inWidth + search_meWidth);
			$(this).hide();
			$this.find("#search_list").find("li a").show();
			$this.find("#search_list").find("#noData").hide();
			$this.find("input").blur();
		});

		//触发下拉框的伸缩事件
		$this.find("input").click(function(e){
			stopPropagation(e);
			if(opts.useCondition){
				$(this).parents("#searchBox").find("#search_list").toggle();
			}else{
				$(this).parents("#searchBox").find("#search_list").show();
			}
		});
		
		//输入框输入动态加载数据
		$this.find("input").keyup(function(e){
			stopPropagation(e);
			var searchVal = $.trim($(this).val());
			if(opts.listContent && !opts.useCondition){
				queryData($this,searchVal, opts.listContent);
			}
		});

		//输入框获取焦点事件
		$this.find("input").focus(function(){
			if(opts.showClear){
				showClear($(this));
			}
			$(this).parents("#search_box").addClass("focus");
			var input = $(this).val().trim();
			if(input.indexOf(opts.placeholder1)!==-1){
				$(this).val("").removeClass("cplaceholder").addClass("cinput");
			}
		});

		//输入框失去焦点事件
		$this.find("input").blur(function(){
			if(opts.showClear){
				showClear($(this));
			}
			showplaceholder($(this),opts);
			$(this).parents("#search_box").removeClass("focus");
		});

		//搜索操作
		$this.find(".search_button").click(function(){
			var search_in = $(this).parent().find("input").val().trim();
			var search_me = $(this).parent().find(".search_me").text().trim();
			opts.onclick($(this),search_me,search_in);
		});

		//隐藏下拉框
		$("html").click(function(){
			$("#searchBox").find("#search_list").hide();
		});

		//回车键触发搜索
		$this.find("input").keydown(function(e){
			var e = e || window.event;
			if(e.keyCode == 13 && opts.allowEnter){
				$this.find(".search_button").trigger("click");
			}
		});
	};

	//是否显示重置按钮
	function showClear(obj){
		var input = obj.val().trim();
		if(isNotEmpty(input)){
			obj.parents("#search_box").find(".inputclear").show();
		}
	}
	
	//是否显示placeholder
	function showplaceholder(obj,opts){
		var input = obj.val().trim();
		var method = obj.prev().text().trim();
		if(isEmpty(input) && isEmpty(method)){
			obj.val(opts.placeholder1).removeClass("cinput").addClass("cplaceholder");
		}
	}

	//动态加载数据
	function queryData(obj,arg,listData){
		var newArray = listData;
		listData = [];
		if(arg && isNotEmpty(newArray)){
			for(var i=0;i<newArray.length;i++){
				if(newArray[i].indexOf(arg) !== -1){
					listData.push(newArray[i]);
				}else{
					obj.find("#search_list").find("li a").hide();
				}
			}
		}else{
			obj.find("#search_list").find("#noData").hide();
			obj.find("#search_list").find("li a").show();
		}
		if(listData.length === 0 && arg){
			obj.find("#search_list").find("#noData").show();
		}else{
			for(var i=0;i<listData.length;i++){
				obj.find("#search_list").find("#noData").hide();
				obj.find("#search_list").find("li a[data-title='"+listData[i]+"']").show();
			}
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
		// 如果提供了事件对象，则这是一个非IE浏览器
		if (e && e.stopPropagation){
			// 因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		}else{
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	};

	//默认参数
	$.fn.kimSearch.defaults = {
		searchText: "搜 索",//搜索提示
		maxlength: "50",//允许输入的最长个数
		placeholder: "",//提示内容IE8不支持
		placeholder1: "可直接搜索也可选择条件进行搜索",//提示内容所有浏览器都通用
		width: "500",//搜索框的宽度
		height: "32",//搜索框的高度
		iconWidth: "32",//搜索图标的宽度
		searchButtonWidth: "60",//搜索按钮的宽度
		hideArrow: false,//是否显示搜索三角形
		searchFontSize: 14,//搜索字体
		searchIcon: "fa-search",//搜索框的搜索图标
		searchIconFS: 18,//搜索框的搜索图标的大小
		searchBoxborder: "2px solid #20a0ff",//下拉列表对象的边框
		searchBoxborderWidth: 2,//下拉列表对象的边框
		searchFocusCl: "#20a0ff",//搜索框获取焦点的颜色
		showClear: true, //是否显示重置按钮
		useCondition: true, //是否使用条件搜索
		tipColor: "blue", //搜索条件文本颜色
		searchArg: ["按...搜索","按***搜索","按&&&搜索"],//下拉列表的搜索条件
		listContent: ["1111","2222"],//下拉列表的数据
		noDataText: "无匹配数据",//搜索不到匹配数据的提示信息
		listFontSize: 14,//列表字体
		listborder: "2px solid #ccc",//下拉列表对象的边框
		listBackground: "#ccc",//下拉列表对象的背景颜色
		listcolor: "#1f2d3d",//下拉列表对象的颜色
		listhoverbg: "#20a0ff",//下拉列表鼠标移入对象的背景颜色
		listhovercl: "#fff",//下拉列表鼠标移入对象的颜色
		allowEnter: true,//允许使用回车键触发搜索
		onclick: function($obj,medata,indata){//点击搜索事件
		
		},
		resetCallback:function(){//搜索框重置事件回调

		}
	};

})(jQuery);