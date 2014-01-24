console.log(document.domain);

function loadScript(url, judge, callback) {
	if (judge != null) {
		judge = eval(judge);
		if (judge) {
			callback();
			return;
		}
	}
	
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.readyState ? script.onreadystatechange = function() {
        if (script.readyState == "loaded" || script.readyState == "complete") {
        	script.onreadystatechange = null;
        	callback();
        }
    } : script.onload = function() {
        callback();
    };
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

loadScript("http://libs.baidu.com/jquery/1.8.3/jquery.min.js", "window.jQuery", function() {
	loadScript("http://libs.baidu.com/json/json2/json2.js", "window.JSON", function () {
		loadScript("js/jquery.feedback.define.js", null, function() {
	    	loadScript("test/jquery.feedback.test.js", null, function() {

	        });
	    });
	});    
});

