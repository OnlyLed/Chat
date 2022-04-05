<?php 
	session_start();

	//Отправка флага для выхода из аккаунта при отсутствии данных о пользователя в массиве $_SESSION
	if (!$_SESSION) {
		echo json_encode("unlog");
	}
	//Проверка авторизован ли пользователь
	if ($_SESSION) {
		require_once('./auth.php');

		$user_id = $input['user_id'];
		//Запрос списка пользователей из БД
		$query = "SELECT user_id, name FROM users;
				SELECT name, pass FROM users WHERE user_id = {$user_id}";
		$result = mysqli_multi_query($con, $query);

		do {
			if ($part = mysqli_store_result($con)) {
				$arr[] = mysqli_fetch_all($part);
			}
		} while (mysqli_next_result($con));


		$logname = $_SESSION['name'];
		$logpass = $_SESSION['pass'];
		$bdname = $arr[1][0][0];
		$bdpass = $arr[1][0][1];

		//Отправка списка пользователей или флага для выхода из аккаунта
		if ($logname==$bdname && $logpass==$bdpass) {
			echo json_encode($arr[0]);
		}else{
			echo json_encode("unlog");
		}
	}
?>
