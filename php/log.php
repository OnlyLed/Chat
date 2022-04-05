<?php
	require_once('auth.php');

	session_start();

	session_unset();

	//Вход в аккаунт

	$name = $input['name'];
	$pass = $input['pass'];

	$query = "SELECT user_id ,name, pass FROM users WHERE name LIKE '{$name}'";
	$result = mysqli_query($con, $query);
	$arr = mysqli_fetch_array($result);
	$user_id = $arr['user_id'];
	$error = false;

	if (!$arr) {
		$error = 'Неверный логин или пароль, попробуйте еще раз';
	}else{
		$bdname = $arr['name'];
		$bdpass = $arr['pass'];

		$_SESSION['name'] = $bdname;
		$_SESSION['pass'] = $bdpass;

		if ($bdpass != $pass) {
			$error = 'Неверный логин или пароль, попробуйте еще раз';
		}
	}
	$response = ['status'=>$error, 'user_id'=>$user_id];
	echo json_encode($response);
?>