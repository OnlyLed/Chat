<?php 
	//подключение к БД
	$hostname = "localhost";
	$username = "root";
	$password = "tulen";
	
	$con = mysqli_connect($hostname, $username, $password) or die ("Не может создать соединение");
	mysqli_query($con, 'SET NAMES utf8') or header ('Location: Error');

	$dbName = "chat";
	mysqli_select_db($con, $dbName) or die (mysql_error());

	//получение данных от js
	$input = json_decode(file_get_contents('php://input'),true);
 ?>