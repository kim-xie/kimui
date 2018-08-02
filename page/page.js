(function($){

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
	loadingCss.css("skin/page.css");

	$.tzPageCalculator = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
	};

	$.extend($.tzPageCalculator.prototype, {
		//要显示的分页数
		numPages:function() {
			return Math.ceil(this.maxentries/this.opts.items_per_page);
		},

		//获取间隔符号
		getInterval:function(current_page)  {
			//可见分页数的一半
			var ne_half = Math.floor(this.opts.num_display_entries/2);
			//分页总数
			var np = this.numPages();
			//隐藏的分页数
			var upper_limit = np - this.opts.num_display_entries;
			//开始
			var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0 ) : 0;
			//结束
			var end = current_page > ne_half ? Math.min(current_page + ne_half + (this.opts.num_display_entries % 2), np) : Math.min(this.opts.num_display_entries, np);

			if(np == 1){
				//alert("只有一页,不显示前一页后一页");
				this.opts.prev_show_always = false;
				this.opts.next_show_always = false;
				this.opts.first_show_always = false;
				this.opts.last_show_always = false;
			}else if(np > 1){
				this.opts.prev_show_always = true;
				this.opts.next_show_always = true;
				this.opts.first_show_always = true;
				this.opts.last_show_always = true;
			}
			return {start:start, end:end};
		}
	});


	$.tzPageRenderers = {}

	$.tzPageRenderers.defaultRenderer = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
		this.pc = new $.tzPageCalculator(maxentries, opts);
	}

	$.extend($.tzPageRenderers.defaultRenderer.prototype, {
		//创建分页
		createLink:function(page_id, current_page, appendopts){
			var lnk, np = this.pc.numPages();
			page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np-1); // Normalize page id to sane value
			appendopts = $.extend({text:page_id + 1, classes:""}, appendopts||{});
			if(page_id == current_page){
				lnk = $("<span class='current'>" + appendopts.text + "</span>");
			}else{
				lnk = $("<a>" + appendopts.text + "</a>").attr('href', this.opts.link_to.replace(/__id__/,page_id));
			}
			if(appendopts.classes){lnk.addClass(appendopts.classes);}
			lnk.data('page_id', page_id);
			return lnk;
		},
		// Generate a range of numeric links
		appendRange:function(container, current_page, start, end, opts) {
			for(var i=start; i<end; i++) {
				this.createLink(i, current_page, opts).appendTo(container);
			}
		},
		//生成分页链接
		getLinks:function(current_page, eventHandler,psize) {
			var $page = this;
			var begin,end,interval = this.pc.getInterval(current_page),np = this.pc.numPages(),fragment = $("<div class='tzPage'></div>");

			//最大分页个数
			if(psize){np = Math.ceil(this.maxentries / psize);}

			// Generate "Previous"-Link
			if(this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)){
				fragment.append(this.createLink(current_page-1, current_page, {text:this.opts.prev_text, classes:"prev"}));
			}

			// Generate "first"-Link
			if(this.opts.first_text && this.opts.first_show_always){
				fragment.append(this.createLink(0, current_page, {text:this.opts.first_text, classes:"page_first"}));
			}

			// Generate starting points
			if (interval.start > 0 && this.opts.num_edge_entries > 0){
				end = Math.min(this.opts.num_edge_entries, interval.start);
				this.appendRange(fragment, current_page, 0, end, {classes:'sp'});
				if(this.opts.num_edge_entries < interval.start && this.opts.ellipse_text){
					jQuery("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
			}

			// Generate interval links
			this.appendRange(fragment, current_page, interval.start, interval.end);

			// Generate ending points
			if (interval.end < np && this.opts.num_edge_entries > 0){
				if(np - this.opts.num_edge_entries > interval.end && this.opts.ellipse_text){
					jQuery("<span>"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
				begin = Math.max(np - this.opts.num_edge_entries, interval.end);
				this.appendRange(fragment, current_page, begin, np, {classes:'ep'});
			}

			// Generate "last"-Link
			if(this.opts.last_text && this.opts.last_show_always){
				fragment.append(this.createLink(np-1, current_page, {text:this.opts.last_text, classes:"page_last"}));
			}

			// Generate "Next"-Link
			if(this.opts.next_text && (current_page < np-1 || this.opts.next_show_always)){
				fragment.append(this.createLink(current_page + 1, current_page, {text:this.opts.next_text, classes:"next"}));
			}

			$('a', fragment).click(eventHandler);

			var psize = (current_page + 1);
			var proxySzie = (psize >= this.maxentries) ? this.maxentries : psize;

			//可选每页显示个数
			if(this.opts.select_per_page && this.opts.showSelect){
				var optionDom = "";
				for(var i=0;i<this.opts.select_per_page.length;i++){
					optionDom += "<option value='"+this.opts.select_per_page[i]+"'>"+this.opts.select_per_page[i]+"</option>";
				}
				fragment.append("<select class='tm_psize_go'>"+optionDom+"</select>&nbsp;");
			}

			//if(this.opts.showSelect)fragment.append("<select class='tm_psize_go'><option value='5'>5</option><option value='10'>10</option><option value='12'>12</option><option value='15'>15</option><option value='20'>20</option><option value='30'>30</option><option value='40'>40</option><option value='50'>50</option></select>&nbsp;");

			//显示可跳转分页
			if(this.opts.showGo){
				fragment.append("<a href='javascript:void(0);' style='float:left;'>共<label class='tmui_page_itemcount'>"+this.maxentries+"</label>条</a>&nbsp;<a href='javascript:void(0);' title='前往当前页' class='tm_go'>前往</a><input type='text' title='请输入其他页码' class='tm_number' value='"+proxySzie+"' id='tm_pagego'/>&nbsp;<a href='javascript:void(0);' style='margin:0 0 0 5px;'>页</a>");
			}

			//返回分页Html
			return fragment;
		}
	});

	// Extend jQuery
	$.fn.kimPage = function(maxentries, opts){
		// Initialize options with default values
		opts = jQuery.extend({
			num_display_entries:5,//可见分页数
			current_page:0,//默认显示的当前页
			link_to:"javascript:void(0)",//分页点击链接
			prev_text:"上一页",//上一页的显示
			next_text:"下一页",//下一页的显示
			first_text:"首页",//首页的显示
			last_text:"尾页",//尾页的显示
			ellipse_text:"...",//不显示文字部分的显示
			num_edge_entries:1,//省略号间隔最左和最右的个数
			prev_show_always:true,//显示上一页
			next_show_always:true,//显示下一页
			first_show_always:true,//显示首页
			last_show_always:true,//显示尾页
			renderer:"defaultRenderer",//分页渲榄
			load_first_page:true,//使用回调函数
			showGo : true,//显示可跳转页
			showSelect:true,//显示可选择每页显示个数
			items_per_page:10,//默认每页显示的个数
			select_per_page:[5,10,20,30,50,100],//每页显示的个数
			callback:function(pageNo,psize,obj){return false;}//回调函数
		},opts||{});

		// -----------------------------------
		// Initialize containers
		// -----------------------------------
		var containers = this, renderer, links, current_page;

		current_page = opts.current_page;
		containers.data('current_page', current_page);

		// Create a sane value for maxentries and items_per_page
		maxentries = (!maxentries || maxentries < 0) ? 1:maxentries;
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1:opts.items_per_page;

		if(!$.tzPageRenderers[opts.renderer]){
			throw new ReferenceError("tzPage renderer '" + opts.renderer + "' was not found in jQuery.tzPageRenderers object.");
		}
		renderer = new $.tzPageRenderers[opts.renderer](maxentries, opts);

		// Attach control events to the DOM elements
		var pc = new $.tzPageCalculator(maxentries, opts);
		var np = pc.numPages();

		if(np == 0 || np == 1){
			containers.hide();
		}else{
			containers.show();
		}
		containers.bind('setPage', {numPages:np}, function(evt, page_id) {
			if(page_id >= 0 && page_id < evt.data.numPages) {
				selectPage(page_id);
				return false;
			}
		});
		containers.bind('prevPage', function(evt){
			var current_page = $(this).data('current_page');
			if (current_page > 0) {
				selectPage(current_page - 1);
			}
			return false;
		});
		containers.bind('nextPage', {numPages:np}, function(evt){
			var current_page = $(this).data('current_page');
			if(current_page < evt.data.numPages - 1) {
				selectPage(current_page + 1);
			}
			return false;
		});

		// When all initialisation is done, draw the links
		links = renderer.getLinks(current_page, tzPageClickHandler);
		containers.empty();
		links.appendTo(containers);

		// call callback function
		if(opts.load_first_page) {
			opts.callback(current_page + 1, opts.items_per_page, containers);
		}

		//点击分页按钮事件
		function tzPageClickHandler(evt){
			var links,new_current_page = $(evt.target).data('page_id'),continuePropagation = selectPage(new_current_page);
			//alert("page_id="+new_current_page);
			if (!continuePropagation) {evt.stopPropagation();}
			return continuePropagation;
		}

		//选择跳转页
		function selectPage(new_current_page) {
			// update the link display of a all containers
			containers.data('current_page', new_current_page);
			links = renderer.getLinks(new_current_page, tzPageClickHandler);
			containers.empty();
			links.appendTo(containers);
			/*$(".tm_number").attr("title", " 请输入数字...").on("keydown",function(e){return true;});*/
			// call the callback and propagate the event if it does not return false
			var continuePropagation = opts.callback(new_current_page + 1,opts.items_per_page,containers);
			init();
			return continuePropagation;
		}

		//选择每页显示个数
		function selectPage_psize(new_current_page,psize) {
			// update the link display of a all containers
			containers.data('current_page', new_current_page);
			links = renderer.getLinks(new_current_page, tzPageClickHandler,psize);
			containers.empty();
			links.appendTo(containers);
			//containers.find(".tm_psize_go").find("option[value='"+psize+"']").attr("selected",true);
			 /*$(".tm_number").attr("title", " 请输入数字...").on("keydown",
		    function(e) {
		        return true;
		    });*/
			// call the callback and propagate the event if it does not return false
			var continuePropagation = opts.callback(new_current_page + 1,psize,containers);
			init();
			return continuePropagation;
		}

		init();

		function init(){

			//给输入框添加提示样式
			$(".tm_number").attr("title", "请输入数字...").on("keydown",function(e){return true;});

			//给默认显示的每页显示个数加载选中效果
			containers.find(".tm_psize_go").find("option[value='"+opts.items_per_page+"']").attr("selected",true);

			//点击跳转按钮
			$('.tm_go', containers).on("click",function(e){
				var goPage = $("#tm_pagego").val();
				var current_page = containers.data('current_page');
				var np = pc.numPages();
				if(goPage && !isNaN(goPage)){
					var pno = goPage - 1;
					if(pno == current_page)return;
					if(goPage <= 0){
						$("#tm_pagego").val(1);
						pno = 0;
					}else if(goPage > np){
						$("#tm_pagego").val(np-1);
						pno = np - 1;
					}
					selectPage(pno);
				}else{
					$("#tm_pagego").val("").focus();
				}
				stopBubble(e);
			});
			//点击跳转按钮
			$('#tm_pagego', containers).on("blur",function(e){
				var goPage = $("#tm_pagego").val();
				var current_page = containers.data('current_page');
				var np = pc.numPages();
				if(goPage && !isNaN(goPage)){
					var pno = goPage - 1;
					if(pno == current_page)return;
					if(goPage <= 0){
						$("#tm_pagego").val(1);
						pno = 0;
					}else if(goPage > np){
						$("#tm_pagego").val(np-1);
						pno = np - 1;
					}
					selectPage(pno);
				}else{
					$("#tm_pagego").val("").focus();
				}
				stopBubble(e);
			});
			//选择每页显示个数事件
			$('.tm_psize_go', containers).on("change",function(e){
				var pageSize = $(this).val();
				opts.items_per_page = pageSize;
				selectPage_psize(0,pageSize);
			});

			//点击首页
			$('.page_first', containers).on("click",function(){
				selectPage(0);
			});

			//点击尾页
			$('.page_last', containers).on("click",function(){
				selectPage(pc.numPages()-1);
			});
		}
	} // End of $.fn.tzPage block

	//阻止事件冒泡
	function stopBubble(e) {
		// 如果提供了事件对象，则这是一个非IE浏览器
		e = e || window.event || arguments.callee.caller.arguments[0]; //兼容firefox
		if (e && e.stopPropagation){
			// 因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		}else{
			// 否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
		}
	};

})(jQuery);
