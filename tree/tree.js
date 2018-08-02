;(function(){
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
	loadingCss.css("skin/tree.css");

	/*table tree*/
	var treeBlankCount = 0;
	/*控制线的全局变量-*/
	var tableTreeArr = [];

	(function($) {

		/*控制线的全局变量-*/
		var treeLineCount = 0;
		var tree_zindex = 1;
		var rootId = "";

		$.fn.kimTree = function(options) {
			return this.each(function() {
				var opts = $.extend({}, $.fn.kimTree.defaults, $.fn.kimTree.parseOptions($(this)), options);
				init($(this), opts);
			});
		};

		/*初始化方法*/
		function init($this, opts) {
            var root = "";
            if (opts.showSearch) {
                root = "<div class='treeSearchBox'>	<span class='searchwrap'><input type='text' class='search_in' maxlength='30' placeholder='请输入搜索关键字...'><i class='fa fa-times-circle fa-lg inputclear cd'></i></span></div>";
            }
            root += "<div class='rootDiv' style='text-align:center;font-size:14px;'>";
            if (opts.showClose) {
                root += '<a style="text-decoration:none;" class="tm-tree-close" href="javascript:void(0);">关闭</a>&nbsp;&nbsp;';
            }
            if (opts.expand) {
                root += '<a style="text-decoration:none;" class="tm-tree-expand-down" href="javascript:void(0);">展开</a>&nbsp;&nbsp;<a  style="text-decoration:none;" class="tm-tree-expand-up" href="javascript:void(0);">收起</a>';
            }
            root += "</div>";
            var treeHtml = [],treeWrap = "";
            for (var i = 0, rootLen = opts.root.length; i < rootLen; i++) {
                var rootData = opts.root[i];
                var childJson = opts.children[rootData.pid];
                treeHtml.push("<ul class='tree treeFolder'>"+dateMessage("", treeLineCount, rootData, childJson, opts)+"</ul>");
            }
            treeWrap = "<div id='treeWrap'><div id='treeRoot'>"+treeHtml.join("")+"</div><div id='searchRoot'><ul class='searchList'></ul></div><div id='overlay'><div class='imgBox'><img src='../tree/skin/img/loading.gif' style='vertical-align:middle;'><span style='font-size:12px;color:#fff'></span></div></div></div>";
            $this.append(root+treeWrap);
            initEvent($this, opts);
            tm_tree_line_icons($this, opts);
            if (opts.width != 0) {
                $this.width(opts.width + "px");
            }
            if (opts.height != 0) {
                $this.css({
                    height: opts.height + "px"
                    /*overflow: "auto"*/
                });
                $this.find("#treeWrap").css({"height":opts.height-38-$(".rootDiv").height()+"px"});
            }
            if (opts.left != 0 && opts.top != 0) {
                $this.css({
                    left: opts.left,
                    top: opts.top
                });
            }
            if (isNotEmpty(opts.border)) {
                $this.css("border", opts.border);
            }
            $this.find("#overlay .imgBox").css({"left":($this.width() - 100)/2 +"px","top": ($this.find("#treeWrap").height() - 110)/2+"px"});
            
        }

		// 生成树数据
        function dateMessage(rid, treeLineCount, rootData, childrenData, opts) {
        	if (isEmpty(rootData.url)) {
                rootData.url = "javascript:void(0);";
            }
            if (childrenData != undefined) {
                if (rid != "") {
                    rid = 'pid="' + rid + '"';
                }
				// 父节点获取焦点
                if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "focus") {
                    rootData.mark = "tm-tree-checkbox-focus";
				// 父节点全选
                } else if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "check") {
                    rootData.mark = "tm-tree-checkbox-checked markParent parentChecked";
				// 父节点不选
                } else if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "unCheck") {
                    rootData.mark = "";
				// 父节点不可选
                } else if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "disable") {
                    rootData.mark = "disable";
				// 父节点禁选标识
                } else if (rootData.label && isNotEmpty(rootData.label) && rootData.label == "disable") {
                    rootData.label = "disable";
				// 父节点限制可选个数
                } else if (rootData.label && isNotEmpty(rootData.label) && rootData.label == "limit") {
                    rootData.label = "limit";
                }
                var rootHTML = '<li id="tm-tree-' + rootData.opid + '" opid="' + rootData.opid + '" ' + rid + '>';
                if (isEmpty(opts.type)) {//<div class="folder_expandable"></div>
                    rootHTML += '<div class="father">' + getTreeLine(treeLineCount) + '<div class="expandable toggle"></div><label class="tm-ui-tree-name" id="tm-tree-name-' + rootData.opid + '"><a href=' + rootData.url + ' opid="' + rootData.opid + '" ' + rid + ' ' + opts.elements + '>' + rootData.name + '</a></label></div>';
                } else {
                    rootHTML += '<div class="father">' + getTreeLine(treeLineCount) + '<div class="expandable toggle"></div><div class="folder_expandable"></div><div class="folder_' + opts.type + '_expandable"><span class="tm-tree-' + opts.type + ' ' + rootData.mark + ' ' + rootData.label + '" data-title="' + rootData.name + '" opid="' + rootData.opid + '" ' + rid + '></span></div><label class="tm-ui-tree-name" id="tm-tree-name-' + rootData.opid + '"><a href=' + rootData.url + ' title="' + rootData.name + '" opid="' + rootData.opid + '" ' + rid + ' ' + opts.elements + '>' + rootData.name + '</a></label></div>';
                }
                rootHTML += '<ul style="display:none;">';
                treeLineCount++;
                if (childrenData != undefined) {
                    for (var i = 0, cdLen = childrenData.length; i < cdLen; i++) {
                        var cdata = opts.children[childrenData[i].pid];
                        if (cdata != undefined) {
                            rootId = rootData.opid;
                            rootHTML += dateMessage(rootId, treeLineCount, childrenData[i], cdata, opts);
                        } else {
                            if (isEmpty(childrenData[i].url)) {
                                childrenData[i].url = "javascript:void(0);";
                            }
                            if (isNotEmpty(childrenData[i].mark) && childrenData[i].mark == "check") {
                                childrenData[i].mark = "tm-tree-checkbox-checked";
                            } else if (isNotEmpty(childrenData[i].mark) && childrenData[i].mark == "focus") {
                                childrenData[i].mark = "tm-tree-checkbox-focus";
                            }
                            if (isEmpty(opts.type)) {//<div class="file"></div>
                                rootHTML += '<li id="tm-tree-' + childrenData[i].opid + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '"><div class="">' + getTreeLine(treeLineCount) + '<div class="node"></div><label class="tm-ui-tree-name" id="tm-tree-name-' + childrenData[i].opid + '"><a href=' + childrenData[i].url + ' opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '"' + opts.elements + '>' + childrenData[i].name + '</a></label></div></li>';
                            } else {
                                rootHTML += '<li id="tm-tree-' + childrenData[i].opid + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '"><div class="">' + getTreeLine(treeLineCount) + '<div class="node"></div><div class="file"></div><div class="file_' + opts.type + '"><span class="tm-tree-' + opts.type + ' ' + childrenData[i].mark + '" data-title="' + childrenData[i].name + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '"></span></div><label class="tm-ui-tree-name" id="tm-tree-name-' + childrenData[i].opid + '"><a href=' + childrenData[i].url + ' title="' + childrenData[i].name + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '" ' + opts.elements + '>' + childrenData[i].name + '</a></label></div></li>';
                            }
                        }
                    }
                    rootHTML += "</ul>";
                    rootHTML += '</li>';
                }
                return rootHTML;
            } else {
                if (isEmpty(opts.type)) {//<div class="file"></div>
                    return '<li id="tm-tree-' + rootData.opid + '" class="last" opid="' + rootData.opid + '"><div class=""><div class="node"></div><label class="tm-ui-tree-name" id="tm-tree-name-' + rootData.opid + '"><a href="' + rootData.url + '" opid="' + rootData.opid + '" ' + opts.elements + '>' + rootData.name + '</a></label></div></li>';
                } else {
                    if (isNotEmpty(rootData.mark) && rootData.mark == "check") {
                        rootData.mark = "tm-tree-checkbox-checked";
                    } else {
                        rootData.mark = "";
                    }
                    return '<li id="tm-tree-' + rootData.opid + '" class="last" opid="' + rootData.opid + '"><div class=""><div class="node"></div><div class="file"></div><div class="file_' + opts.type + '"><span class="tm-tree-' + opts.type + ' ' + rootData.mark + '" data-title="' + rootData.name + '" opid="' + rootData.opid + '"></span></div><label class="tm-ui-tree-name" id="tm-tree-name-' + rootData.opid + '"><a href=' + rootData.url + ' opid="' + rootData.opid + '" ' + opts.elements + '>' + rootData.name + '</a></label></div></li>';
                }
            }
        }
		
		//生成线
        function getTreeLine(numberLine) {
            var line = "";
            for (var i = 0; i < numberLine; i++) {
                line += "<div class='line'></div>";
            }
            return line;
        }

		//生成图标
        function tm_tree_line_icons($this, opts) {
            if (!opts.icons) {
                $this.find(".folder_expandable").hide();
                $this.find(".file").hide();
            }
            if (!opts.line) {
                $this.find(".line").css("backgroundPosition", "0 -600px");
                $this.find(".node").css("backgroundPosition", "0 -600px");
            }
        }

		//前台搜索
        function jsSearch(opts,obj,searchArg) {
        	setTimeout(function(){
				var tree = $(obj).find(".tree .tm-ui-tree-name");
				//tree.find("a").css("color", "#183152");
				$(obj).find(".tree .toggle").removeClass("first_collapsable").addClass("expandable");
				$(obj).find(".tree .father").next().hide();
				var searchVal = "";
				if(searchArg){
					searchVal = searchArg;
				}else{
					searchVal = $(obj).find(".search_in").val().trim();
				}
				if (isNotEmpty(searchVal)) {
					var searchLiDom = "";
					var regText = new RegExp(searchVal.toLowerCase(),"gi"); // regText为//gi
					tree.each(function(i) {
						var treeVal = $(this).text();
						if (treeVal.toLowerCase().indexOf(searchVal.toLowerCase()) != -1) {
							
							$(this).find("a").html(function () {  
								return $(this).html().replace('<b style="color:'+opts.searchedColor+';">', '').replace('</b>', '').replace(regText, '<b style="color:'+opts.searchedColor+';">'+searchVal.toLowerCase()+'</b>'); 
							});  

							$(this).parent().find(".toggle").removeClass("first_collapsable").addClass("expandable");
							$(this).parent().next().hide();
							$(this).parents("ul").each(function() {
								$(this).show();
							});
							
							if($(this).prev().html()==null||$(this).prev().html()==""){
								searchLiDom += "<li style=''><label class='tm-ui-tree-name'>"+$(this).html()+"</label></li>";
							}else{
								searchLiDom += "<li style=''><div class='folder_checkbox_expandable'>"+$(this).prev().html()+"</div><label class='tm-ui-tree-name'>"+$(this).html()+"</label></li>";
							}
							
							var liDom = $(this).parents("li");
							liDom.each(function(i) {
								$(this).children(".father").find(".toggle").removeClass("expandable").addClass("first_collapsable");
								liDom.eq(0).children(".father").find(".toggle").removeClass("first_collapsable").addClass("expandable");
							});
						}
					});
	
					$(obj).find("#treeRoot").hide();
					$(obj).find("#searchRoot").show();
					$(obj).find("#searchRoot .searchList").html("").append(searchLiDom + "<li id='noData' style='display:none;text-align:center;font-size:14px;'>"+opts.noDataText+"</li>");
					$(obj).find("#noData").css("line-height",$(obj).find("#treeWrap").height() + "px");

					if (tree.text().toLowerCase().indexOf(searchVal.toLowerCase()) == -1) {
						$(obj).find(".inputclear").removeClass("cd").removeClass("cb").addClass("tm_red");
						$(obj).find("#searchRoot").find(".searchList #noData").show();
						$(obj).find("#searchRoot").find(".searchList a").html(function () {  
							return $(this).html().replace('<b style="color:'+opts.searchedColor+';">', '').replace('</b>', ''); 
						}); 
					} else {
						$(obj).find(".inputclear").removeClass("cd").removeClass("tm_red").addClass("cb");
						$(obj).find("#searchRoot").find(".searchList #noData").hide();
						$(obj).find("#treeRoot").find("a").html(function () {  
							return $(this).html().replace('<b style="color:'+opts.searchedColor+';">', '').replace('</b>', ''); 
						}); 
					}
					
				} else {
					$(obj).find(".tree .toggle").each(function() {
						$(this).removeClass("first_collapsable").addClass("expandable");
						$(obj).find(".tree ul").css("display", "none");
					});
					$(obj).find("#treeRoot").show();
					$(obj).find("#searchRoot").hide();
				}

	            $(obj).find("#overlay").hide();

        	},1000);
        }
        
		//初始化事件
        function initEvent($this, opts) {
        	//禁止选择框选中
        	document.body.onselectstart = document.body.ondrag = function(){
        		return false;
        	};
        	 
        	/*$(document).bind("click",function(){ 
				setTimeout(function(){
					alert(1);
					if (isNotEmpty($(".search_in").val())) {
	                    $(".search_in").val("");
	                }
	                $(".inputclear").hide();
					$this.hide();
				},0);
		    });*/
           
		   //阻止冒泡
           $this.click(function(e) {
                var e = e || window.event || arguments.callee.caller.arguments[0];
                stopPropagation(e);
           });
           
           //初始化值时根据ID查询对应的文本
	   	   if(opts.initId){
	   		   var ids = opts.initId.split(",");
	   		   useFindTextById(ids,$this);
	   	   };
           
		   //展开收起事件
           $this.find(".toggle").click(function() {
                $(this).toggleClass("first_collapsable expandable");
                if ($(this).hasClass("first_collapsable")) {
                    $(this).parent().next().show();
                    if (opts.exclusion) {
                        $(this).parents(".tree").siblings().find(".first_collapsable").removeClass("first_collapsable").addClass("expandable");
                        $(this).parents(".tree").siblings().find(".expandable").parent().next().hide();
                        $(this).parents("li").siblings().find(".first_collapsable").removeClass("first_collapsable").addClass("expandable");
                        $(this).parents("li").siblings().find(".expandable").parent().next().hide();
                    }
                } else {
                    $(this).parent().next().hide();
                }
            });
           
			//前台搜索
            if (opts.showSearch && opts.searchMethod == "js") {
                $this.find(".rootDiv,#treeWrap").css({
                    "margin-top": "0px"
                });
				//点击搜索按钮
                $this.find(".searchbutton").click(function() {
                	setTimeout(function(){
						$this.find("#overlay").show();
					},0);
                    jsSearch(opts,$this);
                });
				
				//键盘抬起事件
				$this.find(".search_in").keyup(function() {
                    setTimeout(function(){
						$this.find("#overlay").show();
					},0);
					jsSearch(opts,$this,$.trim($(this).val()));
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
                    jsSearch(opts,$this);
                });
                //回车键搜索
                $this.find(".search_in").keydown(function(e) {
                    var e = e || window.event || arguments.callee.caller.arguments[0];
                    if (e.keyCode == 13) {
                    	setTimeout(function(){
    						$this.find("#overlay").show();
    					},0);
                        jsSearch(opts,$this);
                    }
                });
                //事件委托
                $this.find("#searchRoot").bind("click",function(e){
                	e = e || window.event || arguments.callee.caller.arguments[0];
                	var target = e.target || e.srcElement;
                	if(target.nodeName.toLowerCase() === "span"){
                		var opid = target.getAttribute("opid");
                		$this.find("#treeRoot .tree #tm-tree-name-"+opid).prev().find(".tm-tree-" + opts.type).trigger("click");
                		var newClassName = $this.find("#treeRoot .tree #tm-tree-name-"+opid).prev().find(".tm-tree-" + opts.type).attr("class");
                		target.className = newClassName;
                		jsSearch(opts,$this);
            		}else if(target.nodeName.toLowerCase() === "a" && !opts.onlyClickCheckbox){
						var opid = target.getAttribute("opid");
                		$this.find("#treeRoot .tree #tm-tree-name-"+opid).prev().find(".tm-tree-" + opts.type).trigger("click");
                		var newClassName = $this.find("#treeRoot .tree #tm-tree-name-"+opid).prev().find(".tm-tree-" + opts.type).attr("class");
						$this.find("#searchRoot .searchList li .folder_checkbox_expandable").find(".tm-tree-" + opts.type+"[opid="+opid+"]").addClass(newClassName)
                		jsSearch(opts,$this);
					}
                });
            }

			// 后台搜索
            if (opts.showSearch && opts.searchMethod == "java") {
                $this.find(".rootDiv").css({
                    "margin-top": "0px"
                });
                $this.find(".searchbutton").click(function() {
                    javaSearch($this);
                });
                $this.find(".search_in").focus(function() {
                    $this.find(".inputclear").show().removeClass("cd").removeClass("tm_red").addClass("cb");
                });
                $this.find(".search_in").blur(function() {
                    var val = $this.find(".search_in").val();
                    if (val != null  || val != "") {
                        $this.find(".inputclear").show().removeClass("cb").removeClass("tm_red").addClass("cd");
                    } else {
                        $this.find(".inputclear").hide();
                    }
                });
                $this.find(".inputclear").click(function() {
                    $(this).parent().find(".search_in").val("");
                    $this.scrollTop(0);
                    $(this).hide();
                    javaSearch($this);
                });
                $this.find(".search_in").keydown(function(e) {
                    var e = e || window.event || arguments.callee.caller.arguments[0];
                    if (e.keyCode == 13) {
                        javaSearch($this);
                    }
                });
            }

			//鼠标移入下拉框列表事件
            $this.find(".tm-ui-tree-name").hover(function() {
                $(this).parent().addClass("tm_ccc");
            }, function() {
                $(this).parent().removeClass("tm_ccc");
            });

			//点击收起事件
            $this.find(".tm-tree-expand-down").on("click", function() {
                $this.find(".expandable").addClass("first_collapsable");
                $this.find(".expandable").removeClass("expandable");
                $this.find("ul").show();
            });

			//点击展开事件
            $this.find(".tm-tree-expand-up").on("click", function() {
                $this.find(".first_collapsable").addClass("expandable");
                $this.find(".first_collapsable").removeClass("first_collapsable");
                $this.find("ul").hide();
                $this.find(".tree").show();
            });

			//点击关闭按钮
            $this.find(".tm-tree-close").on("click", function() {
                $this.hide();
            });

			//设置展开个数
            if (isNotEmpty(opts.expandCount) && opts.expandCount != 0) {
                var $li = $this.find(".tree").children("li").eq((opts.expandCount - 1));
                $li.find("ul").show();
                $li.find(".expandable").removeClass("expandable").addClass("first_collapsable");
            }

			//多选操作
            if (!opts.isRadio) {
                var i = 0,j = 0,temp1 = "",temp2 = "";
                $this.find(".tm-tree-" + opts.type).click(function() {
                    if (opts.limit) {
                        if (i+j < opts.limitTimes) {
                        	//点击根节点并且不是原始已选数据
                            if ($(this).hasClass("limit") && !$(this).hasClass("parentChecked")) {
                            	//若已经选中则--
                                if ($(this).hasClass("tm-tree-checkbox-checked")) {
                                    i--;
                                //若没有选中则++
                                } else if (!$(this).hasClass("tm-tree-checkbox-checked") && !$(this).hasClass("tm-tree-checkbox-focus")) {
                                	i++;
                                }
                            //点击子节点
                            } else if (!$(this).hasClass("limit")) {
                                var parentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-checked");
                                var parentFocus = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-focus");
                                var hasParentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("parentChecked");
                                //父节点没有选中并且父节点不是原始已选数据则++
                                if (!parentChecked && !parentFocus && !hasParentChecked) {
                                    i++;
                                //父节点有选中或者半选并且父节点不是原始已选数据但是点击不同根节点下的子节点则++
                                } else if ((parentChecked || parentFocus) && !hasParentChecked) {
                                    temp1 = temp2 = $(this).parents(".treeFolder").find(".father:first").find(".tm-ui-tree-name").text();
                                    if (temp2 !== temp1) {
                                        i++;
                                        temp1 = temp2;
                                    }
                                }
                            }
                         } else {
                        	//点击根节点并且不是原始已选数据
                            if ($(this).hasClass("limit") && !$(this).hasClass("parentChecked")) {
                            	//若已经选中则--
                            	if ($(this).hasClass("tm-tree-checkbox-checked")) {
                                    i--;
                                //若没有选中则报数据量过大
                                } else if (!$(this).hasClass("tm-tree-checkbox-checked") && !$(this).hasClass("tm-tree-checkbox-focus")) {
                                    //layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                    //   icon: 1,
                                    //    skin: 'layer-ext-moon'
                                    //});
									alert('选择的数据过大，请先保存再进行下面操作')
                                    return false;
                                }
                            //点击子节点
                            } else if (!$(this).hasClass("limit")) {
                                var parentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-checked");
                                var parentFocus = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-focus");
                                var hasParentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("parentChecked");
                                //父节点没有选中并且父节点不是原始已选数据则++
                                if (!parentChecked && !parentFocus && !hasParentChecked) {
                                    //layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                    //    icon: 1,
                                    //    skin: 'layer-ext-moon'
                                    //});
									alert('选择的数据过大，请先保存再进行下面操作')
                                    return false;
                                }
                            }
                        }
                        
                        if (i+j < opts.limitTimes) {
                        	//点击根节点并且是原始已选数据
                            if ($(this).hasClass("limit") && $(this).hasClass("parentChecked")) {
                            	//若已经选中则++
                                if ($(this).hasClass("tm-tree-checkbox-checked")) {
                                    j++;
                                //若没有选中则--
                                } else if (!$(this).hasClass("tm-tree-checkbox-checked") && !$(this).hasClass("tm-tree-checkbox-focus")) {
                                    j--;
                                }
                            //点击子节点
                            } else if (!$(this).hasClass("limit")) {
                                var parentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-checked");
                                var parentFocus = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-focus");
                                var hasParentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("parentChecked");
                                //子节点对应的根节点没有选中并且是原始已选数据
                                if (!parentChecked && !parentFocus && hasParentChecked) {
                                    j--;
                                //子节点对应的根节点有选中或者半选并且是原始已选数据
                                } else if ((parentChecked || parentFocus) && hasParentChecked) {
                                    temp1 = temp2 = $(this).parents(".treeFolder").find(".father:first").find(".tm-ui-tree-name").text();
                                    if (temp2 !== temp1) {
                                        j--;
                                        temp1 = temp2;
                                    }
                                }
                            }
                         } else {
                        	//点击根节点并且是原始已选数据
                            if ($(this).hasClass("limit") && $(this).hasClass("parentChecked")) {
                                if ($(this).hasClass("tm-tree-checkbox-checked")) {
                                	//layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                    //    icon: 1,
                                    //    skin: 'layer-ext-moon'
                                    //});
									alert('选择的数据过大，请先保存再进行下面操作')
                                    return false;
                                } else if (!$(this).hasClass("tm-tree-checkbox-checked") && !$(this).hasClass("tm-tree-checkbox-focus")) {
                                    j--;
                                }
                            //点击子节点
                            } else if (!$(this).hasClass("limit")) {
                            	var parentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-checked");
                                var parentFocus = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-focus");
                                var hasParentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("parentChecked");
                                if (parentChecked && !parentFocus && hasParentChecked) {
                                    //layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                    //    icon: 1,
                                    //    skin: 'layer-ext-moon'
                                    //});
									alert('选择的数据过大，请先保存再进行下面操作')
                                    return false;
                                }
                            }
                        }
                    }
                    var opid = $(this).attr("opid");
                    var pid = $(this).attr("pid");
                    var $parent = $this.find("#treeRoot #tm-tree-" + opid);
                    var $parents = $this.find("#treeRoot #tm-tree-" + pid);
                    if (!$(this).hasClass("tm-tree-" + opts.type + "-checked")) {
                        $(this).addClass("tm-tree-" + opts.type + "-checked");
                        $parent.each(function() {
                            $(this).find(".tm-tree-" + opts.type).addClass("tm-tree-" + opts.type + "-checked");
                        });
                        $(this).parents("li").each(function() {
                            var $p = $(this);
                            var len = $p.find(".tm-tree-" + opts.type).length;
                            var clen = $p.find(".tm-tree-" + opts.type + "-checked").length;
                            if (len != (clen + 1)) {
                                $p.find(".tm-tree-" + opts.type).first().addClass("tm-tree-" + opts.type + "-focus");
                                $parent.find(".tm-tree-" + opts.type).removeClass("tm-tree-" + opts.type + "-focus");
                            } else {
                                $p.find(".tm-tree-" + opts.type).addClass("tm-tree-" + opts.type + "-checked");
                            }
                            if ($parents.children(".father").find(".tm-tree-" + opts.type).hasClass("tm-tree-" + opts.type + "-checked")) {
                                $parents.children(".father").find(".tm-tree-" + opts.type).removeClass("tm-tree-" + opts.type + "-focus");
                            }
                        });
                    } else {
                    	
                        $(this).removeClass("tm-tree-" + opts.type + "-focus").removeClass("tm-tree-" + opts.type + "-checked");
                        $parent.each(function() {
                            $(this).find(".tm-tree-" + opts.type).removeClass("tm-tree-" + opts.type + "-focus").removeClass("tm-tree-" + opts.type + "-checked");
                        });
                        $(this).parents("li").each(function() {
                            var $p = $(this);
                            if ($p.find(".tm-tree-" + opts.type).first().hasClass("tm-tree-" + opts.type + "-checked")) {
                            	$p.find(".tm-tree-" + opts.type).first().removeClass("tm-tree-" + opts.type + "-checked");
                            }
                            var clen = $p.find(".tm-tree-" + opts.type + "-checked").length;
                            if (clen != 0) {
                                $p.find(".tm-tree-" + opts.type).first().removeClass("tm-tree-" + opts.type + "-checked").addClass("tm-tree-" + opts.type + "-focus");
                            } else {
                                $p.find(".tm-tree-" + opts.type).first().removeClass("tm-tree-" + opts.type + "-focus").removeClass("tm-tree-" + opts.type + "-checked");
                            }
                        });
                    }
                    //点击子节点后父节点选中状态被取消并且不是原始已选数据
                    if (opts.limit && !$(this).hasClass("limit")) {
                        var parentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-checked");
                        var parentFocus = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-focus");
                        var hasParentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("parentChecked");
                        if (!parentChecked && !parentFocus && !hasParentChecked) {
                            i--;
                        }else if(!parentChecked && !parentFocus && hasParentChecked){
                        	j++;
                        }
                    }
                    //alert("增量数据："+i+" 减量数据："+j);
                    if (opts.markParent && ($parents.children(".father").find(".tm-tree-" + opts.type).hasClass("tm-tree-" + opts.type + "-checked") || $parent.children(".father").find(".tm-tree-" + opts.type).hasClass("tm-tree-" + opts.type + "-checked"))) {
                        $parents.children(".father").find(".tm-tree-" + opts.type).addClass("markParent");
                        $parent.children(".father").find(".tm-tree-" + opts.type).addClass("markParent");
                    } else {
                        $parents.children(".father").find(".tm-tree-" + opts.type).removeClass("markParent");
                        $parent.children(".father").find(".tm-tree-" + opts.type).removeClass("markParent");
                    }
                    var chkOpidArr = [];
                    var chkNameArr = [];
                    var chkParentOpidArr = [];
                    var chkParentNameArr = [];
                    var focusOpidArr = [];
                    var focusNameArr = [];
                    $this.find("#treeRoot .tm-tree-" + opts.type + "-checked").each(function() {
                        if ($(this).hasClass("markParent")) {
                            var parentName = $(this).parent().next().text().replace(/[\t|\n|\s+]/g, "");
                            var parentOpid = $(this).attr("opid");
                            chkParentNameArr.push(parentName);
                            chkParentOpidArr.push(parentOpid);
                        }
                        var name = $(this).parent().next().text();
                        /*if (name.indexOf("-") != -1) {
                            name = name.split("-")[1].replace(/[\t|\n|\s+]/g, "");
                        } else {*/
                            name = $(this).parent().next().text().replace(/[\t|\n|\s+]/g, "");
                        //}
                        var opid = $(this).attr("opid");
                        chkOpidArr.push(opid);
                        chkNameArr.push(name);
                    });
                    $this.find("#treeRoot .tm-tree-" + opts.type + "-focus").each(function() {
                        var name = $(this).parent().next().text();
                        focusOpidArr.push($(this).attr("opid"));
                        focusNameArr.push(name);
                    });
                    var checkedArr = {
                        opid: chkOpidArr.toString(),
                        name: chkNameArr.toString(),
                        parentOpid: chkParentOpidArr.toString(),
                        parentName: chkParentNameArr.toString()
                    };
                    var focusArr = {
                        opid: focusOpidArr.toString(),
                        name: focusNameArr.toString()
                    };
                    var data = {
                        "checkArr": checkedArr,
                        "focusArr": focusArr
                    };
                    opts.onclick($(this), data);
                });
            } else {
                $this.find(".tm-tree-" + opts.type).click(function() {
                    var opid = $(this).attr("opid");
                    var pid = $(this).attr("pid");
                    if (!$(this).hasClass("disable")) {
                        $this.find(".tm-tree-" + opts.type).removeClass("tm-tree-" + opts.type + "-checked").removeClass("tm-tree-" + opts.type + "-focus");
                        $(this).parents("li").each(function() {
                            $(this).children().first().find(".tm-tree-" + opts.type).addClass("tm-tree-" + opts.type + "-focus");
                        }
                        );
                        $(this).addClass("tm-tree-" + opts.type + "-checked").removeClass("tm-tree-" + opts.type + "-focus");
                        var pName = [];
                        $this.find(".tm-tree-" + opts.type + "-focus").each(function() {
                            var pNames = $(this).parent().next().text();
                            /*if (pNames.indexOf("-") != -1) {
                                pNames = pNames.split("-")[1].replace(/[\t|\n|\s+]/g, "");
                            } else {*/
                                pNames = $(this).parent().next().text().replace(/[\t|\n|\s+]/g, "");
                            //}
                            pName.push(pNames);
                        }
                        );
                        var name = $(this).parent().next().text();
                        /*if (name.indexOf("-") != -1) {
                            name = name.split("-")[1].replace(/[\t|\n|\s+]/g, "");
                        } else {*/
                            name = $(this).parent().next().text().replace(/[\t|\n|\s+]/g, "");
                        //}
                        var pname = pName.join("/");
                        if (isEmpty(pname)) {
                            pname = name;
                        }
                        if (isEmpty(pid)) {
                            pid = opid;
                        }
                        var data = {
                            opid: opid,
                            name: name,
                            pid: pid,
                            pname: pname
                        };
                        opts.onclick($(this), data);
                    } else {}
                });
            }

			//点击文字触发选中
			if(!opts.onlyClickCheckbox){
				$this.find(".tm-ui-tree-name").click(function() {
					$(this).prev().find("span").trigger("click");
				});
			}
           
            //显示文件夹图标
            if (opts.iconFolder) {
                $(".file").addClass("folder_expandable");
                $(".folder_expandable").removeClass("file");
            }

			//显示文件图标
            if (opts.iconFile) {
                $(".folder_expandable").addClass("file");
                $(".file").removeClass("folder_expandable");
            }
        };

        $.fn.kimTree.parseOptions = function($target) {
            return {
                width: $target.attr("width"),
                height: $target.attr("height")
            };
        };
		
        $.fn.kimTree.methods = {
            remove: function($this) {
                $this.remove();
            }
        };

        function tm_window_posXY(event) {
            event = event || window.event;
            var posX = event.pageX || (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
            var posY = event.pageY || (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
            return {
                x: posX,
                y: posY
            };
        };
        
		//通过id找到对应文本
        function useFindTextById(ids,obj){
			for(var i=0;i<ids.length;i++){
				$(obj).find("#treeWrap #treeRoot ul li span[opid='"+ids[i]+"']").trigger("click");
			}
        };
       
        $.fn.kimTree.defaults = {
            root: [{
                name: "一级节点1",
                url: "",
                opid: 1,
                pid: "root1",
                mark: "focus",
                label: "disable"
            }, {
                name: "一级节点2",
                url: "",
                opid: 2,
				mark: "focus",
                pid: "root2"
            }, {
                name: "一级节点3",
                url: "",
                opid: 3,
				mark: "disable",
                pid: "root3"
            }],
            children: {
                root1: [{
                    name: "二级节点11",
                    url: "javascript:void(0);",
                    opid: 11,
                    pid: "c11",
                }, {
                    name: "二级节点12",
                    url: "javascript:void(0);",
                    opid: 12,
                    pid: "c12",
                    mark: "check"
                }, {
                    name: "二级节点13",
                    url: "javascript:void(0);",
                    opid: 13,
                    pid: "c13",
                    mark: "check"
                }],
                root2: [{
                    name: "二级节点21",
                    url: "javascript:void(0);",
                    opid: 21,
                    pid: "c21",
                    mark: "check"
                }, {
                    name: "二级节点22",
                    url: "javascript:void(0);",
                    opid: 22,
                    pid: "c22"
                }, {
                    name: "二级节点23",
                    url: "javascript:void(0);",
                    opid: 23,
                    pid: "c23"
                }],
                c21: [{
                    name: "三级节点211",
                    url: "javascript:void(0);",
                    opid: 211,
                    pid: "c211"
                }, {
                    name: "三级节点212",
                    url: "javascript:void(0);",
                    opid: 212,
                    pid: "c212"
                }, {
                    name: "三级节点213",
                    url: "javascript:void(0);",
                    opid: 213,
                    pid: "c213"
                }]
            },
            showSearch: true, //是否显示搜索框
            searchMethod: "js",//搜索方法
			searchedColor: "red",//搜索到的数据的显示颜色，支持十六进制
			noDataText: "无匹配数据",//搜索不到数据时的提示信息
            elements: "",
            exclusion: true,//节点展开是否互斥
            expand: false,//是否显示展开和收起
            expandCount: 1,//默认展开第几个节点
            showClose: false,//是否显示关闭按钮
			icons: true,//显示图标
            iconFolder: false,//显示文件夹图标
            iconFile: false,//显示文件图标
            line: true,//显示对齐线
            left: 0,//下拉框的left位置
            top: 0,//下拉框的top位置
            width: "100%",//宽度
            height: "250",//高度
            initId: '',//初始化数据id
            isRadio: false,//单选
			type: "checkbox",//数据显示类型checkbox\radio
            limit: true,//启用个数限制
			limitTimes: "2", //限制选中的个数，父节点必须有limit标识
            markParent: false,//标识父节点
            childrenSelected: false,//子节点选中
            parentSelected: false,//父节点选中
			onlyClickCheckbox: false,//只点击复选框选中
            border : "1px solid #ddd",//给外边框加线
            onclick: function($obj, data) {//点击事件
				
			}
        };

		$.kimTree = {
			_expand: function(pid, obj, e) {
				tableTreeArr = [];
				var $this = $(obj);
				var $root = $("#tm_items_" + pid);
				var isOpen = $root.attr("isOpen");
				var isRoot = $root.attr("isRoot");
				if (isRoot == 1)
					treeBlankCount = 0;
				if (isOpen == 0) {
					$this.attr("src", "../../images/treetable/minus.gif");
					$root.attr("isOpen", 1);
					var len = $(".tm_children_" + pid).length;
					if (len == 0)
						$this.parents("tr").after(this._initChildren(pid));
					$.tmTable._init();
					$(".tm_children_" + pid).show();
				} else {
					$this.attr("src", "../../images/treetable/plus.gif");
					$root.attr("isOpen", 0);
					this._childrenHide(pid);
				}
				//tm_tree_callback(obj,pid,e);
				stopPropagation(e);
			},
			_childrenHide: function(pid) {
				var childrenArr = this._getAllChlidren(pid);
				if (childrenArr.length > 0) {
					for (var i = 0; i < childrenArr.length; i++) {
						var node = $("#tm_items_" + childrenArr[i]);
						$(".tm_children_" + childrenArr[i]).hide();
						if (isNotEmpty(node.attr("isOpen")) && node.attr("isOpen") == 1) {
							node.attr("isOpen", 0);
							$("#tm_items_expand_" + childrenArr[i]).attr("src", "../../images/treetable/plus.gif");
						}
					}
				}
			},
			_initTableTree: function(options) {
				var opts = $.extend({target: $("#tm_tbody")}, options);
				opts.target.data("treeTableData", opts);
				opts.target.html(this._initRoot());
				$.tmTable._init();
				this._initMethod(opts);
			},
			_initMethod: function(opts) {
				if (isNotEmpty(opts.type)) {
					$(".tm_tree_box").find(".tm-icon").before("<input type='" + opts.type + "'/>&nbsp;");
				}
			},
			_initRoot: function() {
				var html = "";
				var n = 1;
				for (var i = 0; i < root.length; i++,n++) {
					var data = root[i];
					var chhtml = "<img id=\"tm_items_expand_" + data.pid + "\"  class=\"tm-icon\" style=\"CURSOR: pointer;\"  onclick=\"$.kimTree._expand(" + data.pid + ",this,event);\" src=\"../../images/treetable/plus.gif\"><img style=\"position: relative;top:2px;\"  src=\"../../images/treetable/fshut.gif\">";
					if (isEmpty(children[data.pid])) {
						//在子类中找不到就不显示收起和展开节点了。
						chhtml = "<img class=\"tm_tree_leaf tm-icon \"  src=\"../../images/treetable/leaf.gif\">";
					}
					html += "<tr id=\"tm_items_" + data.opid + "\" isStatus=\"" + data.publishFlag + "\" parentId=\"" + data.parentId + "\"  opid=\"" + data.opid + "\" isRoot=\"1\"  title=\"" + data.name + "\" isOpen=\"0\" class=\"tm-items\">" + 
					"<td></td>" + 
					"<td><span class=\"tm_sort\">" + n + "</span></td>" + 
					"<td>" + chhtml + "<a href=\"javascript:void(0)\" class=\"tmui-name\">" + data.name + "</a></td>" + 
					"<td><span class=\"tm_publish\">" + data.publish + "</span></td>" + 
					"<td><span class=\"tmui-buttons none\" style=\"position: relative;left: 15px;\" >" + 
					"<a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmChannel._edit(this)\"><img src=\"../../images/admin/edit.png\" height=\"12\" /></a>&nbsp;&nbsp;&nbsp;&nbsp;" + 
					"<a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmTable._delete(this)\"><img src=\"../../images/admin/delete.png\" height=\"12\"></a>" + 
					"</span>" + 
					"</td>" + 
					"</tr>";
				}
				return html;
			},
			_initChildren: function(pid) {
				var html = "";
				if (children) {
					var childrenArr = children[pid];
					if (childrenArr.length > 0) {
						var n = 1;
						treeBlankCount++;
						for (var i = 0; i < childrenArr.length; i++,n++) {
							var data = childrenArr[i];
							var chhtml = "<img id=\"tm_items_expand_" + data.pid + "\" style=\"CURSOR: pointer;\" class=\"tm-icon\" onclick=\"$.kimTree._expand(" + data.pid + ",this,event);\" src=\"../../images/treetable/plus.gif\"><img style=\"position: relative;top:2px;\" src=\"../../images/treetable/fshut.gif\">";
							if (isEmpty(children[data.pid])) {
								//在子类中找不到就不显示收起和展开节点了。
								chhtml = "<img class=\"tm_tree_leaf tm-icon\"  src=\"../../images/treetable/leaf.gif\">";
							}
							html += "<tr id=\"tm_items_" + data.opid + "\" isStatus=\"" + data.publishFlag + "\"  parentId=\"" + data.parentId + "\" opid=\"" + data.opid + "\" title=\"" + data.name + "\" class=\"tm-items tm-items-children tm_children_" + pid + "\">" + 
							"<td></td>" + 
							"<td><span class=\"tm_sort\">" + this._getTreeLine(treeBlankCount) + n + "</span></td>" + 
							"<td>" + this._getTreeLine(treeBlankCount) + chhtml + "<a href=\"javascript:void(0)\" class=\"tmui-name\">" + data.name + "</a></td>" + 
							"<td><span class=\"tm_publish\">" + data.publish + "</span></td>" + 
							"<td _td_pro=\"rd\"><span class=\"tmui-buttons none\" style=\"position: relative;left: 15px;\" >" + 
							"<a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmChannel._edit(this)\"><img src=\"../../images/admin/edit.png\" height=\"12\" /></a>&nbsp;&nbsp;&nbsp;&nbsp;" + 
							"<a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmTable._delete(this)\"><img src=\"../../images/admin/delete.png\" height=\"12\"></a>" + 
							"</span>" + 
							"</td>" + 
							"</tr>";
						}
					}
				}
				return html;
			},
			_getTreeLine: function(numberLine) {
				var line = "";
				for (var i = 0; i < numberLine; i++) {
					line += "<img src=\"../..//images/treetable/blank.gif\">";
				}
				return line;
			},
			_getAllChlidren: function(pid) {
				tableTreeArr.push(pid);
				var childrenArr = children[pid];
				if (isNotEmpty(childrenArr) && childrenArr.length > 0) {
					for (var i = 0; i < childrenArr.length; i++) {
						this._getAllChlidren(childrenArr[i].pid);
						tableTreeArr.push(childrenArr[i].pid);
					}
				}
				return tableTreeArr;
			}
		};
		
		// 判断非空
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
})();

