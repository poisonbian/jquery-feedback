var fb;
$(document).ready(function() {
	fb = $("body").feedback({
		'initdialog':"#feedback",
		'dialogid':'#container_drag',
		'closeposition':'left-up', 
		'allowsub':false, 
		'mintext':1,
		'aftermousedown': function (e) {
			var fb_result = fb.feedback.getResultString(
					{
						'id': 'attr("id")',
						'html': 'html()'
					}
			);
			console.log(fb_result);
		}
	});
	
//	var fb_result = fb.feedback.getResultString(
//			{
//				'id': 'attr("id")',
//				'html': 'html()'
//			}
//	);
	
//	fb.feedback.init();
//	fb.feedback.start();
//	alert(fb.feedback.getHtml());
});