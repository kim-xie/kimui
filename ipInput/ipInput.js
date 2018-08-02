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
	loadingCss.css("skin/ipInput.css");

	//jquery方法
	$.fn.kimIpInput = function(options){
		return this.each(function() {
			var opts = $.extend({},$.fn.kimIpInput.defaults,options);
			ipInputInit($(this),opts);
			ipInputEvent($(this),opts);
		});
	};

	//默认参数
	$.fn.kimIpInput.defaults = {
		// 长度最低支持110像素  
		width : 110,  
		// 高度默认20像素  
		height : 20,  
		// 在键盘按下时用来存储未输入前的值  
		currValue : '',  
		// 原有值，就是从数据库中读取到的值  
		value : ''  
	};
						
	//初始化方法
	function ipInputInit($this,opts){
		
		// 输入控件代码  
        var html = '';  
        html += '<div id="ipinput_wrap">';  
        html += '	<input type="text" id="ipOne" class="ipinput_input" maxlength="3" size="3"/>';  
        html += '	<span class="ipinput_separator">.</span>';  
        html += '	<input type="text" id="ipTwo" class="ipinput_input" maxlength="3" size="3"/>';  
        html += '	<span class="ipinput_separator">.</span>';  
        html += '	<input type="text" id="ipThree" class="ipinput_input" maxlength="3" size="3"/>';  
        html += '	<span class="ipinput_separator">.</span>';  
        html += '	<input type="text" id="ipFour" class="ipinput_input" maxlength="3" size="3"/>';  
        html += '</div><span>ip填写范围必须是在0 ~ 255区间</span>';  

		// 添加输入控件代码  
        $this.append(html);

		// 把原有的值赋到输入框中  
        if(isNotEmpty(opts.value)) {  
            var valArr = opts.value.split(".");  
            if(4 == valArr.length) {  
                $this.find('#ipOne').val(valArr[0]);  
                $this.find('#ipTwo').val(valArr[1]);  
                $this.find('#ipThree').val(valArr[2]);  
                $this.find('#ipFour').val(valArr[3]);  
            }  
        }  
          
        // 设置宽度和高度  
        $this.find('#ipinput_wrap').width(opts.width);  
        $this.find('#ipinput_wrap').height(opts.height);  
		$this.find(".ipinput_input").height(opts.height).css("line-height",opts.height).width(opts.width/4-3); 
		$this.find(".ipinput_separator").height(opts.height); 
        //alert($('input', $('.ipinput_div')));  

	};

	//初始化事件
	function ipInputEvent($this,opts){

		// 输入框绑定键盘按下事件  
        $this.find('.ipinput_input').keydown(function(event) {  
			var _currentInput = $(this);
            keydown(event,_currentInput,opts);  
        });  
          
        // 输入框绑定键盘按下弹起事件  
        $this.find('.ipinput_input').keyup(function(event) { 
			var _currentInput = $(this);
            keyup(event,_currentInput,opts);  
        });  
          
        // 输入框失去焦点事件  
       //$this.find('.ipinput_input').blur(function() {  
       //     setData($this);  
       // });  
		
	};
	
	// 赋值给隐藏框  
    var setData = function($this) {  
        // 四个框的值  
        var one = $this.find('#ipOne').val();  
        var two = $this.find('#ipTwo').val();  
        var three = $this.find('#ipThree').val();  
        var four = $this.find('#ipFour').val();  
          
        // 如果四个框都有值则赋值给隐藏框  
        if(isNotEmpty(one) && isNotEmpty(two) && isNotEmpty(three) && isNotEmpty(four)) {  
            var ip = one + "." + two + "." + three + "." + four;  
            $this.text(ip);  
        }  
    }  
      
    // 键盘按下事件  
    var keydown = function(event,_currentInput,opts) { 
		event = event || window.event || arguments.callee.caller.arguments[0]; 
        // 当前输入的键盘值  
        var code = event.keyCode;  
          
        // 除了数字键、删除键、小数点之外全部不允许输入  
        if((code < 48 && 8 != code && 37 != code && 39 != code) || (code > 57 && code < 96) || (code > 105 && 110 != code && 190 != code)) {  
            return false;  
        }  
          
        // 先存储输入前的值，用于键盘弹起时判断值是否正确  
        opts.currValue = _currentInput.val();  
          
        // 110、190代表键盘上的两个点  
        if(110 == code || 190 == code){  
            // 当前输入框的ID  
            var id = _currentInput.attr("id");  
              
            // 当前输入框的值  
            var value = _currentInput.val();  
              
            // 如果是第一个框则第二个框获的焦点  
            if("ipOne" == id && isNotEmpty(value)) {  
                $('#ipTwo').focus();  
                return false;  
            }  
            // 如果是第二个框则第三个框获的焦点  
            else if("ipTwo" == id && isNotEmpty(value)) {  
                $('#ipThree').focus();  
                return false;  
            }  
            // 如果是第三个框则第四个框获的焦点  
            else if("ipThree" == id && isNotEmpty(value)) {  
                $('#ipFour').focus();  
                return false;  
            }  
            // 如果是第四个框则直接返回  
            else if("ipFour" == id) {  
                return false;  
            } else if(isEmpty(value)) {  
                return false;  
            }  
        }  
    }  
      
    // 键盘弹起事件  
    var keyup = function(event,_currentInput,opts) {  
        // 当前值  
        var value = _currentInput.val();  
        if(isNotEmpty(value)) {  
            value = parseInt(value);  
            if(value > 255) {
				alert("填写范围必须在 0 - 255间");
                _currentInput.val(opts.currValue)  
            } else if(value > 99) {  
                // 当前输入框的ID  
                var id = _currentInput.attr("id");  
                  
                // 如果是第一个框则第二个框获的焦点  
                if("ipOne" == id && isNotEmpty(value)) {  
                    $('#ipTwo').focus();  
                }  
                // 如果是第二个框则第三个框获的焦点  
                else if("ipTwo" == id && isNotEmpty(value)) {  
                    $('#ipThree').focus();  
                }  
                // 如果是第三个框则第四个框获的焦点  
                else if("ipThree" == id && isNotEmpty(value)) {  
                    $('#ipFour').focus();  
                }  
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
