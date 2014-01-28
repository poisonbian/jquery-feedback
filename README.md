jquery-feedback
===============

插件功能说明
-----
提供用户反馈的入口，便于用户针对平台界面进行bug、建议的提交和收集

1. 用户反馈时可在页面直接点选，精确地告知开发者bug发生的位置

2. 默认上传url、bug位置、html代码、cookie信息等，此外开发者也可以自定义增加上传信息

3. 开发者能够自定义反馈表单，结合自动上传的信息，收集更多的用户建议，或进行信息分类

4. 上传全局html代码，自动替换资源引用路径（将相对路径转化为绝对路径），在网站资源引入没有使用反盗链技术时，上传的html代码大多数即可直接在本地预览

5. 统一使用JSON作为信息交互手段，提供PHP的后台demo（发出通知邮件）

6. 提供了较多的对外配置、接口及回调机制，开发者可以根据需要进行样式定义、接口扩展等

需要的环境
-----
目前支持jquery1.7+

文件说明
-----
	css/feedback.css					本地版本的核心css文件

	js/jquery.feedback.js				定义了feedback核心功能的js代码（基于JQuery插件形式）
	js/jquery.feedback.remote.js		目前的版本暂时无需关心
	js/jquery.min.js					jQuery 1.8.3的最小化版本，如有需要，可使用
	js/json2.min.js						json2的最小化版本（使IE7及以下版本可以支持JSON格式）

	php/feedback.php					服务端样例代码（发出通知邮件）
	php/dummy.php						服务端样例代码（不做任何处理）
	php/PHPMailer.php					php发邮件的库

	main.html							样例html代码1，简单页面（有div和表格）
	baidu.html							样例html代码2，基于百度搜索结果页面，去除了一些无法远程调用的资源引入
	remote.html							目前的版本暂时无需关心

使用方法
-----
### 前端页面html
可结合main.html进行参考

1. 引入文件，Jquery、json2、feedback插件定义、自己的js代码（也可以直接写在页面中，详细写法见后面一段）

		<script type="text/javascript" src="js/jquery.min.js"></script>
		<!--[if lte IE 7]>
		<script type="text/javascript" src="js/json2.min.js"></script>
		<![endif]-->
		<script type="text/javascript" src="js/jquery.feedback.js"></script>
		<script type="text/javascript" src="demo/demo.js"></script>	

2. 定义一个按钮或者a标签，点击后开始执行反馈流程
		
		<button id="feedback">反馈</button>
		
3. 定义一个反馈框的div，并默认隐藏，并赋一个唯一id

		<div id="container_drag" style="display:none;">
		</div>

### javascript代码
		最简单的调用方式
		$(document).ready(function() {
			fb = $("body").feedback({
				'feedbackcss':'css/feedback.css',
				'initdialog':"#feedback",
				'dialogid':'#container_drag',
				'host': 'http://localhost/jquery-feedback/',
				'submiturl'	: 'http://localhost/jquery-feedback/php/feedback.php'
			});
		});
	
feedbackcss: 默认引入的feedback css文件路径，如果不定义，默认使用 http://bcs.duapp.com/fankui/1.0/feedback.min.css

initdialog: 显示反馈框的点击按钮，见html代码

dialogid: 反馈框的div，见html代码

host: 资源前缀，用于替换html代码中的资源路径。

> 例如host设置为http://www.baidu.com/，若代码中有css资源定义为
> <link rel="stylesheet" type="text/css" href="a.css">
> 
> 那么反馈的时候，提交的html代码中就会变成	
> <link rel="stylesheet" type="text/css" href="http://www.baidu.com/a.css">
> 
> 这样的话，收到反馈直接打开，就可以正确地使用到对应的css资源了
> 除此之外js、img也会做相同处理
> 
> 大部分情况下，反馈邮件中的附件邮件即可直接在浏览器中打开查看效果了
	
submiturl: 用户反馈的内容提交的url（以JSON格式post过去）

### 后端代码
你可以根据自己的需要，自定义后端代码，比如用php、java、python什么的都没问题，只要接收并处理post过来的数据即可

至于处理方式也完全可以根据自己的需要，例如发邮件、存入数据库、做统计等等

此处，给出了一个样例php代码（发邮件），使用PHPMail库，仅供参考，见php/feedback.php

反馈数据说明
-----
		默认反馈数据的代码如下：
		var fb_result = $.fn.feedback.getResultString({
			'id'	: 'attr("id")',
			'html'	: 'prop("outerHTML")'
		});
		var browswer_info = $.fn.feedback.browserInfo();
		var data = {
			'url'		: document.URL,
			'form'		: JSON.stringify($(settings.dialogid).find("form").serializeArray()),
			'feedback'	: fb_result,
			'browser'	: JSON.stringify(browswer_info),
			'referer'	: document.referrer,
			'cookie'	: document.cookie,
			'html'		: $.fn.feedback.absHtml($("html").prop("outerHTML"))
		};

传回服务端的数据以JSON格式传输

url: 当前页面的url地址

form: 反馈表单中的内容，例如选择的反馈类型、联系方式、具体说明

feedback: 反馈时被选中的页面元素信息，包括id和html代码，可根据自己的需要再进行增加

browser: 浏览器信息

referer: referer

cookie: cookie信息

html: 整个页面的html代码（css/js/img资源的相对路径被替换为绝对路径）

以上内容可以根据需要再进行增删，之后会详细说明

配置说明
-----

更多接口说明
-----

