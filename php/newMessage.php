<?php
	require_once ('./auth.php');

	//Добавление нового сообщения в БД
	$message = strip_tags($input['content']);

	$query = "INSERT INTO messages(chat_id, user_id, content, date) VALUES({$input['chat_id']},{$input['user_id']},{$message},{$input['date']})";
	$result = mysqli_query($con, $query);

	$error = MYSQLI_ERROR($con);

	echo json_encode($error);
?>