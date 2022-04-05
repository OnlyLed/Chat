<?php
	require_once ('./auth.php');

	//Добавление нового сообщения в БД
	$query = "INSERT INTO messages(chat_id, user_id, content, date) VALUES({$input['chat_id']},{$input['user_id']},{$input['content']},{$input['date']})";
	$result = mysqli_query($con, $query);

	$error = MYSQLI_ERROR($con);

	echo json_encode($error);
?>