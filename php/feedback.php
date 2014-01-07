<?php
	$array['server_url'] = htmlspecialchars($_POST['url']);
	$array['server_form'] = json_decode($_POST['form'], true);
	$array['server_feedback'] = json_decode($_POST['feedback'], true);
	$array['server_cookie'] = htmlspecialchars($_POST['cookie']);
	
	echo json_encode($array);
	