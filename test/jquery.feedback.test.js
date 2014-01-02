var fb;
$(document).ready(function() {
	fb = $("body").feedback({
		'initdialog':"#feedback",
		'dialogtopid':'#container_drag_top',
		'dialogid':'#container_drag',
		'closeposition':'left-up', 
		'allowsub':false, 
		'mintext':1,
		'onmousedown': function (e) {
	}});
	
//	fb.feedback.init();
//	fb.feedback.start();
//	alert(fb.feedback.getHtml());
});