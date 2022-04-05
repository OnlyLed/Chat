<?php
	require_once('./auth.php');

	$user1_id = $input['user_id'];
	$user2_id = $input['user2_id'];



	$query = "SELECT name FROM users WHERE user_id = {$user1_id};
			SELECT name FROM users WHERE user_id = {$user2_id};
			SELECT chat_id FROM private WHERE user1_id = {$user1_id} AND user2_id = {$user2_id} OR user1_id = {$user2_id} AND user2_id = {$user1_id}";

	$result = mysqli_multi_query($con, $query);
	do {
		if($part = mysqli_store_result($con)){
			$arr[] = mysqli_fetch_row($part);	
		}
	} while (mysqli_next_result($con));


	if(isset($arr[2][0])){
		$chat_id = $arr[2][0];
	}
	if(!isset($arr[2][0])){
		$chat_id = null;
	}

	if ($chat_id) {
		//вывести предыдущие сообщения из бд
		$query = "SELECT user_id, content, date, message_id FROM messages WHERE chat_id ={$chat_id}" ;
		$result = mysqli_query($con, $query);
		$messages = mysqli_fetch_all($result);

		$arr[3] = $messages;
	}

	if (!$chat_id) {
		//создать новый диалог
		$query = "INSERT INTO private (user1_id, user2_id) VALUES ($user1_id, $user2_id);";
		$result = mysqli_query($con, $query);

		$query = "SELECT chat_id FROM private WHERE user1_id = {$user1_id} AND user2_id = {$user2_id} OR user1_id = {$user2_id} AND user2_id = {$user1_id}";
		$result = mysqli_query($con, $query);
		$arr[2] = mysqli_fetch_row($result);
	}
	
	echo json_encode($arr);

?>