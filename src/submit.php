<?php 

$dataToReceive = $_POST['data'];
$inpFormValues = explode('||',$dataToReceive);

foreach($inpFormValues as $inpValue) {
	$txtToSend .= $inpValue."
	";
}

$to 		= "trobfrank92@gmail.com";
$subject	= htmlentities(trim($inpFormValues[1]," "));
$email 		= htmlentities(trim($inpFormValues[2]," "));
$message	= htmlentities(trim($inpFormValues[3]," "));

mail($to, $subject, $message);

?>