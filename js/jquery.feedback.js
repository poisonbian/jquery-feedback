(function($) {	
	$.fn.feedback = function(options) {
		var settings = $(this).data($.fn.feedback.pluginName);
		//如果获取settings失败，则根据options和default创建它
		if (typeof(settings) === "undefined") {
			settings = $.extend({}, $.fn.feedback.defaults, options); 
			// 保存我们新创建的settings
			$(this).data($.fn.feedback.pluginName, settings);
		}
		
		var unit = settings.unit;
		$.fn.feedback.unit = unit.split(",");
		for (var i = 0; i < $.fn.feedback.unit.length; i++)
		{
			$.fn.feedback.unit[i] = $.fn.feedback.unit[i].replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
		}
	    
	    bind_event($(this), settings);
	    
	    return this.each(function ( ) {
	    	$this = $( this );
	    });
	}; 
	
	$.fn.feedback.pluginName = "feedback";
	$.fn.feedback.defaults = {    
		'unit'		: 'div,span,p,h1,h2,h3,h4,h5,h6,td,th,tr,table,a,strong,em,input,i,button,textarea,b,img',
		'background': "#FFFF00",
		'opacity'	: 60,	// 透明度
		'tempbackground': "#00FF00",
		'tempopacity'	: 60,
		'zIndex'	: 1000,	// zindex
		'minwidth'	: 0,	// 可点选元素的最小宽度
		'maxwidth'	: 2000,	// 可点选元素的最大宽度
		'minheight'	: 0,	// 可点选元素的最小高度
		'maxheight'	: 200,	// 可点选元素的最大高度
		/* 以下一般不需要修改 */
		'shadeidprefix'	: 'fb_shade_',		// shade元素的id前缀
		'closeidprefix'	: 'fb_close_',		// close元素的id前缀
		'feedbackclass'	: 'jquery-feedback',	// feedback shade的class，如有重名，可用新名称覆盖
		'closetext'	: '&times;',				// close按钮的文本
		'closeposition'	: 'right-up',			// close按钮的位置
		'closeclass': 'jquery-feedback-close',	// feedback close按钮的class
		'closefontsize'	: 24,			// close按钮的文本自号
		'closefontweight'	: 900,		// close按钮的font-weight
		'closewidth': 13,		// 根据closewidth和closeheight设置close按钮的位移（以shade右上角为基准）
		'closeheight'	: 7,
		
		'mouseover': function (e) {
			mouseover(e, $(this));
		},
		'mousedown'	: function (e) {
			mousedown(e, $(this));
		}
	};
	$.fn.feedback.target = new Array();
	$.fn.feedback.shade = new Array();
	$.fn.feedback.close = new Array();
	$.fn.feedback.index = 0;
	$.fn.feedback.SHADE_TEMP = 1;
	$.fn.feedback.SHADE_CLICK = 2;
	
	$.fn.feedback.target_temp = undefined;
	$.fn.feedback.shade_temp = undefined;
	$.fn.feedback.close_temp = undefined;
	
	$.fn.feedback.getOption = function () {
		var settings = $(this).data($.fn.feedback.pluginName);
		if (typeof(settings) === "undefined") {
			settings = $.fn.feedback.defaults;
		}
		return settings;
	};
	
	$.fn.feedback.getHtml = function () {
		var html = "";
		for (var i in $.fn.feedback.target)
		{
			if (typeof($.fn.feedback.target[i]) == "undefined")
			{
				continue;
			}
			html += $.fn.feedback.target[i].html() + "\r\n";
		}
		
		return html;
	};
	
	function bind_event(obj, settings)
	{   		
		obj.mouseover(obj.data($.fn.feedback.pluginName).mouseover);
		obj.mousedown(obj.data($.fn.feedback.pluginName).mousedown);
	}
	
	function is_valid(target, settings)
	{
		//是一个shade元素
		if (target.attr("shade") != undefined)
		{
			return target.attr("shade");
		}
		
//		for (var i in $.fn.feedback.target)
//		{
//			if ($.fn.feedback.target[i] == target)
//			{
//				return -1;
//			}
//		}
		
		//不符合要求
		var flag = false;
		var tagName = target.get(0).tagName.replace(/(^\s*)|(\s*$)/g, "").toLowerCase();
		for (var i = 0; i < $.fn.feedback.unit.length; i++)
		{
			if ($.fn.feedback.unit[i] == tagName)
			{
				flag = true;
				break;
			}
		}
		if (!flag) return -1;
		
		//不符合要求
		var width = target.width();
		var height = target.height();
//		console.log(settings);
		if (width < settings.minwidth || width > settings.maxwidth
				|| height < settings.minheight || height > settings.maxheight)
		{
			return -1;
		}
		//ok
		return 0;
	}
	
	function getShade(target, settings, shade_id)
	{
		var l = target.offset().left;
		var t = target.offset().top;

		var shade = top.document.createElement("div");
		shade.style.width = target.width() + "px";
		shade.style.height = target.height() + "px";
		shade.style.backgroundColor = shade_id == $.fn.feedback.SHADE_TEMP ? settings.tempbackground : settings.background;
		shade.style.position = "absolute";
		shade.style.left = l + "px";
		shade.style.top = t + "px";
		shade.style.zIndex = settings.zIndex;
		var opacity = shade_id == $.fn.feedback.SHADE_TEMP ? settings.tempopacity : settings.opacity;
		
	    if(top.document.all)
	    {
	    	shade.style.filter = "alpha(opacity=" + opacity + ")";
	    }
	    else
	    {
	    	shade.style.opacity = opacity / 100;
	    }
	    
	    $(shade).attr("shade", shade_id);
	    $(shade).addClass(settings.feedbackclass);
	    $(shade).attr("id", settings.shadeidprefix + $.fn.feedback.index);
	    $(shade).attr("index", $.fn.feedback.index);
	    return shade;
	}
	
	function getClose(target, settings, shade_id)
	{
		var l = target.offset().left;
		var t = target.offset().top;
		
		if (settings.closeposition == "right-up")
		{
			l = l + target.width() - settings.closewidth;
			t = t - settings.closeheight;
		}
		else if (settings.closeposition == "left-up")
		{
			t = t - settings.closeheight;
		}

		var shade = top.document.createElement("div");
		shade.style.position = "absolute";
		shade.style.left = l + "px";
		shade.style.top = t + "px";
		shade.style.zIndex = settings.zIndex + 1;
	    
	    $(shade).html(settings.closetext);

	    $(shade).attr("shade", shade_id);
	    $(shade).css('font-size', settings.closefontsize);
	    $(shade).css('font-weight', settings.closefontweight);
	    $(shade).addClass(settings.closeclass);
	    $(shade).attr("id", settings.closeidprefix + $.fn.feedback.index);
	    $(shade).attr("index", $.fn.feedback.index);
	    $(shade).attr("close", shade_id);
	    return shade;
	}
	
	function remove_shade(target, settings)
	{
		var index = target.attr('index');
		$("#" + settings.closeidprefix + index).remove();
		$("#" + settings.shadeidprefix + index).remove();
		delete($.fn.feedback.target[index]);
		delete($.fn.feedback.shade[index]);
		delete($.fn.feedback.close[index])
	}
	
	function mouseover(e, obj) {
		var target = $(e.target);
		// target没有变化，或者是其覆盖元素
		if (e.target == $.fn.feedback.target_temp || e.target == $.fn.feedback.shade_temp || e.target == $.fn.feedback.close_temp)
		{
			return;
		}
		
		// 移除原有的记录
		if ($.fn.feedback.target_temp != undefined)
		{
			$($.fn.feedback.shade_temp).remove();
			$($.fn.feedback.close_temp).remove();
		}
		
		var settings = obj.data($.fn.feedback.pluginName);
		
		var valid = is_valid(target, settings);
		if (valid < 0)
		{
			return;
		}
		else if (valid > 0)
		{
			return;
		}
		
		//1表示临时
		var shade = getShade(target, settings, $.fn.feedback.SHADE_TEMP);
		var close = getClose(target, settings, $.fn.feedback.SHADE_TEMP);
		
		$.fn.feedback.target_temp = e.target;
		$.fn.feedback.shade_temp = shade;
		$.fn.feedback.close_temp = close;
		
	    document.body.appendChild(shade);
	    document.body.appendChild(close);
	}
	
	function mousedown(e, obj) {
		var target = $(e.target);
		if (target.attr("shade") != $.fn.feedback.SHADE_TEMP)
		{
			return;
		}
		
		var settings = obj.data($.fn.feedback.pluginName);
		
		if (target.attr("close") == 1)
		{
			remove_shade(target, settings);
			return;
		}
		
		var shade = $.fn.feedback.shade_temp;
		var close = $.fn.feedback.close_temp;
		
		$(shade).css("background-color", settings.background);
		$(close).css("opacity", settings.opacity);
		
		$.fn.feedback.target.push($.fn.feedback.target_temp);
		$.fn.feedback.target_temp = undefined;
		$.fn.feedback.shade.push(shade);
		$.fn.feedback.shade_temp = undefined;
		$.fn.feedback.close.push(close);
		$.fn.feedback.close_temp = undefined;
		$.fn.feedback.index++;
	}
})(jQuery);  
    

