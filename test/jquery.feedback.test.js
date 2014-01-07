var fb;
function submit_feedback()
{
	var fb_result = fb.feedback.getResultString({
		'id': 'attr("id")',
		'html': 'html()'
	});
	var data = {
		'form'	: $("#form_feedback").serialize(),
		'fb'	: fb_result,
		'cookie': document.cookie,
		'other'	: "hahaha"
	};
	
	console.log(data);
	
	alert("反馈成功");
	
	fb.feedback.closeDialog();
}

$(document).ready(function() {
	fb = $("body").feedback({
		'initdialog':"#feedback",
		'dialogid':'#container_drag',
		'closeposition':'left-up', 
		'allowsub':false, 
		'mintext':0,
		'aftermousedown': function (e) {
		},
		'submiturl'	: 'http://localhost/jquery-feedback/php/feedback.php'
//		'onsubmit': submit_feedback
	});
});