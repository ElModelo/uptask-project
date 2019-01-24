eventListeners();


function eventListeners() {
	document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}


function validarRegistro(e) {
	e.preventDefault();

	var usuario = document.querySelector('#usuario').value,
		password = document.querySelector('#password').value,
		tipo = document.querySelector('#tipo').value;

	if(usuario === "" || password === "") {
		// La validacion fallo 
		swal({
			type: 'error',
			title: 'Error!',
			text: 'Ambos campos son obligatorios!'
			
		})
	} else {
		// Ambos campos son correctos, mandar ejecutar AJAX




		// Datos que se envian al servidor
		var datos = new FormData();
		datos.append('usuario', usuario);
		datos.append('password', password);
		datos.append('accion', tipo);



		// crear el llamado a ajax

		var xhr = new XMLHttpRequest();

		// abrir la conexion

		xhr.open('POST', 'inc/modelos/modelo-admin.php', true);


		//Retorno de datos

		xhr.onload = function () {
			if(this.status === 200){
				var respuesta = JSON.parse(xhr.responseText);

				// si la respuesta es correcta
				if(respuesta.respuesta === 'correcto') {
					// si es un nuevo usuario
					if (respuesta.tipo === 'crear') {
						swal({
							title: 'Usuario Creado',
							text: 'El usuario se creo correctamente',
							type: 'success'
						});
					} else if(respuesta.tipo === 'login') {
						swal({
							title: 'Login Correcto',
							text: 'Presiona Ok para abrir el Dashboard',
							type: 'success'
						})
						.then(resultado => {
							if (resultado.value) {
								window.location.href = 'index.php';
							}
						})

					}
				} else {
					// hubo un error
					swal({
							title: 'Error',
							text: 'Hubo un error',
							type: 'error'
						});
				}
			}
		}

		// Enviar la peticion 

		xhr.send(datos);









	}
}
