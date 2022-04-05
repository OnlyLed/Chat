document.addEventListener('DOMContentLoaded', function(){
	const reg = document.getElementById('reg')
	reg.addEventListener('submit', async function(e){

		e.preventDefault()

		name = reg.name.value
		pass = reg.password.value
		confirmPass = reg.confirmPass.value
		if (pass == confirmPass) {
			let response = await fetch('./php/reg.php', {
				method: 'POST',
				body: JSON.stringify({
					name: name,
					pass: pass
				})
			})
			if (response.ok){
				let result = await response.json()
				
				switch (result){
					case (1062):
						alert("Пользователь с таким именем уже существует")
					break

					default:
					alert(result)
					document.location.replace('./login.html')
				}
				
			}else{
				alert('не удалось получить ответ от сервера')
			}
		}else{
			alert('Пароли не совпадают, попробуйте еще раз')
		}
	})
})
