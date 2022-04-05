<?php
	require_once ('./auth.php');


	//print_r($input);

	$query = "INSERT INTO messages(chat_id, user_id, content, date) VALUES({$input['chat_id']},{$input['user_id']},{$input['content']},{$input['date']})";
	$result = mysqli_query($con, $query);

	$error = MYSQLI_ERROR($con);

	echo json_encode($error);
?>