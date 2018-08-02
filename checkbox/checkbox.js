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
	loadingCss.css("skin/checkbox.css");

	//jquery方法
	$.fn.kimCheckBox = function(options){
		return this.each(function() {
			var opts = $.extend({},$.fn.kimCheckBox.defaults,options);
			checkboxInit($(this),opts);
			checkboxEvent($(this),opts);
		});
	};

	//初始化方法
	function checkboxInit($this,opts){
		var checkboxTemp = "";
		if(opts.checkboxGroup){
			var checkboxGroup = "<div class='kimui-checkbox-group'>";
			var checkboxTemps = "";
			for(var i=0;i<opts.checkboxAttribute.length;i++){
				checkboxTemps +=   "<label class='kimui-checkbox'>" +
								"	<span class='kimui-checkbox__input'>"+
								"		<span class='checkbox-icon kimicon-square'></span>"+
								"		<input type='checkbox' class='kimui-checkbox__original' name='"+opts.checkboxAttribute[i].inputName+"' value='"+opts.checkboxAttribute[i].value+"'>"+
								"	</span>"+
								"	<span class='kimui-checkbox__label'>"+opts.checkboxAttribute[i].label+"</span>"+
								"</label>";
			}
			checkboxGroup += checkboxTemps + "</div>";
			checkboxTemp = checkboxGroup;
		}else{
		    checkboxTemp = "<label class='kimui-checkbox'>" +
						"	<span class='kimui-checkbox__input'>"+
						"		<span class='checkbox-icon kimicon-square'></span>"+
						"		<input type='checkbox' class='kimui-checkbox__original' name='"+opts.checkboxAttribute[0].inputName+"' value='"+opts.checkboxAttribute[0].value+"'>"+
						"	</span>"+
						"	<span class='kimui-checkbox__label'>"+opts.checkboxAttribute[0].label+"</span>"+
						"</label>";
		}

		$this.append(checkboxTemp);

	};

	//初始化事件
	function checkboxEvent($this,opts){
		for(var i=0;i<opts.checkboxAttribute.length;i++){
			if(opts.checkboxAttribute[i].checked){
				$this.find(".kimui-checkbox__input").eq(i).addClass("is-checked");
			}
			if(opts.checkboxAttribute[i].disabled){
				$this.find(".kimui-checkbox__input").eq(i).addClass("is-disabled");
			}
		}
		checkInit($this);
		checkboxChecked($this);
		
	};

	//默认参数
	$.fn.kimCheckBox.defaults = {
		checkboxGroup: true, //是否显示单选group
		checkboxAttribute: [ //单选属性
			{
				inputName: 'guangzhou', // 表单提交的name属性
				value: 'guangzhou', // 表单的值
				label: '广州', // 显示名
				disabled: false, // 是否禁选
				checked: true // 是否已选择
			},
			{
				inputName: 'shenzhen',
				value: 'shenzhen',
				label: '深圳',
				disabled: false,
				checked: false
			},
			{
				inputName: 'shanghai',
				value: 'shanghai',
				label: '上海',
				disabled: true,
				checked: true
			}
		]
	};

	// 复选框
	function checkboxChecked($this){
		$this.find(".kimui-checkbox").click(function(e){
			e = e || window.event;
			stopDefault(e);
			if(!$(this).find(".kimui-checkbox__input").hasClass("is-disabled")){
				if($(this).find(".checkbox-icon").hasClass("kimicon-check-square")){
					$(this).find(".checkbox-icon").addClass("kimicon-square").removeClass("kimicon-check-square");
					if($(this).parents(".checkboxWrap").find(".kimui-checkbox").hasClass("checkAll") && 
					   ($(this).siblings().find(".checkbox-icon").hasClass("kimicon-check-square") || $(this).siblings().find(".checkbox-icon").hasClass("kimicon-minus-square"))){
					   $(this).parents(".checkboxWrap").find(".checkAll .checkbox-icon").removeClass("kimicon-check-square").removeClass("kimicon-square").addClass("kimicon-minus-square");
					}else {
						 $(this).parents(".checkboxWrap").find(".checkAll .checkbox-icon").removeClass("kimicon-minus-square").removeClass("kimicon-check-square").addClass("kimicon-square");
					}
				}else if($(this).find(".checkbox-icon").hasClass("kimicon-minus-square")){
					$(this).find(".checkbox-icon").addClass("kimicon-check-square").removeClass("kimicon-minus-square");
					if($(this).parents(".checkboxWrap").find(".kimui-checkbox").hasClass("checkAll") && 
					   ($(this).siblings().find(".checkbox-icon").hasClass("kimicon-minus-square") ||    $(this).siblings().find(".checkbox-icon").hasClass("kimicon-square"))){
						$(this).parents(".checkboxWrap").find(".checkAll .checkbox-icon").removeClass("kimicon-check-square").removeClass("kimicon-square").addClass("kimicon-minus-square");
					}else{
						$(this).parents(".checkboxWrap").find(".checkAll .checkbox-icon").removeClass("kimicon-minus-square").removeClass("kimicon-square").addClass("kimicon-check-square");
					}
				}else if($(this).find(".checkbox-icon").hasClass("kimicon-square")){
					$(this).find(".checkbox-icon").addClass("kimicon-check-square").removeClass("kimicon-square");
					if($(this).parents(".checkboxWrap").find(".kimui-checkbox").hasClass("checkAll") && 
					   ($(this).siblings().find(".checkbox-icon").hasClass("kimicon-minus-square") ||    $(this).siblings().find(".checkbox-icon").hasClass("kimicon-square"))){
						$(this).parents(".checkboxWrap").find(".checkAll .checkbox-icon").removeClass("kimicon-check-square").removeClass("kimicon-square").addClass("kimicon-minus-square");
					}else{
						$(this).parents(".checkboxWrap").find(".checkAll .checkbox-icon").removeClass("kimicon-minus-square").removeClass("kimicon-square").addClass("kimicon-check-square");
					}
				}
			}
		});

		
	}
	//选择按钮
	function checkButton(obj){
		stopDefault(window.event)
		$(obj).toggleClass("is-checked");
	}
	// 全选
	function checkedAll(obj){
		if($(obj).hasClass("kimicon-check-square")){
			$(obj).addClass("kimicon-square").removeClass("kimicon-check-square");
			$(obj).parents(".checkboxWrap").find(".kimui-checkbox-group .kimui-checkbox .kimui-checkbox__input .checkbox-icon").removeClass("kimicon-check-square").addClass("kimicon-square");
		}else if($(obj).hasClass("kimicon-minus-square")){
			$(obj).addClass("kimicon-check-square").removeClass("kimicon-minus-square");
			$(obj).parents(".checkboxWrap").find(".kimui-checkbox-group .kimui-checkbox .kimui-checkbox__input .checkbox-icon").removeClass("kimicon-square").removeClass("kimicon-minus-square").addClass("kimicon-check-square");
		}else if($(obj).hasClass("kimicon-square")){
			$(obj).addClass("kimicon-check-square").removeClass("kimicon-square");
			$(obj).parents(".checkboxWrap").find(".kimui-checkbox-group .kimui-checkbox .kimui-checkbox__input .checkbox-icon").removeClass("kimicon-square").removeClass("kimicon-minus-square").addClass("kimicon-check-square");
		}
	}

	//初始化复选
	function checkInit($this){
		$this.find(".kimui-checkbox__input").each(function(i){
			if($(this).hasClass("is-checked")){
				$(this).find(".checkbox-icon").removeClass("kimicon-square").removeClass("kimicon-minus-square").addClass("kimicon-check-square");
			}
			if($(this).hasClass("is-disabled")){
				$(this).find(".kimui-checkbox__original").attr("disabled","disabled");
				$(this).find(".checkbox-icon").attr("onclick","");
			}
		});
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

})(jQuery);
