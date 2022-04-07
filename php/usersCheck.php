<?php 
	require_once('auth.php');

	$last_user = $input['last_user'];

	//Запрос пользователей, id которых больше, чем уже отображенных на странице
	$query ="SELECT user_id, name FROM `users` WHERE user_id > {$last_user};";
	$result = mysqli_query($con, $query);
	$arr = mysqli_fetch_all($result);

	echo json_encode($arr);
?>