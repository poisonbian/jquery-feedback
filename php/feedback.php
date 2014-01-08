<?php
require("PHPMailer/class.phpmailer.php");
	
class Feedback 
{
	var $receiver;
	var $cc;
	var $body;
	
	private function trans($str)
	{
		//return iconv('UTF-8', 'GBK//IGNORE', $str);
		return $str;
	}
	
	function print_r_html($arr, $style = "display: none; margin-left: 10px;") {
		if (gettype($arr) != "array")
		{
			var_dump($arr);
			return;
		}
		static $i = 0;
		$i++;
		echo "\n<div id=\"array_tree_$i\" class=\"array_tree\">\n";
		foreach ( $arr as $key => $val ) {
			switch (gettype ( $val )) {
				case "array" :
					echo "<a onclick=\"document.getElementById('";
					echo "array_tree_element_$i" . "').style.display = ";
					echo "document.getElementById('array_tree_element_$i";
					echo "').style.display == 'block' ?";
					echo "'none' : 'block';\"\n";
					echo "name=\"array_tree_link_$i\" href=\"#array_tree_link_$i\">" . htmlspecialchars ( $key ) . "</a><br />\n";
					echo "<div class=\"array_tree_element_\" id=\"array_tree_element_$i\" style=\"$style\">";
					echo print_r_html ( $val );
					echo "</div>";
					break;
				case "integer" :
					echo "<b>" . htmlspecialchars ( $key ) . "</b> => <i>" . htmlspecialchars ( $val ) . "</i><br />";
					break;
				case "double" :
					echo "<b>" . htmlspecialchars ( $key ) . "</b> => <i>" . htmlspecialchars ( $val ) . "</i><br />";
					break;
				case "boolean" :
					echo "<b>" . htmlspecialchars ( $key ) . "</b> => ";
					if ($val) {
						echo "true";
					} else {
						echo "false";
					}
					echo "<br />\n";
					break;
				case "string" :
					echo "<b>" . htmlspecialchars ( $key ) . "</b> => <code>" . htmlspecialchars ( $val ) . "</code><br />";
					break;
				default :
					echo "<b>" . htmlspecialchars ( $key ) . "</b> => " . gettype ( $val ) . "<br />";
					break;
			}
			echo "\n";
		}
		echo "</div>\n";
	}
	        	
	
	function send_mail()
	{
		$mail = new phpmailer();
		
		$mail->From = "bian_wei@baidu.com";
		$mail->FromName = 'JQuery Feedback';
		$mail->CharSet = "utf-8";
		
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
		
		$mail->Subject = "[WARNING]用户反馈";
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


