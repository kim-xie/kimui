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
	loadingCss.css("skin/comboBox.css");

	//定义jquery对象
	$.fn.kimComboBox = function(options) {
		return this.each(function() {
			var opts = $.extend({}, $.fn.kimComboBox.defaults, options);
			init($(this), opts);
			initEvent($(this),opts);
		});
	};
	
	//初始化方法
	function init($this,opts){

		var kimComboBox = "<div id='kimComboBoxWrap' class='kimComboBoxWrap'>";
		
		if(opts.removeIdsObj && opts.validateId && opts.validateIdType){
			kimComboBox +=	"<input id='"+opts.removeIdsObj+"' name='"+opts.inputName+"' type='hidden' class='vilidateObj removeIds' vilidate='"+opts.validateIdType+"'/>";
		}else if(opts.removeIdsObj){
			kimComboBox +=	"<input id='"+opts.removeIdsObj+"' name='"+opts.inputName+"' type='hidden' class='removeIds'/>";
		}
		if(opts.addIdsObj && opts.validateId && opts.validateIdType){
			kimComboBox +=	"<input id='"+opts.addIdsObj+"' name='"+opts.inputName+"' type='hidden' class='vilidateObj addIds' vilidate='"+opts.validateIdType+"'/>";
		}else if(opts.addIdsObj){
			kimComboBox +=	"<input id='"+opts.addIdsObj+"' name='"+opts.inputName+"' type='hidden' class='addIds'/>";
		}
		if(opts.idObj && opts.validateId && opts.validateIdType){
			kimComboBox +=	"<input id='"+opts.idObj+"' name='"+opts.inputName+"' value='"+opts.idValue+"' type='hidden' class='vilidateObj ids' vilidate='"+opts.validateIdType+"'/>";
		}else if(opts.idObj){
			kimComboBox +=	"<input id='"+opts.idObj+"' name='"+opts.inputName+"' value='"+opts.idValue+"' type='hidden' class='ids'/>";
		}
		
		kimComboBox += "<div class='kimComboBox borderCd'>";
			
		if(opts.textId && opts.validateVal && opts.validateValType){
			kimComboBox += "<span id='"+opts.textId+"' class='vilidateObj contents ellipsis' vilidate='"+opts.validateValType+"'>"+opts.textValue+"</span>";
		}else{
			kimComboBox += "<span id='"+opts.textId+"' class='contents ellipsis'>"+opts.textValue+"</span>";
		}

		kimComboBox +=  "	<span class='icon'>"+
						//"		<i class='fa fa-sort-up selectclear pointer'></i>"+
						"		<i class='fa fa-sort-down pointer'></i>"+
						"	</span>"+
						"</div>";


		if(opts.listId || opts.listClass){
			kimComboBox += "<div id='"+opts.listId+"' class='"+opts.listClass+" none' style='position:absolute;z-index:1000;'>";
		} 
		if(opts.listType && opts.listType == "list" && opts.showSearch ){
			kimComboBox += "<div class='searchBox'>	<span class='searchwrap'><input type='text' class='search_in' maxlength='30' placeholder='请输入搜索关键字...'/><i class='fa fa-times-circle fa-lg inputclear cd'></i><span class='searchbutton'>搜  索</span></span></div>";
		}
		if(opts.listType && opts.listType == "list" && opts.listcontents ){
			kimComboBox += "<div id='listBox'><div id='listRoot'><ul>";
			var liDom = "";
			for(var i=0;i<opts.listcontents.length;i++){
				if(opts.showCheckBox){
					liDom += "<li><a href='javascript:void(0)' class='ellipsis' data-id='"+opts.listids[i]+"' title='"+opts.listcontents[i]+"'><input type='checkBox' style='display:inline-block;width:16px;height:16px;margin-right:5px;vertical-align:top;'>"+opts.listcontents[i]+"</a></li>";
				}else{
					liDom += "<li><a href='javascript:void(0)' class='ellipsis' data-id='"+opts.listids[i]+"' title='"+opts.listcontents[i]+"'>"+opts.listcontents[i]+"</a></li>";
				}
			}
			kimComboBox += liDom + "</ul></div><div id='searchRoot'><ul class='searchList'></ul></div><div id='overlay'><div class='imgBox'><img src='../comboBox/skin/img/loading.gif' style='vertical-align:middle;'><span style='font-size:12px;'></span></div></div></div>";
		}

		kimComboBox += "</div></div>";

		$this.append(kimComboBox);
		/*if(opts.showSearch){
			$this.find("#listBox").css("margin-top","40px");
		}*/

		if(opts.textValue === "请选择"){
			$this.find(".contents").addClass("cplaceholder");
		}else{
			$this.find(".contents").removeClass("cplaceholder");
		}
		
		if(opts.width){
			$this.find(".kimComboBox").width($this.find("#kimComboBoxWrap").width() - 47);
			$this.find("#listBox li").css({"display":"block","height":"28px","line-height":"28px"});
			$this.find("#listBox li a").width(opts.width).css({"display":"inline-block","text-indent":"5px"});
			$this.find("#listBox li a input").css({"margin-bottom":"3px","vertical-align":"middle"});
		}
		if(opts.height){
			//$this.find(".kimComboBox").height(opts.height);
			$this.find(".kimComboBox .contents").css("line-height",opts.height+"px");
			$this.find(".kimComboBox .icon i").css("line-height",opts.height+"px");
		}
		
		if(opts.searchBoxWidth){
			$this.find(".searchBox").width(opts.searchBoxWidth - 2);
		}
		if(typeof opts.listWidth == "string" && opts.listWidth.indexOf("%") != -1){
			$this.find("."+opts.listClass+"").width($this.width() - 2);
		}else{
			$this.find("."+opts.listClass+"").width(opts.listWidth - 2);
			$this.find(".searchBox").width(parseInt(opts.listWidth) - 10);
		}
		if(opts.listHeight){
			$this.find("."+opts.listClass+"").height(opts.listHeight);
			if($this.find("#listBox").prev().hasClass("searchBox")){
				$this.find("#listBox").height(parseInt(opts.listHeight) - 38);
			}else{
				$this.find("#listBox").height(parseInt(opts.listHeight));
			}
		}
		if(opts.listBackground){
			$this.find("."+opts.listClass+"").css("background",opts.listBackground);
		}
		if(opts.listBorder){
			$this.find("."+opts.listClass+"").css({"border":opts.listBorder,"border-radius":"2px"});
		}
		$this.find("#overlay .imgBox").css({"left":($this.find("#overlay").width() - 100)/2 +"px","top":($this.find("#listBox").height() - 110)/2+"px"});
	}

	//初始化事件
	function initEvent($this,opts){
		
		if(!opts.disable){
			//展开收起下拉列表
			$this.find(".kimComboBox").click(function(e){
				e = e || window.event || arguments.callee.caller.arguments[0]; //兼容firefox
				stopPropagation(e);
				$(this).children().first().css("user-select","none");
				var target = e.target || e.srcElement;
				// 重置
				if(target.nodeName.toLowerCase() === "i" && target.getAttribute("class").indexOf("selectClear") !== -1){
					$(this).parents("#kimComboBoxWrap").find(".contents").text("");
					$(this).parents("#kimComboBoxWrap").find("input").val("");
					$this.find("#listBox #listRoot ul li").find("a").removeClass("on");
					if(opts.listType == "tree"){
						$(this).parents("#kimComboBoxWrap").find(".trees .search_in").val("");
						$(this).parents("#kimComboBoxWrap").find(".trees .tm-tree-checkbox").removeClass("tm-tree-checkbox-checked").removeClass("tm-tree-checkbox-focus");
						$(this).parents("#kimComboBoxWrap").find(".trees .tm-tree-radio").removeClass("tm-tree-radio-checked").removeClass("tm-tree-radio-focus");
						$(this).parents("#kimComboBoxWrap").find(".trees .tree .toggle").removeClass("first_collapsable").addClass("expandable");
						$(this).parents("#kimComboBoxWrap").find(".trees .tree .father").next().hide();
					}else if(opts.listType == "list" && opts.showCheckBox){
						$(this).parents("#kimComboBoxWrap").find("input:checkbox").prop("checked",false);
					}
				}else{
					$(this).parent().find("."+opts.listClass+"").toggle();
					//$(this).parent().find(".icon .fa").toggleClass("fa-sort-up fa-sort-down");
					//$(this).toggleClass("borderBlue borderCd")
					if($(this).parent().find(".icon .fa").hasClass("fa-sort-up")){
						$(this).parent().find(".icon .fa").removeClass("fa-sort-up").addClass("fa-sort-down");
						$(this).removeClass("borderBlue").addClass("borderCd");
					}else if($(this).parent().find(".icon .fa").hasClass("fa-sort-down")){
						$(this).parent().find(".icon .fa").removeClass("fa-sort-down").addClass("fa-sort-up");
						$(this).removeClass("borderCd").addClass("borderBlue");
					}
				}
				
				if($(this).parents("td")){
					$(this).parents("td").siblings().find("."+opts.listClass+"").hide();
					$(this).parents("tr").siblings().find("."+opts.listClass+"").hide();
				}
				if($(this).parents("tr")){
					$(this).parents("tr").siblings().find(".kimComboBoxList").hide();
				}
				stopDefault(e);
			});

			if(opts.triggerClick){
				if(opts.showClearButton && $this.find(".kimComboBox").find(".icon .fa").hasClass("fa-sort-down")){
					$this.find(".contents").parent().find(".icon .fa").hover(function(){
						showClear(opts,$this);
					},function(){
						if(!$this.find(".kimComboBox").find(".icon .fa").hasClass("fa-sort-up")){
							$this.find(".contents").parent().find(".icon .fa").removeClass("fa-remove selectClear").addClass("fa-sort-down");
						}
					});
				}
			}
		}else{
			$this.find(".kimComboBox").css("background","#f3f3f3");
		}
		
		//下拉框为数控件时的初始化事件
		if(opts.listType && opts.listType == "tree" && opts.tree){
			$("#"+opts.listId+"").kimTree(opts.tree);
		}
		
		//给list内容框赋值
		if(opts.listType == "list" && opts.listcontents){
			//阻止事件冒泡
			$this.click(function(e) {
                e = e || window.event || arguments.callee.caller.arguments[0];
                stopPropagation(e);
            });

			if (opts.showSearch) {
				//点搜索按钮
                $this.find(".searchbutton").click(function() {
                	setTimeout(function(){
						$this.find("#overlay").show();
					},0);
                    search($this);
                });
				//输入框获取焦点事件
                $this.find(".search_in").focus(function() {
                    $this.find(".inputclear").show().removeClass("cd").removeClass("tm_red").addClass("cb");
                });
				//输入框失去焦点事件
                $this.find(".search_in").blur(function() {
                    var val = $this.find(".search_in").val();
                    if (val != null  || val != "") {
                        $this.find(".inputclear").show().removeClass("cb").removeClass("tm_red").addClass("cd");
                    } else {
                        $this.find(".inputclear").hide();
                    }
                });
				//重置按钮事件
                $this.find(".inputclear").click(function() {
                    $(this).parent().find(".search_in").val("");
                    $this.scrollTop(0);
                    $(this).hide();
                    setTimeout(function(){
						$this.find("#overlay").show();
					},0);
                    search($this);
                });
                //使用enter键进行搜索
                $this.find(".search_in").keydown(function(e) {
                    var e = e || window.event || arguments.callee.caller.arguments[0];
                    if (e.keyCode == 13) {
                    	setTimeout(function(){
    						$this.find("#overlay").show();
    					},0);
                        search($this);
                    }
                });
                
                //事件委托--搜索后进行的操作
				if(opts.triggerClick){
					$this.find("#searchRoot").bind("click",function(e){
						e = e || window.event || arguments.callee.caller.arguments[0];
						var target = e.target || e.srcElement;
						//点击非checkbox
						if(target.nodeName.toLowerCase() === "a"){
							if(!opts.onlyClickCheckBox){
								if(opts.isMultiSelect){
									//alert("多选a")
									if(target.firstChild.checked){
										target.firstChild.checked = false;
									}else{
										target.firstChild.checked = true;
									}
									var opid = target.getAttribute("data-id");
									$this.find("#listRoot li a[data-id='"+opid+"'] input[type='checkbox']").trigger("click");
								}else{
									//alert("单选a")
									$(this).addClass("on");
									var opid = target.getAttribute("data-id");
									$this.find("#listRoot li a[data-id="+opid+"]").trigger("click");
									search($this);
								}
							}
						//点击checkbox	
						}else if(target.nodeName.toLowerCase() === "input"){
							if(opts.showCheckBox){
								if(opts.isMultiSelect){
									//alert("多选checkbox")
									var opid = target.parentNode.getAttribute("data-id");
									$this.find("#listRoot li a[data-id='"+opid+"'] input[type='checkbox']").trigger("click");
								}else{
									//alert("单选checkbox")
									target.parentNode.className = "on";
									var opid = target.parentNode.getAttribute("data-id");
									$this.find("#listRoot li a[data-id='"+opid+"'] input[type='checkbox']").trigger("click");
									var liDom = target.parentNode.parentNode;
									$(liDom).siblings().find("input:checkbox").prop("checked",false);
								}
							}
						}
					});
				}else{
					$this.find("input:checkbox").attr("disabled",true);
				}
            }
			
			if(opts.triggerClick){
				//选择下拉框数据
				$this.find("ul li a").bind("click",function(e){
					e = e || window.event || arguments.callee.caller.arguments[0];
					var target = e.target || e.srcElement;
					var aText = "";
					var aId = "";
					//点击非checkbox
					if(target.nodeName.toLowerCase() !== "input"){
						if(!opts.onlyClickCheckBox){
							if(opts.isMultiSelect){
								//多选a
								$(this).find("input[type='checkbox']").trigger("click");
							}else{
								//单选a
								$(this).addClass("on");
								$(this).parent().siblings().find("a").removeClass("on");
								$(this).parents("li").siblings().find("input:checkbox").prop("checked",false);
								$(this).parents("li").find("input:checkbox").prop("checked",true);
								aText = $(this).text();
								aId = $(this).attr("data-id");
								$this.find(".contents").text(aText).attr("title",aText).css("color","#1f2d3d");
								$this.find("#"+opts.idObj).val(aId).attr("title",aId).css("color","#1f2d3d");
								//点击下拉框数据时触发的方法
								if(opts.onchange){
									opts.onchange($this,aId,aText);
								}
							}
						}
					//点击checkbox
					}else if(target.nodeName.toLowerCase() === "input"){
						if(opts.isMultiSelect){
							//多选input
							var checkedNameArr = [];
							var checkedIdArr = [];
							aText = $(this).text();
							aId = $(this).attr("data-id");
							$this.find("#listRoot li a input[type='checkbox']:checked").each(function(){
								checkedNameArr.push($(this).parent().text());
								checkedIdArr.push($(this).parent().attr("data-id"));
							});
							$this.find(".contents").text(checkedNameArr.join(",")).attr("title",checkedNameArr.join(",")).css("color","#1f2d3d");
							$this.find("#"+opts.idObj).val(checkedIdArr).css("color","#1f2d3d");//.attr("title",checkedIdArr.join(","))
							//点击下拉框数据时触发的方法
							if(opts.onchange){
								opts.onchange($(this),aId,aText);
							}
						}else{
							//单选input
							$(this).addClass("on");
							$(this).parent().siblings().find("a").removeClass("on");
							$(this).parents("li").siblings().find("input:checkbox").prop("checked",false);
							$(this).parents("li").find("input:checkbox").prop("checked",true);
							aText = $(this).text();
							aId = $(this).attr("data-id");
							$this.find(".contents").text(aText).attr("title",aText).css("color","#1f2d3d");
							$this.find("#"+opts.idObj).val(aId).attr("title",aId).css("color","#1f2d3d");
							//点击下拉框数据时触发的方法
							if(opts.onchange){
								opts.onchange($this,aId,aText);
							}
						}
					}
					
					//不是多选的话点击下拉框里的数据就可以收起下拉框
					if(!opts.showCheckBox){
						//触发下拉框事件
						$this.find(".kimComboBox").trigger("click");
					}
					
				});
				
			}else{
				$this.find("input:checkbox").attr("disabled",true);
			}
		}
		
		//初始化值时根据文本查询对应的ID
		if(opts.useFindIdByText){
			var initText = $this.find(".kimComboBoxWrap .contents").text();
			if(initText){
				var liDom = $this.find("#listBox #listRoot ul li");
				liDom.find("a[title='"+initText+"']").addClass("on");
				var initId = liDom.find("a[title='"+initText+"']").attr("data-id");
				$this.find(".kimComboBoxWrap input.ids").val(initId);
			}
		}
		
		//初始化值时根据ID查询对应的文本
		if(opts.useFindTextById){
			var initId = $this.find(".kimComboBoxWrap input.ids").val();
			var liDom = $this.find("#listBox #listRoot ul li");
			liDom.find("a[data-id='"+initId+"']").addClass("on");
			var initText = liDom.find("a[data-id='"+initId+"']").text();
			$this.find(".kimComboBoxWrap .contents").text(initText);
		}
		
		//初始化值时根据IDs查询对应的文本
		if(opts.useFindTextByIds){
			var initIds = $this.find(".kimComboBoxWrap input.ids").val().split(",");
			if(opts.listType && opts.listType == "tree" && opts.tree){
				var liDom = $this.find("#treeWrap #treeRoot ul li");
				var initText = [];
				for(var i=0;i<initIds.length;i++){
					initText.push(liDom.find("span[opid='"+initIds[i]+"']").attr("data-title"));
//					if(opts.isMultiSelect){
//						//liDom.find("a[data-id='"+initIds[i]+"'] input:checkbox").attr("checked",true);
//						liDom.find("a[data-id='"+initIds[i]+"'] input:checkbox").trigger("click");
//					}
					liDom.find("span[opid='"+initIds[i]+"']").trigger("click");
				}
				$this.find(".kimComboBoxWrap .contents").text(initText.join(","));
			}else{
				var liDom = $this.find("#listBox #listRoot ul li");
				var initText = [];
				for(var i=0;i<initIds.length;i++){
					initText.push(liDom.find("a[data-id='"+initIds[i]+"']").text());
					if(opts.isMultiSelect){
						//liDom.find("a[data-id='"+initIds[i]+"'] input:checkbox").attr("checked",true);
						liDom.find("a[data-id='"+initIds[i]+"'] input:checkbox").trigger("click");
					}
				}
				//$this.find(".kimComboBoxWrap .contents").text(initText.join(",")).attr("title",initText.join(","));
			}
		}
		
		//点击文档收起下拉框
		$(document).click(function(){
			$this.find("."+opts.listClass+"").hide();
			$this.find(".icon .fa").removeClass("fa-sort-up").addClass("fa-sort-down");
			$this.find(".kimComboBox").removeClass("borderBlue").addClass("borderCd");
			if(!$this.find(".kimComboBoxWrap .contents").text()){
				$this.find(".kimComboBoxWrap .contents").text("请选择").css("color","#97a8be").addClass("cplaceholder");
			}
		});
		
	}
	
	// 搜索方法
	function search(obj) {
		setTimeout(function(){
			var searchVal = $(obj).find(".search_in").val().trim();
			var list = $(obj).find("#listRoot ul li");
			$(obj).find("#overlay").show();
			if (isNotEmpty(searchVal)) {
				var searchLiDom = "";
				list.each(function(i) {
					var listVal = $(this).find("a").text();
					if (listVal.toLowerCase().indexOf(searchVal.toLowerCase()) != -1) {
						var checkMark = $(this).find("a input").prop("checked");
						searchLiDom += "<li class='"+checkMark+"'>"+$(this).html()+"</li>";
					}
				});
				$(obj).find("#listRoot").hide();
				$(obj).find("#searchRoot").show();
				$(obj).find("#searchRoot .searchList").html("").append(searchLiDom+ "<li id='noData' style='display:none;text-align:center;font-size:14px;line-height:100px;'>无匹配数据</li>");
				$("#searchRoot .searchList li").each(function(i){
					if($(this).attr("class")==="true"){
						$(this).find("a input[type='checkbox']").prop("checked",true);
					}
				});
				if (list.text().toLowerCase().indexOf(searchVal.toLowerCase()) == -1) {
					$(obj).find(".inputclear").removeClass("cd").removeClass("cb").addClass("tm_red");
					$(obj).find("#searchRoot").find(".searchList #noData").show();
				} else {
					$(obj).find(".inputclear").removeClass("cd").removeClass("tm_red").addClass("cb");
					$(obj).find("#searchRoot").find(".searchList #noData").hide();
				}	
			} else {
				$(obj).find("#listRoot").show();
				$(obj).find("#searchRoot").hide();
			}
			$(obj).find("#overlay").hide();
		},1000);
	}
	

	//默认参数
	$.fn.kimComboBox.defaults = {
		width:"100%",//展示框的宽度
		height:"30px",//展示框的高度
		validateId:false,//是否需要验证Id
		validateVal:false,//是否需要验证Val
		validateIdType:"required",//验证类型 (默认为非空验证-required)- email/phone/chinese/idcard
		validateValType:"required",//验证类型 (默认为非空验证-required)- email/phone/chinese/idcard
		addIdsObj:"",//存放增量ID的Dom对象
		removeIdsObj:"",//存放删除ID的Dom对象
		idObj:"",//存放ID的Dom对象
		inputName: "inputName",//输入框的name值
		idValue:"",//存放的ID值
		textId:"contents",//显示文本框的id
		textValue:"请选择",//展示框的显示值
		listId:"kimComboBoxList",//下拉框的ID属性
		listClass:"kimComboBoxList",//下拉框的class属性
		listWidth:"100%",//下拉框的宽度
		listHeight:"200px",//下拉框的高度
		listBackground:"#fff",//下拉框的背景色
		listBorder:"1px solid #bfcbd9",//下拉框的边框
		showSearch:true,//是否显示搜索框
		searchBoxWidth:"200px",//搜索框的宽度
		listType:"list",//下拉框的类型
		useFindIdByText: false,//根据文本找对应的ID
		useFindTextById: false,//根据ID找对应的文本
		useFindTextByIds: false,//根据多选的ID找到对应的多文本
		showClearButton: true,//是否显示重置按钮
		listids:["1111","2222","3333"],//下拉框里的值对应的id
		listcontents:["list下拉框测试1","list下拉框测试2","list下拉框测试3"],//下拉框里的值（针对下拉框为list类型的值）
		showCheckBox:true,//是否显示复选框
		onlyClickCheckBox: false, //是否只能点击checkBox选择数据
		isMultiSelect:false,//是否支持多选
		triggerClick:true,//下拉框里的数据是否可选择
		disable: false,//下拉框是否禁止点击
		onchange:function(obj,ids,values){},//值变化事件
		tree:{}//下拉框为树类型的树初始化
	};

	//显示重置按钮
	function showClear(opts,$this){
		var val = $this.find(".contents").text().trim();
		if(isNotEmpty(val) && val !== opts.textValue && $this.find(".kimComboBox").find(".icon .fa").hasClass("fa-sort-down")){
			$this.find(".contents").parent().find(".icon .fa").removeClass("fa-sort-down").addClass("fa-remove selectClear");
		}
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