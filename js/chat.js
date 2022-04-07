let chat_id
let user1_name
let last_message
let last_user
let temporary
let shift
let enter
let messagesNum = 0

//извлекаем get параметры
const get = new Object
a = window.location.search
a = a.substring(1).split('&')
a.forEach(function(b){
	b = b.split("=")
	get[b[0]] = b[1]
})

user1_id = get['user_id']

//Выходим, если не указан Get параметр user_id
if(!user1_id){
	unlog()
}

document.addEventListener('DOMContentLoaded', async function(){
	//ставим пустую строку вместо undefined, чтобы не отправлялось пустое сообщение
	document.getElementById('message').innerHTML = "" 
	//вывод всех пользователей
	let response = await fetch('./php/chat.php',
	{
		method: 'POST',
		body: JSON.stringify({
			user_id: user1_id
		})
	})
	if (response.ok) {
		let result = await response.json()
		if (result == 'unlog') {
			document.location.replace('login.html')
		}
		if (result != "unlog"){
			result.forEach(function(n){
				//Вывод имени пользователя в шапку
				if (user1_id == n[0]) {
					user1_name = n[1]
					document.getElementById('userName').innerHTML += user1_name
				}
				addUsers(n)
			})
		}
	}

	//проверка на наличие новых пользователей
	setInterval(async function(){
		let response = await fetch('./php/usersCheck.php',{
			method: 'POST',
			body:JSON.stringify({last_user: last_user})
		})
		if (response.ok) {
			let result = await response.json()
			result.forEach(function(n){
				addUsers(n)
			})
		}
	}, 10000)

	//вывод сообщений из БД
	document.getElementById('users').addEventListener('click', async function(e){
		unactive = document.getElementsByClassName('user')
		for(div of unactive){
			div.classList.remove('active')
		}
		let target = e.target
		if (target.className == 'user') {
			document.getElementById('message').setAttribute("contenteditable","true")
			document.getElementById('messages').innerHTML = ""

			get['user2_id'] = target.id

			document.getElementById(target.id).classList.add('active')
			let response = await fetch('./php/messages.php',{
				method: 'POST',
				body: JSON.stringify(get)
			})

			user2_id = get['user2_id']
			
			if (response.ok) {
				let result = await response.json()
				
				user2_name = result[1]
				chat_id = result[2][0]

				//выводим имя user1 и user2 в шапку
				document.getElementById('userName').innerHTML = `${user1_name}, Вы в чате с ${user2_name}`

				addMessages(result[3])
				scrollDown()
			}
			//Проверка на наличие новых сообщений
			setInterval(async function messagesCheck(){
			 	let response = await fetch('./php/messagesCheck.php',{
			 		method: 'POST',
			 		body:JSON.stringify({
			 			chat_id: chat_id,
			 			last_message: last_message
			 		})
			 	})

			 	if (response.ok) {
			 		let result = await response.json()

			 		addMessages(result)
			 	}
			}, 3000)

			document.getElementById('messages').addEventListener('scroll', async function(){
				height = document.getElementById('messages').scrollHeight
				if (!document.getElementById('messages').scrollTop) {
					let response = await fetch('./php/previousMessages.php',{
						method: 'POST',
						body: JSON.stringify({
							chat_id:chat_id,
							offset:messagesNum
						})
					})
					if (response.ok) {
						let result = await response.json()
						addMessages(result, false)
						document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight - height
					}
				}
			})
		}
	})

	document.addEventListener('keydown', function(e){
		if(event.key == 'Enter'){
			e.preventDefault()
			enter = true
		}
		if(event.key == 'Shift'){
			shift = true
		}
		//Новый абзац при нажатии shift+enter
		if(shift && enter){
			enter = false
		}
		//Отправка сообщения по нажатию на Enter
		if(enter){
			postMessage()
		}
		document.getElementById('message').focus()
	})
	//сброс значений при отпускании клавишь
	document.addEventListener('keyup', function(){

		if (event.key == 'Enter'){
			enter = false
		}
		if(event.key == 'Shift'){
			shift = false
		}
	})

	//Отправка сообщения
	document.getElementById('send').addEventListener('click', function(){
		postMessage()
	})

	//кнопка выхода
	document.getElementById('exit').addEventListener('click', async function(){
		let response = await fetch("./php/logout.php", {
			method: 'POST'
		})

		if (response.ok) {
			document.location.replace('./login.html')
		}
	})
})

//Функция для добавления пользователей
function addUsers(n){
	if (n) {
		let user = document.createElement('div')
		user.classList = 'user'
		user.id = n[0]
		user.innerHTML = n[1]
		document.getElementById('users').append(user)
		last_user = n[0]
	}
}

//Функция для создания сообщения
function addMessages(messages, next = true){
	if (messages) {
		a = scrollCheck()
		messages.forEach(function(n){
			let messageHistory = document.createElement('div')
			messageHistory.classList = 'wrapper'
			messageHistory.id = 'm'+n[3]
			messageHistory.innerHTML = `<div class="name"></div><div class="messageContent" >${n[1]}</div><div class="date">${n[2]}</div>`
			if (n[0] == user1_id) {
				messageHistory.classList +=' left'
				messageHistory.getElementsByClassName('name')[0].innerHTML = user1_name

				if (document.getElementsByClassName('temporary')[0]) {
					document.getElementsByClassName('temporary')[0].remove()
				}	
			} else
			if (n[0] == user2_id) {
				messageHistory.classList +=' right'
				messageHistory.getElementsByClassName('name')[0].innerHTML = user2_name
			}
			if (next) {
				document.getElementById('messages').append(messageHistory)
				messagesNum += 1
				last_message = n[3]
			}else{
				document.getElementById('messages').prepend(messageHistory)
				messagesNum += 1
			}
		})
		scrollDown(a)
	}
}


//выход из аккаунта на страницу входа
function unlog(){
	document.location.replace('./login.html')
}

//Функция для отправки сообщения в БД
async function postMessage(){
	messageInput = document.getElementById('message').innerHTML
	messageInput = messageInput.split('&nbsp; ').join('')
	messageInput = messageInput.split('&nbsp;').join('')

	//формируем дату отправки сообщения
	if (messageInput) {
		date = new Date
		formatDate = date.toISOString().slice(0,19).replace('T', ' ')
		
		document.getElementById('message').innerHTML = ""

		a = scrollCheck()

		//добавляем временный блок с сообщением
		let messageHistory	= document.createElement('div')
		messageHistory.classList = 'wrapper left temporary'
		messageHistory.innerHTML = `<div class="name">${user1_name}</div><div class="messageContent" >${messageInput}</div><div class="date">${formatDate}</div>`
		document.getElementById('messages').append(messageHistory)

		scrollDown(a)

		//отправить в базу данных
		let response = await fetch( "./php/newMessage.php",{

			method: 'POST',
			body: JSON.stringify({
				chat_id: chat_id,
				user_id: user1_id,
				content: "'"+messageInput+"'",
				date: "'"+formatDate+"'"
			})
		})
		if (response.ok) {
			let result = await response.json()
		}
	}
}

//Функция для проверки положения скрола
function scrollCheck(){
	scroll = document.getElementById('messages')
	height = scroll.scrollHeight
	div = scroll.clientHeight
	position = scroll.scrollTop
	if (div + position == height) {
			return(true)
		}else{
			return(false)
		}
}

//Функция для удержания скролла внизу
function scrollDown(a){
	if (a == true) {
		scroll = document.getElementById('messages')
		height = scroll.scrollHeight
		scroll.scrollTo(0, height)
	}
}