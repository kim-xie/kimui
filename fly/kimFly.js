(function ($) {
	// 扩展jquery的fn对象
	$.fn.kimFly = function (options) {
	    var opts = $.extend({},$.fn.kimFly.methods,$.fn.kimFly.defaults,options);
		this.each(function(){
			console.log($(this))
		    console.log(opts)
			opts.init($(this),opts);
		});
	};

    // 默认方法
	$.fn.kimFly.methods = {
		init : function($fly,opts){
			this.setOptions($fly,opts);
			!!opts.autoPlay && this.play($fly,opts);
		},
		/**
		 * 设置组件参数
		 */
		setOptions: function ($fly,opts) {

		  //设置初始样式
		  $fly.css({marginTop: '0px', marginLeft: '0px', position: 'fixed'}).appendTo('body');

		  // 运动过程中有改变大小
		  if (opts.end.width != null && opts.end.height != null) {
		        //初始大小
				$.extend(true, opts.start, {
					width: $fly.width(),
					height: $fly.height()
				});
		  }

		  // 运动轨迹最高点top值
		  var vertex_top = Math.min(opts.start.top, opts.end.top) - Math.abs(opts.start.left - opts.end.left) / 3;
		  if (vertex_top < opts.vertex_Rtop) {
				// 可能出现起点或者终点就是运动曲线顶点的情况
				vertex_top = Math.min(opts.vertex_Rtop, Math.min(opts.start.top, opts.end.top));
		  }

		  /**
		   * ======================================================
		   * 运动轨迹在页面中的top值可以抽象成函数 y = a * x*x + b;
		   * a = curvature
		   * b = vertex_top
		   * ======================================================
		   */

		    var distance = Math.sqrt(Math.pow(opts.start.top - opts.end.top, 2) + Math.pow(opts.start.left - opts.end.left, 2)),
			// 元素移动次数
			steps = Math.ceil(Math.min(Math.max(Math.log(distance) / 0.05 - 75, 30), 100) / opts.speed),
			ratio = opts.start.top == vertex_top ? 0 : -Math.sqrt((opts.end.top - vertex_top) / (opts.start.top - vertex_top)),
			vertex_left = (ratio * opts.start.left - opts.end.left) / (ratio - 1),
			// 特殊情况，出现顶点left==终点left，将曲率设置为0，做直线运动。
			curvature = opts.end.left == vertex_left ? 0 : (opts.end.top - vertex_top) / Math.pow(opts.end.left - vertex_left, 2);

		    $.extend(true, opts, {
				count: -1, // 每次重置为-1
				steps: steps,
				vertex_left: vertex_left,
				vertex_top: vertex_top,
				curvature: curvature
		    });
		},
		/**
		 * 开始运动
		 */
		play: function ($fly,opts) {
			console.log("---"+opts)
		    this.move($fly,opts);
		},
		/**
		 * 按step运动
		 */
		move: function($fly,opts){
			var $this = this;
			console.log("==="+opts)
			var count = opts.count,
			    steps = opts.steps,
				start = opts.start,
			    end = opts.end;

			// 计算left top值
			var left = start.left + (end.left - start.left) * count / steps,
				top = opts.curvature == 0 ? start.top + (end.top - start.top) * count / steps : opts.curvature * Math.pow(left - opts.vertex_left, 2) + opts.vertex_top;
		      
		    // 运动过程中有改变大小
		    if (end.width != null && end.height != null) {
				var i = steps / 2,
					width = end.width - (end.width - start.width) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2),
					height = end.height - (end.height - start.height) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2);
					$fly.css({width: width + "px", height: height + "px", "font-size": Math.min(width, height) + "px"});
		     }
		     $fly.css({
				left: left + "px",
				top: top + "px"
		     });
		     opts.count++;

		     // 定时任务
		     var time = window.requestAnimationFrame($.proxy($this.move, $this));
		     if (count == steps) {
				window.cancelAnimationFrame(time);
				// fire callback
				opts.onEnd.apply($this);
		     }
		},
		/**
		 * 销毁
		 */
		destroy: function($fly){
			$fly.remove();
		}

	};
        
	//默认参数
	$.fn.kimFly.defaults = {
	      autoPlay: true,
	      vertex_Rtop: 20, // 默认顶点高度top值
	      speed: 1.2,      //动画执行的速度
	      start: {},       //内置的属性有：top, left, width, height
	      end: {},         //内置的属性有：top, left, width, height
	      onEnd: $.noop
	};
  
})(jQuery);