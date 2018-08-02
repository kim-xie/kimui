;(function() {
    var treeBlankCount = 0,tableTreeArr = [];
    (function($) {
        var treeLineCount = 0,/*tree_zindex=1,*/rootId = "";
        $.fn.kimTree = function(options) {
            return this.each(function() {
                var opts = $.extend({}, $.fn.kimTree.defaults, $.fn.kimTree.parseOptions($(this)), options);
                init($(this), opts);
            });
        };
        function init($this, opts) {
            var root = "";
            if (opts.showSearch) {
                root = "<div class='searchbox'>	<span class='searchwrap'><input type='text' class='search_in' maxlength='30' placeholder='请输入搜索关键字...'><i class='fa fa-times-circle fa-lg inputclear cd'></i>		<span class='searchbutton'>搜  索</span></span></div>";
            }
            root += "<div class='rootDiv'>";
            if (opts.showClose) {
                root += '<a style="text-decoration:underline;" class="tm-tree-close" href="javascript:void(0);">关闭</a>&nbsp;&nbsp;';
            }
            if (opts.expand) {
                root += '<a style="text-decoration:underline;" class="tm-tree-expand-down" href="javascript:void(0);">展开</a>&nbsp;&nbsp;<a  style="text-decoration:underline;" class="tm-tree-expand-up" href="javascript:void(0);">收起</a>';
            }
            root += "</div>";
            var treeHtml = [],treeWrap = "";
            for (var i = 0, rootLen = opts.root.length; i < rootLen; i++) {
                var rootData = opts.root[i];
                var childJson = opts.children[rootData.pid];
                treeHtml.push("<ul class='tree treeFolder'>"+dateMessage("", treeLineCount, rootData, childJson, opts)+"</ul>");
            }
            treeWrap = "<div id='treeWrap'><div id='treeRoot'>"+treeHtml.join("")+"</div><div id='searchRoot'><ul class='searchList'></ul></div><div id='overlay'><div class='imgBox'><img src='../tree/img/loading.gif' style='vertical-align:middle;'><span style='font-size:12px;color:#fff'></span></div></div></div>";
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
                $this.find("#treeWrap").css({"height":opts.height-($this.find(".searchbox").height()+10)+"px"});
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
            $this.find("#overlay .imgBox").css({"left":($this.width() - 100)/2 +"px","top": ($this.find("#treeWrap").height() - 100)/2+"px"});
        }
        function dateMessage(rid, treeLineCount, rootData, childrenData, opts) {
           
        	if (isEmpty(rootData.url)) {
                rootData.url = "javascript:void(0);";
            }
            if (childrenData != undefined) {
                if (rid != "") {
                    rid = 'pid="' + rid + '"';
                }
                if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "focus") {
                    rootData.mark = "tm-tree-checkbox-focus";
                } else if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "check") {
                    rootData.mark = "tm-tree-checkbox-checked markParent parentChecked";
                } else if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "unCheck") {
                    rootData.mark = "";
                } else if (rootData.mark && isNotEmpty(rootData.mark) && rootData.mark == "disable") {
                    rootData.mark = "disable";
                } else if (rootData.label && isNotEmpty(rootData.label) && rootData.label == "disable") {
                    rootData.label = "disable";
                } else if (rootData.label && isNotEmpty(rootData.label) && rootData.label == "limit") {
                    rootData.label = "limit";
                }
                var rootHTML = '<li id="tm-tree-' + rootData.opid + '" opid="' + rootData.opid + '" ' + rid + '>';
                if (isEmpty(opts.type)) {
                    rootHTML += '<div class="father">' + getTreeLine(treeLineCount) + '<div class="expandable toggle"></div><div class="folder_expandable"></div><label class="tm-ui-tree-name" id="tm-tree-name-' + rootData.opid + '"><a href=' + rootData.url + ' opid="' + rootData.opid + '" ' + rid + ' ' + opts.elements + '>' + rootData.name + '</a></label></div>';
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
                            if (isEmpty(opts.type)) {
                                rootHTML += '<li id="tm-tree-' + childrenData[i].opid + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '">				<div class="">' + getTreeLine(treeLineCount) + '					<div class="node"></div>					<div class="file"></div>					<label class="tm-ui-tree-name" id="tm-tree-name-' + childrenData[i].opid + '">						<a href=' + childrenData[i].url + ' opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '"' + opts.elements + '>' + childrenData[i].name + '</a>					</label>				</div>			</li>';
                            } else {
                                rootHTML += '<li id="tm-tree-' + childrenData[i].opid + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '">				<div class="">' + getTreeLine(treeLineCount) + '					<div class="node"></div>					<div class="file"></div>					<div class="file_' + opts.type + '">						<span class="tm-tree-' + opts.type + ' ' + childrenData[i].mark + '" data-title="' + childrenData[i].name + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '"></span>					</div>					<label class="tm-ui-tree-name" id="tm-tree-name-' + childrenData[i].opid + '">						<a href=' + childrenData[i].url + ' title="' + childrenData[i].name + '" opid="' + childrenData[i].opid + '" pid="' + rootData.opid + '" ' + opts.elements + '>' + childrenData[i].name + '</a>					</label>				</div>			</li>';
                            }
                        }
                    }
                    rootHTML += "</ul>";
                    rootHTML += '</li>';
                }
                return rootHTML;
            } else {
                if (isEmpty(opts.type)) {
                    return '<li id="tm-tree-' + rootData.opid + '" class="last" opid="' + rootData.opid + '">	<div class="">		<div class="node"></div>		<div class="file"></div>		<label class="tm-ui-tree-name" id="tm-tree-name-' + rootData.opid + '">			<a href=' + rootData.url + 'opid="' + rootData.opid + '" ' + opts.elements + '>' + rootData.name + '</a>		</label>	</div></li>';
                } else {
                    if (isNotEmpty(rootData.mark) && rootData.mark == "check") {
                        rootData.mark = "tm-tree-checkbox-checked";
                    } else {
                        rootData.mark = "";
                    }
                    return '<li id="tm-tree-' + rootData.opid + '" class="last" opid="' + rootData.opid + '"> 	<div class="">		<div class="node"></div>		<div class="file"></div>		<div class="file_' + opts.type + '">			<span class="tm-tree-' + opts.type + ' ' + rootData.mark + '" data-title="' + rootData.name + '" opid="' + rootData.opid + '"></span>		</div>		<label class="tm-ui-tree-name" id="tm-tree-name-' + rootData.opid + '">			<a href=' + rootData.url + ' opid="' + rootData.opid + '" ' + opts.elements + '>' + rootData.name + '</a>		</label>	</div></li>';
                }
            }
        }
        function getTreeLine(numberLine) {
            var line = "";
            for (var i = 0; i < numberLine; i++) {
                line += "<div class='line'></div>";
            }
            return line;
        }
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
        function jsSearch(obj) {
        	setTimeout(function(){
	            var val = $(obj).find(".search_in").val().trim();
	            var tree = $(obj).find(".tree .tm-ui-tree-name");
	            tree.find("a").css("color", "#183152");
	            $(obj).find(".tree .toggle").removeClass("first_collapsable").addClass("expandable");
	            $(obj).find(".tree .father").next().hide();
	            if (isNotEmpty(val)) {
	            	var searchLiDom = "";
	                tree.each(function(i) {
	                    var treeVal = $(this).text();
	                    if (treeVal.toLowerCase().indexOf(val.toLowerCase()) != -1) {
	                        //$(this).find("a").css("color", "red");
	                        $(this).parent().find(".toggle").removeClass("first_collapsable").addClass("expandable");
	                        $(this).parent().next().hide();
	                        $(this).parents("ul").each(function() {
	                            $(this).show();
	                        });
	                        
	                        searchLiDom += "<li style='line-height:23px;'><div class='folder_checkbox_expandable'>"+$(this).prev().html()+"</div><label class='tm-ui-tree-name'>"+$(this).html()+"</label></li>";
	                        
	                        var liDom = $(this).parents("li");
	                        liDom.each(function(i) {
	                            $(this).children(".father").find(".toggle").removeClass("expandable").addClass("first_collapsable");
	                            liDom.eq(0).children(".father").find(".toggle").removeClass("first_collapsable").addClass("expandable");
	                        });
	                    }
	                });
	                
	                $(obj).find("#treeRoot").hide();
                    $(obj).find("#searchRoot").show();
	                $(obj).find("#searchRoot .searchList").html("").append(searchLiDom);
	                
	                if (tree.text().toLowerCase().indexOf(val.toLowerCase()) == -1) {
	                    $(obj).find(".inputclear").removeClass("cd").removeClass("cb").addClass("tm_red");
	                } else {
	                    $(obj).find(".inputclear").removeClass("cd").removeClass("tm_red").addClass("cb");
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
        
        function initEvent($this, opts) {
        	
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
           $this.mousedown(function(e) {
                e = e || window.event || arguments.callee.caller.arguments[0];
                stopPropagation(e);
           });
        	
           $this.click(function(e) {
                e = e || window.event || arguments.callee.caller.arguments[0];
                stopPropagation(e);
           });
        	
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
           
            if (opts.showSearch && opts.searchMethod == "js") {
                $this.find(".rootDiv,#treeWrap").css({
                    "margin-top": "0px"
                });
                $this.find(".searchbutton").click(function() {
                	setTimeout(function(){
						$this.find("#overlay").show();
					},0);
                    jsSearch($this);
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
                    setTimeout(function(){
						$this.find("#overlay").show();
					},0);
                    jsSearch($this);
                });
               
                $this.find(".search_in").keydown(function(e) {
                    var e = e || window.event || arguments.callee.caller.arguments[0];
                    if (e.keyCode == 13) {
                    	setTimeout(function(){
    						$this.find("#overlay").show();
    					},0);
                        jsSearch($this);
                    }
                });
                //事件委托
                $this.find("#searchRoot").bind("click",function(e){
                	e = e || window.event || arguments.callee.caller.arguments[0];
                	var target = e.target || e.srcElement;
                	if(target.nodeName.toLowerCase() == "span"){
                		var opid = target.getAttribute("opid");
                		$this.find("#treeRoot .tree #tm-tree-name-"+opid).prev().find(".tm-tree-" + opts.type).trigger("click");
                		var newClassName = $this.find("#treeRoot .tree #tm-tree-name-"+opid).prev().find(".tm-tree-" + opts.type).attr("class");
                		//给目标对象添加class样式
                		target.className = newClassName;
                		//同步状态
                		jsSearch($this);
            		}
                });
            }
            if (opts.showSearch && opts.searchMethod == "java") {
                $this.find(".rootDiv").css({
                    "margin-top": "40px"
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
            $this.find(".tm-ui-tree-name").hover(function() {
                $(this).parent().addClass("tm_ccc");
            }, function() {
                $(this).parent().removeClass("tm_ccc");
            });
            $this.find(".tm-tree-expand-down").on("click", function() {
                $this.find(".expandable").addClass("first_collapsable");
                $this.find(".expandable").removeClass("expandable");
                $this.find("ul").show();
            });
            $this.find(".tm-tree-expand-up").on("click", function() {
                $this.find(".first_collapsable").addClass("expandable");
                $this.find(".first_collapsable").removeClass("first_collapsable");
                $this.find("ul").hide();
                $this.find(".tree").show();
            });
            $this.find(".tm-tree-close").on("click", function() {
                $this.hide();
            });
            if (isNotEmpty(opts.expandCount) && opts.expandCount != 0) {
                var $li = $this.find(".tree").children("li").eq((opts.expandCount - 1));
                $li.find("ul").show();
                $li.find(".expandable").removeClass("expandable").addClass("first_collapsable");
            }
            if (!opts.isRadio) {
                var i = 0,j = 0,temp1 = "",temp2 = "";
                $this.find(".tm-tree-" + opts.type).click(function() {
                    if (opts.limit) {
                        if (i+j < 10) {
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
                                    layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                        icon: 1,
                                        skin: 'layer-ext-moon'
                                    });
                                    return false;
                                }
                            //点击子节点
                            } else if (!$(this).hasClass("limit")) {
                                var parentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-checked");
                                var parentFocus = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("tm-tree-checkbox-focus");
                                var hasParentChecked = $(this).parents(".treeFolder").find(".father:first").find(".limit").hasClass("parentChecked");
                                //父节点没有选中并且父节点不是原始已选数据则++
                                if (!parentChecked && !parentFocus && !hasParentChecked) {
                                    layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                        icon: 1,
                                        skin: 'layer-ext-moon'
                                    });
                                    return false;
                                }
                            }
                        }
                        
                        if (i+j < 10) {
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
                                	layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                        icon: 1,
                                        skin: 'layer-ext-moon'
                                    });
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
                                    layer.alert('选择的数据过大，请先保存再进行下面操作', {
                                        icon: 1,
                                        skin: 'layer-ext-moon'
                                    });
                                    return false;
                                }
                            }
                        }
                    }
                    
                    //打钩取消操作
                    var opid = $(this).attr("opid");
                    var pid = $(this).attr("pid");
                    var $parent = $this.find("#treeRoot #tm-tree-" + opid);
                    var $parents = $this.find("#treeRoot #tm-tree-" + pid);
                    if (!$(this).hasClass("tm-tree-" + opts.type + "-checked")) {
                    	//打钩
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
                    	//取消打钩
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
                        if (name.indexOf("-") != -1) {
                            name = name.split("-")[1].replace(/[\t|\n|\s+]/g, "");
                        } else {
                            name = $(this).parent().next().text().replace(/[\t|\n|\s+]/g, "");
                        }
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
                            if (pNames.indexOf("-") != -1) {
                                pNames = pNames.split("-")[1].replace(/[\t|\n|\s+]/g, "");
                            } else {
                                pNames = $(this).parent().next().text().replace(/[\t|\n|\s+]/g, "");
                            }
                            pName.push(pNames);
                        }
                        );
                        var name = $(this).parent().next().text();
                        if (name.indexOf("-") != -1) {
                            name = name.split("-")[1].replace(/[\t|\n|\s+]/g, "");
                        } else {
                            name = $(this).parent().next().text().replace(/[\t|\n|\s+]/g, "");
                        }
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
           /* $this.find(".tm-ui-tree-name").click(function() {
                $(this).prev().find("span").trigger("click");
            });*/
            if (opts.iconFolder) {
                $(".file").addClass("folder_expandable");
                $(".folder_expandable").removeClass("file");
            }
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
        $.fn.kimTree.defaults = {
            root: [{
                name: "主题框架1",
                url: "",
                opid: 1,
                pid: "root1",
                mark: "focus",
                label: "disable"
            }, {
                name: "主题框架2",
                url: "",
                opid: 2,
                pid: "root2"
            }, {
                name: "主题框架3",
                url: "",
                opid: 3,
                pid: "root3"
            }, {
                name: "主题框架4",
                url: "",
                opid: 4,
                pid: "root4"
            }, {
                name: "主题框架5",
                url: "",
                opid: 5,
                pid: "root5"
            }, {
                name: "主题框架6",
                url: "",
                opid: 6,
                pid: "root6"
            }],
            children: {
                root1: [{
                    name: "框架11",
                    url: "javascript:void(0);",
                    opid: 11,
                    pid: "c11",
                    mark: "check",
                    label: "limit"
                }, {
                    name: "框架12",
                    url: "javascript:void(0);",
                    opid: 12,
                    pid: "c12",
                    mark: "check"
                }, {
                    name: "框架13",
                    url: "javascript:void(0);",
                    opid: 13,
                    pid: "c13",
                    mark: "check"
                }],
                root2: [{
                    name: "框架21",
                    url: "javascript:void(0);",
                    opid: 21,
                    pid: "c21",
                    mark: "check"
                }, {
                    name: "框架22",
                    url: "javascript:void(0);",
                    opid: 22,
                    pid: "c22"
                }, {
                    name: "框架23",
                    url: "javascript:void(0);",
                    opid: 23,
                    pid: "c23"
                }],
                root3: [{
                    name: "框架31",
                    url: "javascript:void(0);",
                    opid: 31,
                    pid: "c31"
                }, {
                    name: "框架32",
                    url: "javascript:void(0);",
                    opid: 32,
                    pid: "c32"
                }, {
                    name: "框架33",
                    url: "javascript:void(0);",
                    opid: 33,
                    pid: "c33"
                }],
                root4: [{
                    name: "框架41",
                    url: "javascript:void(0);",
                    opid: 41,
                    pid: "c41"
                }, {
                    name: "框架42",
                    url: "javascript:void(0);",
                    opid: 42,
                    pid: "c42"
                }, {
                    name: "框架43",
                    url: "javascript:void(0);",
                    opid: 43,
                    pid: "c43"
                }],
                c41: [{
                    name: "框架41",
                    url: "javascript:void(0);",
                    opid: 411,
                    pid: "c411"
                }, {
                    name: "框架42",
                    url: "javascript:void(0);",
                    opid: 42,
                    pid: "c42"
                }, {
                    name: "框架43",
                    url: "javascript:void(0);",
                    opid: 43,
                    pid: "c43"
                }]
            },
            showSearch: true,
            searchMethod: "js",
            checkData: "",
            elements: "",
            selectClass: "",
            exclusion: true,
            rightMenu: false,
            expand: false,
            expandCount: 1,
            showClose: false,
            type: "",
            iconFolder: false,
            iconFile: false,
            icons: true,
            line: true,
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isRadio: false,
            limit: false,
            markParent: false,
            childrenSelected: false,
            parentSelected: false,
            to: "",
            ctrl: false,
            border: "",
            onclick: function($obj, data) {}
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
                stopPropagation(e);
            },
            _childrenHide: function(pid) {
                var childrenArr = this._getAllChlidren(pid);
                if (childrenArr.length > 0) {
                    for (var i = 0, cArrLen = childrenArr.length; i < cArrLen; i++) {
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
                var opts = $.extend({
                    target: $("#tm_tbody")
                }, options);
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
                var html = "",n = 1;
                for (var i = 0, initRootLen = root.length; i < initRootLen; i++, n++) {
                    var data = root[i];
                    var chhtml = "<img id=\"tm_items_expand_" + data.pid + "\"  class=\"tm-icon\" style=\"CURSOR: pointer;\"  onclick=\"$.kimTree._expand(" + data.pid + ",this,event);\" src=\"../../images/treetable/plus.gif\"><img style=\"position: relative;top:2px;\"  src=\"../../images/treetable/fshut.gif\">";
                    if (isEmpty(children[data.pid])) {
                        chhtml = "<img class=\"tm_tree_leaf tm-icon \"  src=\"../../images/treetable/leaf.gif\">";
                    }
                    html += "<tr id=\"tm_items_" + data.opid + "\" isStatus=\"" + data.publishFlag + "\" parentId=\"" + data.parentId + "\"  opid=\"" + data.opid + "\" isRoot=\"1\"  title=\"" + data.name + "\" isOpen=\"0\" class=\"tm-items\"><td></td><td><span class=\"tm_sort\">" + n + "</span></td><td>" + chhtml + "<a href=\"javascript:void(0)\" class=\"tmui-name\">" + data.name + "</a></td><td><span class=\"tm_publish\">" + data.publish + "</span></td><td><span class=\"tmui-buttons none\" style=\"position: relative;left: 15px;\" ><a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmChannel._edit(this)\"><img src=\"../../images/admin/edit.png\" height=\"12\" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmTable._delete(this)\"><img src=\"../../images/admin/delete.png\" height=\"12\"></a></span></td></tr>";
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
                        for (var i = 0,childArrLen = childrenArr.length; i < childArrLen; i++, n++) {
                            var data = childrenArr[i];
                            var chhtml = "<img id=\"tm_items_expand_" + data.pid + "\" style=\"CURSOR: pointer;\" class=\"tm-icon\" onclick=\"$.kimTree._expand(" + data.pid + ",this,event);\" src=\"../../images/treetable/plus.gif\"><img style=\"position: relative;top:2px;\" src=\"../../images/treetable/fshut.gif\">";
                            if (isEmpty(children[data.pid])) {
                                chhtml = "<img class=\"tm_tree_leaf tm-icon\"  src=\"../../images/treetable/leaf.gif\">";
                            }
                            html += "<tr id=\"tm_items_" + data.opid + "\" isStatus=\"" + data.publishFlag + "\"  parentId=\"" + data.parentId + "\" opid=\"" + data.opid + "\" title=\"" + data.name + "\" class=\"tm-items tm-items-children tm_children_" + pid + "\"><td></td><td><span class=\"tm_sort\">" + this._getTreeLine(treeBlankCount) + n + "</span></td><td>" + this._getTreeLine(treeBlankCount) + chhtml + "<a href=\"javascript:void(0)\" class=\"tmui-name\">" + data.name + "</a></td><td><span class=\"tm_publish\">" + data.publish + "</span></td><td _td_pro=\"rd\"><span class=\"tmui-buttons none\" style=\"position: relative;left: 15px;\" ><a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmChannel._edit(this)\"><img src=\"../../images/admin/edit.png\" height=\"12\" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href=\"javascript:void(0)\" opid=\"" + data.opid + "\" onclick=\"$.tmTable._delete(this)\"><img src=\"../../images/admin/delete.png\" height=\"12\"></a></span></td></tr>";
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
                    for (var i = 0, cArrLen = childrenArr.length; i < cArrLen; i++) {
                        this._getAllChlidren(childrenArr[i].pid);
                        tableTreeArr.push(childrenArr[i].pid);
                    }
                }
                return tableTreeArr;
            }
        };
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
        function stopPropagation(e) {
            if (e && e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.cancelBubble = true;
            }
        }
    })(jQuery);
})();
