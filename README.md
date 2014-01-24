jquery-feedback
===============

### 插件功能说明
提供用户反馈的入口，便于用户针对平台界面进行bug、建议的提交和收集

1. 用户反馈时可在页面直接点选，精确地告知开发者bug发生的位置

2. 默认上传url、bug位置、html代码、cookie信息等，此外开发者也可以自定义增加上传信息

3. 开发者能够自定义反馈表单，结合自动上传的信息，收集更多的用户建议，或进行信息分类

4. 上传全局html代码，自动替换资源引用路径（将相对路径转化为绝对路径），在网站资源引入没有使用反盗链技术时，上传的html代码大多数即可直接在本地预览

5. 统一使用JSON作为信息交互手段，提供PHP的后台demo（发出通知邮件）

6. 提供了较多的对外配置、接口及回调机制，开发者可以根据需要进行样式定义、接口扩展等

### 需要的环境
目前支持jquery1.7+

