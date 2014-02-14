function load_script(url, judge, callback) {
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

load_script("http://libs.baidu.com/jquery/1.8.3/jquery.min.js", "window.jQuery", function() {
	load_script("http://bcs.duapp.com/fankui/1.0/json2.min.js", "window.JSON", function () {
		load_script("js/jquery.feedback.js", null, function() {
			load_script("demo/demo.js", null, function() {

	        });
	    });
	});    
});

