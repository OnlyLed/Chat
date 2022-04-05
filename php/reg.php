<?php
	require_once('auth.php');

	$name = $input['name'];
	$pass = $input['pass'];

	$query = "INSERT INTO users (name, pass) VAlUES('$name', '$pass')";
	$result = mysqli_query($con, $query);

	$error = MYSQLI_ERROR($con);
	if ($error) {
		echo json_encode($error);
	}else{
		echo json_encode('Вы зарегестрированны. Теперь вы можете зайти в свою учетную запись');
	}
?>