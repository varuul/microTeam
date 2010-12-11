<?php
$apiLink = $_POST["apiLink"];

//set the url, number of POST vars, POST data
$fields = array("status"=>"just_a_senseless_value");

//url-ify the data for the POST
foreach ($fields as $key=>$value) { 
	$fields_string .= $key.'='.$value.'&'; 
}
rtrim($fields_string,'&');


$ch = curl_init();
curl_setopt($ch,CURLOPT_URL,$apiLink);
curl_setopt($ch,CURLOPT_POST,count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS,$fields_string);
$result = curl_exec($ch);
curl_close($ch);

$result = ltrim($result, "[");
$result = rtrim($result, "1");
$result = rtrim($result, "]");

echo $result;

?>
