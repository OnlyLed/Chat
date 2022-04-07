<?php
	require_once('./auth.php');

	$chat_id = $input['chat_id'];
	$offset = $input['offset'];

	//вывести предыдущие сообщения из бд
	$query = "SELECT user_id, content, date, message_id FROM messages WHERE chat_id ={$chat_id} ORDER BY message_id DESC LIMIT 50 OFFSET {$offset}";
	$result = mysqli_query($con, $query);
	$messages = mysqli_fetch_all($result);

	echo json_encode($messages);
?>