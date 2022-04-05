/*Здесь можно бросить запрос на logout.php, чтобы при 
переходе на страницу по ссылке или кнопкой назад тоже 
происходил выход из аккаунта*/

document.addEventListener('DOMContentLoaded', function(){
	const log = document.getElementById('log')
	log.addEventListener('submit', async function(e){

		e.preventDefault();

		name = log.name.value
		pass = log.pass.value
		

		let response = await fetch('./php/log.php' ,{
			method: 'POST',
			body: JSON.stringify({
				name: name,
				pass: pass
			})
		})
		if (response.ok) {
			let result = await response.json()
			 if (result['status']) {
			 	alert(result['status'])
			 }
			 if (!result['status']) {
			 	get = "user_id=" + result['user_id']
			 	document.location.replace(`./index.html?${get}`);
			 }
		}
	})
})