(function($) {	
	$.fn.feedback = function(options) {
		$.fn.feedback.$this = $(this);
		
		var $this = $(this);
		var settings = $(this).data($.fn.feedback.pluginName);
		//如果获取settings失败，则根据options和default创建它
		if (settings === undefined) {
			settings = $.extend({}, $.fn.feedback.defaults, options); 
			// 保存我们新创建的settings
			$(this).data($.fn.feedback.pluginName, settings);
		}
		
		init_dialog($this, settings);
		return $this;
	}; 

	// 初始化反馈对话框
	$.fn.feedback.init = function () {
		var settings = $.fn.feedback.getOption();
		
		settings.beforeinit === undefined || settings.beforeinit();
		if (settings.dialogid != undefined)
		{
			drag_jq(settings, settings.dialogid);
			$(settings.dialogid).attr(settings.flagdialog, $.fn.feedback.DIALOG_PREVENT);
			$(settings.dialogid).find(".submit").on('click', function () {
				if (settings.onsubmit === undefined)
				{
					default_onsubmit();
				}
				else
				{
					settings.onsubmit();
				}
			});
			
			$(settings.dialogid).find(".cancel").on('click', function () {
				settings.beforecancel === undefined || settings.beforecancel();
				$.fn.feedback.closeDialog($.fn.feedback.$this, settings);
				settings.aftercancel === undefined || settings.aftercancel();
			});
		}
		settings.afterinit === undefined || settings.afterinit();
		$.fn.feedback.init_flag = true;
	};
	
	// 开始进行反馈标注
	$.fn.feedback.start = function () {
		var settings = $.fn.feedback.getOption();

		settings.beforestart === undefined || settings.beforestart();
		var unit = settings.unit;
		$.fn.feedback.unit = unit.split(",");
		for (var i = 0, len = $.fn.feedback.unit.length; i < len; i++)
		{
			$.fn.feedback.unit[i] = trim($.fn.feedback.unit[i]).toLowerCase();
		}
	    
	    bind_event($.fn.feedback.$this, settings);
	    settings.afterstart === undefined || settings.afterstart();
	};
	
	// 结束反馈标注
	$.fn.feedback.stop = function () {
		var settings = $.fn.feedback.getOption();
		
		settings.beforestop === undefined || settings.beforestop();
		remove_all_tags($.fn.feedback.$this, settings);
	    unbind_event($.fn.feedback.$this, settings);
	    settings.afterstop === undefined || settings.afterstop();
	};
	
	$.fn.feedback.pluginName = "feedback";
	$.fn.feedback.defaults = {
		/** 和样式相关的配置 **/
		'unit'		: 'div,span,p,h1,h2,h3,h4,h5,h6,td,th,tr,table,a,strong,em,input,i,button,textarea,b,img,hr',	// 允许的标签
		'background': "#00FF00",	// 鼠标点击后的样式 
		'opacity'	: 50,			// 鼠标点击后的透明度
		'border'		: undefined, // shade元素边框样式, 样例："1px solid #000000",
		'tempbackground': "#FFFF00",	// 鼠标经过时的样式
		'tempopacity'	: 50,			// 鼠标经过时的透明度
		'tempborder'	: undefined,	// 鼠标经过时的shade元素边框样式
		'zIndex'	: 1000,		// shade元素的zindex，close元素的zindex=zIndex+1
		'minwidth'	: 0,		// 可点选元素的最小宽度
		'maxwidth'	: 2000,		// 可点选元素的最大宽度
		'minheight'	: 0,		// 可点选元素的最小高度
		'maxheight'	: 200,		// 可点选元素的最大高度
		'mintext'	: 0,		// 可点选元素的最少字数
		'maxtext'	: 2000000,	//可点选元素的最大字数
		'allowsub'	: true,		// 选中父元素之后，是否还保留子元素
		
		/** 和弹出dialog相关的配置 **/
		'initdialog': undefined,
		'dialogid'	: undefined,
		
		/** 可以设置的回调事件 **/
		'beforeinit'	: undefined,	// 初始化反馈对话框之前
		'afterinit'		: undefined,	// 初始化反馈对话框完成
		'beforestart'	: undefined,	// 开始标注之前
		'afterstart'	: undefined,
		'beforestop'	: undefined,	// 停止标注之前
		'afterstop'		: undefined,
		'beforecancel'	: undefined,	// 取消标注之前
		'aftercancel'	: undefined,
		'onsubmit'		: undefined,	// 点击提交按钮的时候触发
		
		/** 以下回调事件可增加参数e **/
		'beforemouseover'	: undefined,	// 标注时鼠标经过元素
		'aftermouseover'	: undefined,	
		'beforemouseout'	: undefined,	// 标注时鼠标离开元素
		'aftermouseout'		: undefined,	
		'beforemousedown'	: undefined,	// 标注时鼠标点击落下
		'aftermousedown'	: undefined,	
		
		/** 以下一般不需要修改 **/
		'dialogclass'	: 'jquery-feedback-drag',		// dialog元素的class
		'dialogtopclass': 'jquery-feedback-drag-top',	// dialog元素顶部的class
		'shadeidprefix'	: 'fb_shade_',			// shade元素的id前缀
		'closeidprefix'	: 'fb_close_',			// close元素的id前缀
		'feedbackclass'	: 'jquery-feedback',	// feedback shade的class，如有重名，可用新名称覆盖
		'closetext'	: '&times;',				// close按钮的文本
		'closeposition'	: 'right-up',			// close按钮的位置
		'closeclass': 'jquery-feedback-close',	// feedback close按钮的class
		'closefontsize'	: 24,					// close按钮的文本自号
		'closefontweight'	: 900,				// close按钮的font-weight
		'closewidth': 13,						// 根据closewidth和closeheight设置close按钮的位移（以shade右上角为基准）
		'closeheight'	: 7,
		'flagdialog'	: 'jq-flag-dialog',
		'flagshade'		: 'jq-flag-shade',
		'flagclose'		: 'jq-flag-close',
		'flagindex'		: 'jq-flag-index'
	};
	$.fn.feedback.target = new Array();
	$.fn.feedback.shade = new Array();
	$.fn.feedback.close = new Array();
	$.fn.feedback.index = 0;
	$.fn.feedback.SHADE_TEMP = "1";
	$.fn.feedback.SHADE_CLICK = "2";
	$.fn.feedback.DIALOG_PREVENT = "10";
	
	$.fn.feedback.target_temp = undefined;
	$.fn.feedback.shade_temp = undefined;
	$.fn.feedback.close_temp = undefined;
	$.fn.feedback.init_flag = false;
	
	$.fn.feedback.dialog_button_html = '<div class="jquery-feedback-drag-bottom">\
		<button class="jquery-feedback-button white submit">提交反馈</button>\
		<button class="jquery-feedback-button white cancel">取消</button>\
	</div>';
	
	/**
	 * 返回配置
	 */
	$.fn.feedback.getOption = function () {
		var settings = $.fn.feedback.$this.data($.fn.feedback.pluginName);	
		if (settings === undefined)
		{
			settings = $.fn.feedback.defaults;
		}
		return settings;
	};
	
	/**
	 * 增加配置
	 */
	$.fn.feedback.addUnit = function (unit) {
		var unit_array = unit.split(",");
		for (var i = 0, len = unit_array.length; i < len; i++)
		{
			$.fn.feedback.unit.push(unit_array[i]);
		}
	};
	
	/**
	 * 删减配置
	 */
	$.fn.feedback.removeUnit = function (unit) {
		var unit_array = unit.split(",");
		for (var i = 0, len = unit_array.length; i < len; i++)
		{
			remove_unit(unit_array[i]);
		}
	};
	
	/**
	 * 获得所有target，以jquery数组的形式返回
	 */
	$.fn.feedback.getHtmlJQ = function () {
		var html = new Array();
		for (var i = 0, len = $.fn.feedback.target.length; i < len; i++)
		{
			if ($.fn.feedback.target[i] === undefined)
			{
				continue;
			}
			html.push($.fn.feedback.target[i]);
		}
		
		return html;
	};
	
	/**
	 * 获得所有target，以html代码数组的形式返回
	 */
	$.fn.feedback.getHtmlArray = function () {
		var html = $.fn.feedback.getHtmlJQ();
		return html.map(function (val) {
			return val.html();
		});
	};
	
	/**
	 * {
	 * 		'html'	: html()
	 * 		'key'	: jquery_function_name()
	 * }
	 */
	$.fn.feedback.getResult = function (options) {
		var html = $.fn.feedback.getHtmlJQ();
		var i, func, option_name, option_func, option_object;
		var result_array = new Array();
		for (i = 0, len = html.length; i < len; i++)
		{
			option_object = {};
			for (option_name in options)
			{
				option_func = options[option_name];
				option_object[option_name] = eval("html[i]." + option_func);
//				console.log(option_object[option_name]);
			}
			result_array.push(option_object);
		}
		return result_array;
	}
	
	/**
	 * 关闭feedback窗口
	 */
	$.fn.feedback.closeDialog = function () {
		var settings = $.fn.feedback.getOption();
		$(settings.dialogid).hide();
		$.fn.feedback.stop();
	}
	
	/**
	 * 默认的提交方式，如果自定义onsubmit的话，请参考如下方式：
	 * var fb;
	 * function submit() {
	 * 		// 使用变量，而非$.fn
	 * 		var settings = fb.feedback.getOption();
	 * 		...
	 * 		fb.feedback.closeDialog();
	 * }
	 * fb = $("body").feedback({
	 * 		'onsubmit': submit();
	 * });
	 */
	function default_onsubmit() {
		var settings = $.fn.feedback.getOption();
		var fb_result = $.fn.feedback.getResultString({
			'id'	: 'attr("id")',
			'html'	: 'html()'
		});
		var data = {
			'url'		: document.URL,
			'form'		: JSON.stringify($(settings.dialogid).find("form").serializeArray()),
			'feedback'	: fb_result,
			'cookie'	: document.cookie,
			'html'		: $("html").html()
		};
		
		if (settings.submiturl != undefined)
		{
			console.log(data);
			alert("反馈成功");	
		}	
		$.fn.feedback.closeDialog();
	}
	
	/**
	 * 将json array转化为字符串
	 */
	$.fn.feedback.getResultString = function (options) {
		return JSON.stringify($.fn.feedback.getResult(options));
	};
	


	
	
	/**
	 * 初始化dialog的操作
	 * @param $this
	 * @param settings
	 * @returns
	 */
	function init_dialog($this, settings)
	{
		if (settings.dialogid != undefined)
		{
			$(settings.dialogid).addClass(settings.dialogclass);
			$(settings.dialogid).hide();
		}
		
		if (settings.initdialog != undefined)
		{
			$(settings.initdialog).click(function (e) {
				e.preventDefault();
				if (! $this.feedback.init_flag)
				{
					$this.feedback.init();
				}
				
				$(settings.dialogid).show();
				$this.feedback.start();
			});
		}

		init_dialog_button($this, settings);
	}
	
	/**
	 * 初始化反馈对话框中的按钮
	 * @param $this
	 * @param settings
	 * @returns
	 */
	function init_dialog_button($this, settings)
	{
		$(settings.dialogid).append($.fn.feedback.dialog_button_html);
	}
	
	function index_of(val) 
	{
        for (var i = 0, len = $.fn.feedback.unit.length; i < len; i++)
        {
            if ($.fn.feedback.unit[i] === val) return i;
        }
        return -1;
    };
    
    function remove_unit(val) 
    {
        var index = index_of(val);
        index > -1 && $.fn.feedback.unit.splice(index, 1);
    };
    
	
	/**
	 * trim
	 */
	function trim(str)
	{
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
	
	/**
	 * 绑定事件
	 */
	function bind_event(obj, settings)
	{
		obj.mouseover(function (e) {
			settings.beforemouseover === undefined || settings.beforemouseover(e);
			mouseover(e, obj, settings);
			settings.aftermouseover === undefined || settings.aftermouseover(e);
		});
		obj.mouseout(function (e) {
			settings.beforemouseout === undefined || settings.beforemouseout(e);
			mouseout(e, obj, settings);
			settings.aftermouseout === undefined || settings.aftermouseout(e);
		});
		obj.mousedown(function (e) {
			settings.beforemousedown === undefined || settings.beforemousedown(e);
			mousedown(e, obj, settings);
			settings.aftermousedown === undefined || settings.aftermousedown(e);
		});
	}
	
	/**
	 * 解除事件绑定
	 */
	function unbind_event(obj, settings)
	{
		obj.unbind('mouseover');
		obj.unbind('mouseout');
		obj.unbind('mousedown');
	}
	
	/**
	 * 判断一个target是否符合要求
	 * @param target
	 * @param settings
	 * @returns
	 */
	function is_valid(target, settings)
	{
		//是一个shade元素
		if (target.attr(settings.flagshade) != undefined)
		{
			return target.attr(settings.flagshade);
		}
		if (target.attr(settings.flagdialog) != undefined)
		{
			return $.fn.feedback.DIALOG_PREVENT;
		}
		
		//是dialog或其子元素
		if (target.attr("id") === settings.dialogid || target.parents(settings.dialogid).length > 0)
		{
			return $.fn.feedback.DIALOG_PREVENT;
		}
		
		//不符合要求
		var flag = false;
		var tagName = trim(target.get(0).tagName).toLowerCase();
		for (var i = 0, len = $.fn.feedback.unit.length; i < len; i++)
		{
			if ($.fn.feedback.unit[i] === tagName)
			{
				flag = true;
				break;
			}
		}
		if (!flag) return -1;
		
		//不符合要求
		var width = target.width();
		var height = target.height();
		var length = target.text().length;

		if (width < settings.minwidth || width > settings.maxwidth
				|| height < settings.minheight || height > settings.maxheight
				|| length < settings.mintext || length > settings.maxtext)
		{
			return -1;
		}
		//ok
		return 0;
	}
	
	/**
	 * 生成一个Shade元素
	 */
	function getShade(target, settings, shade_id)
	{
		var l = target.offset().left;
		var t = target.offset().top;

		var shade = top.document.createElement("div");
		shade.style.width = target.width() + "px";
		shade.style.height = target.height() + "px";
		shade.style.backgroundColor = shade_id === $.fn.feedback.SHADE_TEMP ? settings.tempbackground : settings.background;
		shade.style.position = "absolute";
		shade.style.left = l + "px";
		shade.style.top = t + "px";
		shade.style.zIndex = settings.zIndex;
		var opacity = shade_id === $.fn.feedback.SHADE_TEMP ? settings.tempopacity : settings.opacity;
		
	    if(top.document.all)
	    {
	    	shade.style.filter = "alpha(opacity=" + opacity + ")";
	    }
	    else
	    {
	    	shade.style.opacity = opacity / 100;
	    }
	    
	    shade = $(shade);
	    
	    shade.attr(settings.flagshade, shade_id);
	    shade.addClass(settings.feedbackclass);
	    shade.attr("id", settings.shadeidprefix + $.fn.feedback.index);
	    shade.attr(settings.flagindex, $.fn.feedback.index);
	    settings.tempborder === undefined || shade.css("border", settings.tempborder);
	    
	    return shade;
	}
	
	/**
	 * 生成一个close元素
	 */
	function getClose(target, settings, shade_id)
	{
		var l = target.offset().left;
		var t = target.offset().top;
		
		if (settings.closeposition === "right-up")
		{
			l = l + target.width() - settings.closewidth;
			t = t - settings.closeheight;
		}
		else if (settings.closeposition === "left-up")
		{
			t = t - settings.closeheight;
		}

		var shade = top.document.createElement("div");
		shade.style.position = "absolute";
		shade.style.left = l + "px";
		shade.style.top = t + "px";
		shade.style.zIndex = settings.zIndex + 1;
	    
		shade = $(shade);
	    shade.html(settings.closetext);
	    shade.attr(settings.flagshade, shade_id);
	    shade.css('font-size', settings.closefontsize);
	    shade.css('font-weight', settings.closefontweight);
	    shade.addClass(settings.closeclass);
	    shade.attr("id", settings.closeidprefix + $.fn.feedback.index);
	    shade.attr(settings.flagindex, $.fn.feedback.index);
	    shade.attr(settings.flagclose, shade_id);
	    return shade;
	}
	
	function remove_all_tags($this, settings)
	{
		for (var i = 0, len = $.fn.feedback.shade.length; i < len; i++)
		{
			if ($.fn.feedback.shade[i] === undefined)
			{
				continue;
			}
			remove_shade($.fn.feedback.shade[i], settings);
		}
		$.fn.feedback.index = 0;
	}
	
	
	/**
	 * 删除一个shade元素
	 */
	function remove_shade(shade, settings)
	{
		var index = shade.attr(settings.flagindex);
		$("#" + settings.closeidprefix + index).remove();
		$("#" + settings.shadeidprefix + index).remove();
		// set to undefined
		$.fn.feedback.target.splice(index, 1, undefined);
		$.fn.feedback.shade.splice(index, 1, undefined);
		$.fn.feedback.close.splice(index, 1, undefined);
	}
	
	/**
	 * 鼠标离开一个元素如何处理
	 */
	function mouseout(e, obj, settings) {
		var target = $(e.target);
		// 离开target元素，说明此时生成了shade&close元素，覆盖在其上，因此不做进一步处理
		if ($.fn.feedback.target_temp != undefined && target[0] === ($.fn.feedback.target_temp)[0])
		{
			return;
		}
		
		// 移除记录
		if ($.fn.feedback.target_temp != undefined)
		{
			$.fn.feedback.shade_temp.remove();
			$.fn.feedback.close_temp.remove();
		}
	}
	
	/**
	 * 鼠标覆盖一个元素如何处理
	 */
	function mouseover(e, obj, settings) {
		var target = $(e.target);

		// 进入shade或者close元素，说明是新生成覆盖在target上导致，不做处理
		if (($.fn.feedback.shade_temp != undefined && $.fn.feedback.close_temp != undefined)
				&&
				(target[0] === ($.fn.feedback.shade_temp)[0] || target[0] === ($.fn.feedback.close_temp)[0]))
		{
			return;
		}
		
		// 移除原有的记录
		if ($.fn.feedback.target_temp != undefined)
		{
			$.fn.feedback.shade_temp.remove();
			$.fn.feedback.close_temp.remove();
		}
		
		// 判断是否有效
		var valid = is_valid(target, settings);
		if (valid < 0)
		{
			return;
		}
		else if (valid > 0)
		{
			return;
		}
		
		// 在target上面生成临时的shade&close，其中close先隐藏掉
		var shade = getShade(target, settings, $.fn.feedback.SHADE_TEMP);
		var close = getClose(target, settings, $.fn.feedback.SHADE_TEMP);
		close.hide();
		
		// 保存临时元素
		$.fn.feedback.target_temp = target;
		$.fn.feedback.shade_temp = shade;
		$.fn.feedback.close_temp = close;
		
		$.fn.feedback.$this.append(shade);
		$.fn.feedback.$this.append(close);
	}
	
	/**
	 * 指定一个新的target，判断是否之前有某些元素属于这个新的target
	 */
	function find_child(parentObj)
	{ 
		var obj;
		var children = new Array();
		for (var i = 0, len = $.fn.feedback.target.length; i < len; i++)
		{
			if ($.fn.feedback.target[i] === undefined)
			{
				continue;
			}
			obj = ($.fn.feedback.target[i])[0];
			while (obj != undefined && obj != null && obj.tagName.toLowerCase() != 'body')
			{ 
				if (obj === parentObj)
				{
					children.push($.fn.feedback.shade[i]);
					break;
				} 
				obj = obj.parentNode; 
			} 
		}
		return children;
	} 
	
	/**
	 * 鼠标点击落下
	 */
	function mousedown(e, obj, settings) {
		var target = $(e.target);
		// 只有点到了临时shade&close上才进行处理
		if (target.attr(settings.flagshade) != $.fn.feedback.SHADE_TEMP)
		{
			return;
		}
		
		// 点到close按钮，则移除它
		if (target.attr(settings.flagclose) === $.fn.feedback.SHADE_CLICK)
		{
			remove_shade(target, settings);
			return;
		}
		
		// 将临时的shade&close转换为非临时状态
		var shade = $.fn.feedback.shade_temp;
		var close = $.fn.feedback.close_temp;
		
		shade.css("background-color", settings.background);
		shade.css("border", "");
		settings.border === undefined || shade.css("border", settings.border);
		
		close.css("opacity", settings.opacity);
		shade.attr(settings.flagshade, $.fn.feedback.SHADE_CLICK);
		close.attr(settings.flagclose, $.fn.feedback.SHADE_CLICK);
		close.show();
		
		// 如果不允许有sub存在，那么将新target下面所有已经被选中的孩子都变成不选中状态
		if (!settings.allowsub)
		{
			var shade_children = find_child(($.fn.feedback.target_temp)[0]);
			for (var i = 0, len = shade_children.length; i < len; i++)
			{
				remove_shade(shade_children[i], settings);
			}
		}
		$.fn.feedback.target.push($.fn.feedback.target_temp);
		$.fn.feedback.target_temp = undefined;
		$.fn.feedback.shade.push(shade);
		$.fn.feedback.shade_temp = undefined;
		$.fn.feedback.close.push(close);
		$.fn.feedback.close_temp = undefined;
		$.fn.feedback.index++;
	}
	
	// jQuery方法定义的拖动
	function drag_jq(settings, dragContent)
	{
		var _drag = false, _x, _y, cw, ch, sw, sh;
		var dragContent = typeof dragContent == "undefined" ? dragControl : dragContent;
		
		$(dragContent).find("." + settings.dialogtopclass).mousedown(function(e){
			_drag = true;
			
			_x = e.pageX - parseInt($(dragContent).css("left"));
			_y = e.pageY - parseInt($(dragContent).css("top"));
			cw = $(window).width();
			ch = $(window).height();
			sw = parseInt($(dragContent).outerWidth());
			sh = parseInt($(dragContent).outerHeight());
			
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); //禁止拖放对象文本被选择的方法
			document.body.setCapture && $(dragContent)[0].setCapture(); // IE下鼠标超出视口仍可被监听
			
			$(document).mousemove(function(e){
				if (_drag) {
					var x = e.pageX - _x;
					var y = e.pageY - _y;
					x = x < 0 ? x = 0 : x < (cw-sw) ? x :(cw-sw);
					y = y < 0 ? y = 0 : y < (ch-sh) ? y :(ch-sh);
					
					$(dragContent).css({
						top: y,
						left: x
					});
				}
			}).mouseup(function(){
				_drag = false;
				document.body.releaseCapture && $(dragContent)[0].releaseCapture();
			});
		});
	}
})(jQuery);  
    

