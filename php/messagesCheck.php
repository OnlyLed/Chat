<?php 
	require_once('auth.php');

	$chat_id = $input['chat_id'];
	$last_message = $input['last_message'];

	$query ="SELECT user_id, content, date, message_id FROM `messages` WHERE chat_id = {$chat_id} AND message_id > {$last_message};";
	$result = mysqli_query($con, $query);
	$arr = mysqli_fetch_all($result);

	echo json_encode($arr);
?>