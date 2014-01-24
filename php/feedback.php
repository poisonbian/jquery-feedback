<?php
require("PHPMailer/class.phpmailer.php");
class Feedback 
{
	var $receiver;
	var $cc;
	var $body;
	var $subject;
	
	function send_mail()
	{
		$mail = new phpmailer();
		
		$mail->From = "fankui@mail178.com";
		$mail->FromName = 'JQuery反馈插件';
		$mail->CharSet = "utf-8";
		
		$mail->IsSMTP();
		$mail->SMTPAuth = true;
		$mail->Host = "mail.mail178.com";
		$mail->Username = "fankui@mail178.com";
		$mail->Password = "fankui";
		
		$receiver_array = explode(",", $this->receiver);
		foreach ($receiver_array as $receiver)
		{
			if (trim($receiver) === "")
			{
				continue;
			}
			$mail->AddAddress($receiver, $receiver);
		}
		$receiver_array = explode(",", $this->cc);
		foreach ($receiver_array as $receiver)
		{
			if (trim($receiver) === "")
			{
				continue;
			}
			$mail->AddCC($receiver, $receiver);
		}		
		
		$mail->Subject = $this->subject;
		$mail->Body = $this->body;
		$mail->AddAttachment("att_" . getmypid() . ".html", "att_" . getmypid() . ".html");
		$mail->Send();
	}
	
	function deal_post()
	{	
		$this->receiver = $_POST['receiver'];
		
		ob_start();
		printf("问题URL: \n%s\n", $_POST['url']);
		printf("表单内容: \n");
		print_r(json_decode(stripslashes($_POST['form']), true));
		echo "\n";
		printf("反馈内容: \n");
		print_r(json_decode(stripslashes($_POST['feedback']), true));
		echo "\n";
		printf("浏览器信息: \n");
		print_r(json_decode(stripslashes($_POST['browser']), true));
		echo "\n";
		printf("Cookie信息: \n%s\n", $_POST['cookie']);
		printf("Referer: \n%s\n", $_POST['referer']);
		
		$this->body = ob_get_contents();
		ob_end_clean(); 
		$this->subject = array_key_exists('subject', $_POST) ? $_POST['subject'] : '[WARNING]用户反馈';

		file_put_contents("att_" . getmypid() . ".html", stripslashes($_POST['html']));
		$this->send_mail();
		@unlink("att_" . getmypid() . ".html");
		
		echo json_encode(array( 
			'status'	=> 0, 
			'msg' 		=> '正常', 
		)); 
	}
}

$feedback = new Feedback();
$feedback->deal_post();


