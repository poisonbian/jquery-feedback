var fb;
$(document).ready(function() {
	fb = $("body");
	fb.feedback({'closeposition':'left-up', 'allowsub':false});
	fb.feedback("getHtml", fb);
//	console.log(feedback.feedback('getHtml'));
//	console.log(feedback.getHtml());
//	$("body").feedback.setOption({'unit': 'test'});
//	console.log($("body").feedback().getOption());
//	$("body").feedback.start();
});