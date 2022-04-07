/*Здесь можно бросить запрос на logout.php, чтобы при 
переходе на страницу по ссылке или кнопкой назад тоже 
происходил выход из аккаунта*/


//Отправка данных из формы входа
document.addEventListener('DOMContentLoaded', function(){
	const log = document.getElementById('log')
	log.addEventListener('submit', async function(e){

		e.preventDefault();

		name = log.name.value
		pass = log.pass.value
		

		let response = await fetch('./php/login.php' ,{
			method: 'POST',
			body: JSON.stringify({
				name: name,
				pass: pass
			})
		})
		//вход если в БД была найдена запись с такими данными
		if (response.ok) {
			let result = await response.json()
			 if (result['status']) {
			 	alert(result['status'])
			 }
			 //возврат к странице входа, если не найдено записи в БД с такими данными
			 if (!result['status']) {
			 	get = "user_id=" + result['user_id']
			 	document.location.replace(`./index.html?${get}`);
			 }
		}
	})
})