;(function($){
	//定义jQuery对象
	$.fn.kimVilidate = function(options){
		return this.each(function(){
			var opts = $.extend({},$.fn.kimVilidate.defaults,options);
			//初始化事件
			initEvent($(this),opts);
		});
	};

	//存贮临时密码变量
	var pwd = "";
	
	//初始化事件
	function initEvent($this,opts){
		var vilidateObj = "";
		if($this.hasClass("vilidateObj")){
			vilidateObj = $this;
		}else if($this.find(".vilidateObj")){
			vilidateObj = $this.find(".vilidateObj");
		}
		var data = [];
		var objJson = {};
		
		vilidateObj.each(function(){
			var $obj = $(this);
			var val;
			if($obj.prop("tagName").toLowerCase() === "input" || $obj.prop("tagName").toLowerCase() === "select"){
				val = $obj.val().trim();
			}else{
				val = $obj.text().trim();
			}
			objJson[$obj.attr("id")] = val;
			var validate = $(this).attr("vilidate");
			var trigger = $(this).attr("trigger");
			if(validate){
				var validateArr = validate.split("|");
				var validateArrLen = validateArr.length;
				for(var i=0;i<validateArrLen;i++){
					data.push(vilidate($obj,validateArr[i],val,opts));
				}
			}
			if(trigger){
				$(this).on(trigger,function(){
					alert(1)
					$(this).kimVilidate();
				})
			}
		});
		
		if(opts.result){
			opts.result.call($this,vilidateResult($this,data),objJson);
		}
	}
	
	// 验证方法
	var vilidate = function(obj,match,val,opts){ 
		switch(match){
			case 'required':
				return isEmpty(val)?showMsg(obj,opts.tip_required,false,opts):showMsg(obj,opts.tip_success,true,opts);
			case 'email':
				if(checkReg(val,opts.reg_email) && !isEmpty(val)){
					return showMsg(obj,opts.tip_success,true,opts);
				}else if(isEmpty(val)){
					return showMsg(obj,opts.tip_required,false,opts);
				}else{
					return showMsg(obj,opts.tip_email,false,opts);
				};
			case 'chinese':
				if(checkReg(val,opts.reg_chinese) && !isEmpty(val)){
					return showMsg(obj,opts.tip_success,true,opts);
				}else if(isEmpty(val)){
					return showMsg(obj,opts.tip_required,false,opts);
				}else{
					return showMsg(obj,opts.tip_chinese,false,opts);
				};
			case 'number':
				if(checkReg(val,opts.reg_number) && !isEmpty(val)){
					return showMsg(obj,opts.tip_success,true,opts);
				}else if(isEmpty(val)){
					return showMsg(obj,opts.tip_required,false,opts);
				}else{
					return showMsg(obj,opts.tip_number,false,opts);
				};
			case 'pwd1':
				return pwd = val; 
			case 'pwd2':
				if(pwdEqual(val,pwd) && !isEmpty(val)){
					return showMsg(obj,opts.tip_success,true,opts);
				}else if(isEmpty(val)){
					return showMsg(obj,opts.tip_required,false,opts);
				}else{
					return showMsg(obj,opts.tip_pwdequal,false,opts);
				};
			case 'idcard':
				if(isIdCard(val) && !isEmpty(val)){
					return showMsg(obj,opts.tip_success,true,opts);
				}else if(isEmpty(val)){
					return showMsg(obj,opts.tip_required,false,opts);
				}else{
					return showMsg(obj,opts.tip_idcard,false,opts);
				};
			case 'phone':
				if(checkReg(val,opts.reg_phone) && !isEmpty(val)){
					return showMsg(obj,opts.tip_success,true,opts);
				}else if(isEmpty(val)){
					return showMsg(obj,opts.tip_required,false,opts);
				}else{
					return showMsg(obj,opts.tip_phone,false,opts);
				};
			defaults:
				return true;
		}
	};

	//判断两次密码是否一致
	var pwdEqual = function(pwd1,pwd2){
		return pwd1 === pwd2 ? true : false;
	};

	//正则验证
	var checkReg = function(str,reg){
		return reg.test(str);
	};
	
	//校验身份证号码
	function isIdCard(num){  
		num = num.toUpperCase();
		//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。  
		if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
		  //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
		  return false;
		}
		//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
		//下面分别分析出生日期和校验位
		var len, re;
		len = num.length;
		if (len == 15){
			re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
			var arrSplit = num.match(re);
			//检查生日日期是否正确
			var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
			var bGoodDay;
			bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bGoodDay){
				//alert('输入的身份证号里出生日期不对！');  
				return false;
			}else{
				//将15位身份证转成18位
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0, i;  
				num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
				for(i = 0; i < 17; i ++){
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				num += arrCh[nTemp % 11];  
				return true;  
			}  
		}
		if (len == 18){
			re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
			var arrSplit = num.match(re);
			//检查生日日期是否正确
			var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
			var bGoodDay;
			bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
			if (!bGoodDay){
				//alert(dtmBirth.getYear());
				//alert(arrSplit[2]);
				//alert('输入的身份证号里出生日期不对！');
				return false;
			}else{
				//检验18位身份证的校验码是否正确。
				//校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
				var valnum;
				var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
				var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
				var nTemp = 0, i;
				for(i = 0; i < 17; i ++){
					nTemp += num.substr(i, 1) * arrInt[i];
				}
				valnum = arrCh[nTemp % 11];
				if (valnum != num.substr(17, 1)){
					//alert('18位身份证的校验码不正确！应该为：' + valnum);
					return false;
				}
				return true;
			}
		}
		return false;
	} 
	
	//显示信息
	var showMsg = function(obj,msg,mark,opts){
		if(opts.tooltip){
			opts.tooltip.tip = msg;
			$(obj).tmTip(opts.tooltip);
		}else{
			$(obj).next(".vilidateTip").remove();
			$(obj).after("<p class='vilidateTip'><span class='tipMark'>*</span><span class='tipMsg'>"+msg+"</span></p>");
			$(obj).parent().css({"position":"relative"});
			var objWidth = $(obj).innerWidth();
			$(obj).next(".vilidateTip").css({"position":"absolute","left":objWidth,"top":"50%","margin-top":"-13px","width":"100%","text-align":"left"});
			$(obj).next(".vilidateTip").find(".tipMark").css({'position':'absolute','top':'3px','font-size':'18px','font-weight':'600','color':'red','margin':'0 5px'});
			$(obj).next(".vilidateTip").find(".tipMsg").css({'margin-left':'15px','font-size':'12px','font-weight':'600','color':'#000'});
		}
		
		var json = {};
		json[$(obj).attr("id")] = mark;
		return json;
	};
	
	//验证结果
	var vilidateResult = function($this,data){
		var vilidateLen = 0;
		var dataLen = data.length;
		outer:
		for(var i=0;i<dataLen;i++){
			var newJson = data[i];
			inner:
			for(var key in newJson){
				if(newJson[key] == false){
					//alert("验证不通过！");
					if(!$this.find("#"+key+"").parent().hasClass("cont_val")){
						$this.find("#"+key+"").parents(".cont_val").css("borderColor","red");
						if($this.find("#"+key+"").parent().hasClass("kimComboBoxWrap")){
							$this.find("#"+key+"").parent().find(".kimComboBox").css("borderColor","red");
						}else{
							$this.find("#"+key+"").css("borderColor","red");
						}
					}else{
						$this.find("#"+key+"").parent().css("borderColor","red");
					}
					$this.find("#"+key[0]+"").focus();
					break inner;
				}else{
					//alert("验证通过！");
					if(!$this.find("#"+key+"").parent().hasClass("cont_val")){
						$this.find("#"+key+"").parents(".cont_val").css("borderColor","");
						if($this.find("#"+key+"").parent().hasClass("kimComboBoxWrap")){
							$this.find("#"+key+"").parent().find(".kimComboBox").css("borderColor","");
						}else{
							$this.find("#"+key+"").css("borderColor","");
						}
					}else{
						$this.find("#"+key+"").parent().css("borderColor","");
					}
					$this.find("#"+key+"").next(".vilidateTip").remove();
					vilidateLen ++;
				}
			}		
		}
		//全部验证通过后要执行的代码
		if(vilidateLen == dataLen){
			$('.tm-tips').trigger("click");
			return "success";
		}else{
			return "fail";
		}
	};

	$.fn.kimVilidate.defaults ={
		// 提示信息
		tip_success:'验证成功', 
		tip_required:'不能为空', 
		tip_email:'邮箱格式有误',
		tip_chinese:"用户名必须是中文",
		tip_phone:'手机号码格式不正确',
		tip_idcard:'身份证号码格式不正确或不合法',
		tip_pwdequal: '两次输入密码不一致',
		tip_number: '必须为数字',
		// 正则验证
		reg_email:/^\w+\@[A-Za-z0-9]+\.[A-Za-z]{2,4}$/i,
		reg_chinese:/^[\u4E00-\u9FA5]+$/,
		reg_number:/^[0-9]*$/,
		reg_length:/^.{m,n}$/,
		reg_idCard:/(1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|71|81|82|90)([0-5][0-9]|90)(\\d{2})(19|20)(\\d{2})((0[13578][1-9]|0[13578][12][0-9]|0[13578]3[01]|1[02]3[01])|(0[469][1-9]|0[469][12][0-9]|30)|(02[1-9]|02[12][0-9]))(\\d{3})([0-9]|x)/,
		reg_phone:/^0?(13[0-9]|14[57]|15[012356789]|17[013678]|18[0-9])[0-9]{8}$/,
		
		result:function(data,objJson){
			//验证成功后的回调函数
			if(data == "success"){
				//var json = JSON.stringify(objJson);
				//alert(json);
			}	
		},
		tooltip:""/*{
			width: 0,//宽度
			height: 0,//高度如果为0则为自动高度
			event:"click",//触发的事件类型
			arrow:"leftMiddle",
			hideArrow:false,//是否隐藏方向箭头
			background:"#fefe89",//设置背景
			border:"2px solid red",
			//tip: "",//内容
			contentAlign:"center",
			offLeft:0,//左部偏移
			offTop:0,//顶部移动
			color:"#333",
		}*/
	};
	
	/**
	 * 判断非空
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


})(jQuery);