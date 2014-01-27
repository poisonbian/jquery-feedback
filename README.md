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
	

### javascript代码

### 后端代码



配置说明
-----

更多接口说明
-----

