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
	loadingCss.css("skin/radio.css");

	//jquery方法
	$.fn.kimRadio = function(options){
		return this.each(function() {
			var opts = $.extend({},$.fn.kimRadio.defaults,options);
			radioInit($(this),opts);
			radioEvent($(this),opts);
		});
	};

	//初始化方法
	function radioInit($this,opts){
		var radioTemp = "";
		if(opts.radioGroup){
			var radioGroup = "<div class='kimui-radio-group'>";
			var radioTemps = "";
			for(var i=0;i<opts.radioAttribute.length;i++){
				radioTemps +=   "<label class='kimui-radio'>" +
								"	<span class='kimui-radio__input'>"+
								"		<span class='radio-icon kimicon-circle'></span>"+
								"		<input type='radio' class='kimui-radio__original' name='"+opts.radioAttribute[i].inputName+"' value='"+opts.radioAttribute[i].value+"'>"+
								"	</span>"+
								"	<span class='kimui-radio__label'>"+opts.radioAttribute[i].label+"</span>"+
								"</label>";
			}
			radioGroup += radioTemps + "</div>";
			radioTemp = radioGroup;
		}else{
		    radioTemp = "<label class='kimui-radio'>" +
						"	<span class='kimui-radio__input'>"+
						"		<span class='radio-icon kimicon-circle'></span>"+
						"		<input type='radio' class='kimui-radio__original' name='"+opts.radioAttribute[0].inputName+"' value='"+opts.radioAttribute[0].value+"'>"+
						"	</span>"+
						"	<span class='kimui-radio__label'>"+opts.radioAttribute[0].label+"</span>"+
						"</label>";
		}

		$this.append(radioTemp);

	};

	//初始化事件
	function radioEvent($this,opts){
		for(var i=0;i<opts.radioAttribute.length;i++){
			if(opts.radioAttribute[i].checked){
				$this.find(".kimui-radio__input").eq(i).addClass("is-checked");
			}
			if(opts.radioAttribute[i].disabled){
				$this.find(".kimui-radio__input").eq(i).addClass("is-disabled");
			}
		}
		checkInit($this);
		radioChecked($this);
		
	};

	//默认参数
	$.fn.kimRadio.defaults = {
		radioGroup: true, //是否显示单选group
		radioAttribute: [ //单选属性
			{
				inputName: 'sex', // 表单提交的name属性
				value: '0', // 表单的值
				label: '女', // 显示名
				disabled: false, // 是否禁选
				checked: true // 是否已选择
			},
			{
				inputName: 'sex',
				value: '1',
				label: '男',
				disabled: false,
				checked: false
			},
			{
				inputName: 'sex',
				value: '2',
				label: '保密',
				disabled: true,
				checked: false
			}
		]
	};

	// 单选
	function radioChecked($this){
		$this.find(".kimui-radio").click(function(e){
			e = e || window.event;
			stopDefault(e);
			if(!$(this).find(".kimui-radio__input").hasClass("is-disabled")){
				if($(this).find(".radio-icon").hasClass("kimicon-circle")){
					$(this).find(".radio-icon").removeClass("kimicon-circle").addClass("kimicon-disc");
					$(this).siblings().find(".kimui-radio__input .radio-icon").addClass("kimicon-circle").removeClass("kimicon-disc");
				}
			}
		});
	}

	//初始化单选
	function checkInit($this){
		$this.find(".kimui-radio__input").each(function(i){
			if($(this).hasClass("is-checked")){
				$(this).find(".radio-icon").removeClass("kimicon-circle").addClass("kimicon-disc");
			}
			if($(this).hasClass("is-disabled")){
				$(this).find(".kimui-radio__original").attr("disabled","disabled");
				$(this).find(".kimui-radio").attr("onclick","");
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
