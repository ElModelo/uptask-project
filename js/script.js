

eventListeners();
// Lista de proyectos
var listaProyectos = document.querySelector('ul#proyectos');


function eventListeners() {
	// 	Boton para crear proyecto
	document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

	// Boton para una nueva tarea
	document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);


	// Botones para las acciones de las tareas
	document.querySelector('.listado-pendientes'), addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
	e.preventDefault();
	


	// Crea un <input> para el nobre de nuevo proyecto
	var nuevoProyecto = document.createElement('LI');
	nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
	listaProyectos.appendChild(nuevoProyecto);

	// Seleccionar el ID con el nuevoProyecto
	var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

	// Al presionar enter crear el proyecto

	inputNuevoProyecto.addEventListener('keypress', function(e) {
		var tecla = e.wich || e.keyCode;

		if (tecla === 13) {
			guardarProyectoDb(inputNuevoProyecto.value);
			listaProyectos.removeChild(nuevoProyecto);
		}
	});

}

function guardarProyectoDb(nombreProyecto) {
	// Crear llamado ajax
	var xhr = new XMLHttpRequest();

	// Enviar datos por Form Data
	var datos = new FormData();
	datos.append('proyecto', nombreProyecto);
	datos.append('accion', 'crear');

	// Abrir la conexion
	xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

	// En la carga
	xhr.onload = function() {
		if(this.status === 200){
			// Obtener datos de la respuesta
			var respuesta = JSON.parse(xhr.responseText);
			var proyecto = respuesta.nombre_proyecto,
				id_proyecto = respuesta.id_insertado,
				tipo = respuesta.tipo,
				resultado = respuesta.respuesta;

			// Comprobrar la insercion
			if (resultado === 'correcto') {
				// fue exitoso
				if (tipo === 'crear') {
					// Se creo un nuevo proyecto
					// inyectar en el HTML
					var nuevoProyecto = document.createElement('LI');
					nuevoProyecto.innerHTML = `
						<a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
							${proyecto}
						</a>
					`;
					// Agregar al HTML
					listaProyectos.appendChild(nuevoProyecto);

					// Enviar alerta
					swal({
						title: 'Proyecto Creado',
						text: 'El proyecto: '+ proyecto +' se creo correctamente',
						type: 'success'
					})
					.then(resultado => {
						// Redireccionar a la nueva URL
						if (resultado.value) {
							window.location.href = 'index.php?id_proyecto=' + id_proyecto;
						}
					})

					
				} else {
					// Se actualizo o se elimino
				}
			} else {
				// hubo un error

				swal({
					type: 'error',
					title: 'Error!',
					text: 'Hubo un error!'
					
				})
			}
		}
	}

	// Enviar el Request
	xhr.send(datos);
}




// Agregar una nueva tarea al proyecto actual

function agregarTarea(e) {
	e.preventDefault();


	var nombreTarea = document.querySelector('.nombre-tarea').value;
	// Validar que el campo tenga algo escrito

	if(nombreTarea === '') {
		swal({
			title: 'Error',
			text: 'Una tarea no puede ir vacia',
			type: 'error'

		})
	} else {
		// La tarea tiene algo, insertar en PHP


		// Crear llamado a ajax
		var xhr = new XMLHttpRequest();

		// Crear formdata
		var datos = new FormData();
		datos.append('tarea', nombreTarea);
		datos.append('accion', 'crear');
		datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

		// Abrir la conexion
		xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);


		// ejecutarlo y respuesta
		xhr.onload = function() {
			if (this.status === 200) {
				// Todo correcon
				var respuesta = JSON.parse(xhr.responseText);
				// asignar valores

				var resultado = respuesta.respuesta,
					tarea = respuesta.tarea,
					id_insertado = respuesta.id_insertado,
					tipo = respuesta.tipo;
				

				if(resultado === 'correcto'){
					// se agrego correctamente
					if (tipo === 'crear') {
						// lanzar la alerta
						swal({
						type: 'success',
						title: 'Tarea Creada!',
						text: 'La tarea: '+ tarea + ' fue creada con exito!'
						
						})
						// Seleccionar el parrfo con la lista vacia

						var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
						if (parrafoListaVacia.length > 0) {
							document.querySelector('.lista-vacia').remove();
						}
						// Construir template
						var nuevaTarea = document.createElement('LI');

						// agregamos el ID

						nuevaTarea.id = 'tarea:' + id_insertado;

						// agregar la clase tarea
						nuevaTarea.classList.add('tarea');

						// construir en el html
						nuevaTarea.innerHTML = `
							<p> ${tarea} </p>
							<div class="acciones">
								<i class="far fa-check-circle"></i>
								<i class="fas fa-trash"></i>

							</div>
						`;

						// agregarlo al DOM

						var listado = document.querySelector('.listado-pendientes ul');
						listado.appendChild(nuevaTarea);

						// Limpiar el formulario
						document.querySelector('.agregar-tarea').reset();


					}
				} else {
					// hubo un error
					swal({
						type: 'error',
						title: 'Error!',
						text: 'Hubo un error!'
						
					})
				}
			}
		}


		// Enviar el request
		xhr.send(datos);
	}
}

// Cambia el estado de las tareas o las elimina

function accionesTareas(e) {
	if(e.target.classList.contains('fa-check-circle') & e.target.classList.contains('safacon-tarea')) {
		e.preventDefault();	
	}
	


	if (e.target.classList.contains('fa-check-circle')) {
		if (e.target.classList.contains('completo')) {
			e.target.classList.remove('completo');
			cambiarEstadoTarea(e.target, 0);
		} else {
			e.target.classList.add('completo');
			cambiarEstadoTarea(e.target, 1);
		}
	} 
	if (e.target.classList.contains('safacon-tarea')) {
		swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if(result.value) {

				var eliminarProyecto = e.target.parentElement;
				

				var tareaEliminar = e.target.parentElement.parentElement;
				// Borrar de la BD
				eliminarTareaBD(tareaEliminar);

				// Borrar del HTML
				tareaEliminar.remove();
				swal(
					'Deleted!',
					'Your file has been deleted',
					'success'
				)
			}

		})
	} 
	if (e.target.classList.contains('safacon-proyecto')) {
		swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if(result.value) {

				var eliminarProyecto = e.target.parentElement;
				
				// Borrar de la BD
				eliminarProyectoBD(eliminarProyecto);

				// // Borrar del HTML
				eliminarProyecto.remove();

				swal(
					'Deleted!',
					'Your file has been deleted',
					'success'
				)
			}

		})
	} 
}

// Completa o descompleta una tarea

function cambiarEstadoTarea(tarea, estado) {
	var idTarea = tarea.parentElement.parentElement.id.split(":");
	

	// Crear llamado AJAX
	var xhr =  new XMLHttpRequest();

	// Informacion

	var datos = new FormData();
	datos.append('id', idTarea[1]);
	datos.append('accion', 'actualizar');
	datos.append('estado', estado);

	// abrir la conexion

	xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

	// on load
	xhr.onload = function() {
		if(this.status === 200) {
			var respuesta = JSON.parse(xhr.responseText);
			// console.log(respuesta);
		}

	}
	// enviar la peticion
	xhr.send(datos);
}

// Eliminar tarea de la base de datos
function eliminarTareaBD(tarea) {
	var idTarea = tarea.id.split(":");
	

	// Crear llamado AJAX
	var xhr =  new XMLHttpRequest();

	// Informacion

	var datos = new FormData();
	datos.append('id', idTarea[1]);
	datos.append('accion', 'eliminar');
	

	// abrir la conexion

	xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

	// on load
	xhr.onload = function() {
		if(this.status === 200) {
			var respuesta = JSON.parse(xhr.responseText);
			// console.log(respuesta);

			// Comprobar que haya tareas restantes
			var listaTareasRestantes = document.querySelectorAll('li.tarea');
			if (listaTareasRestantes.length === 0) {
				document.querySelector('.listado-pendientes').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
			}
		}

	}
	// enviar la peticion
	xhr.send(datos);
}
// eliminar proyecto de la base de datos
function eliminarProyectoBD(proyecto) {
	var idProyecto = proyecto.childNodes[1].id.split(":");
	console.log(idProyecto[1]);

	// Crear llamado AJAX
	var xhr =  new XMLHttpRequest();

	// Informacion

	var datos = new FormData();
	datos.append('id', idProyecto[1]);
	datos.append('accion', 'eliminar_proyecto');
	

	// abrir la conexion

	xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

	// on load
	xhr.onload = function() {
		if(this.status === 200) {
			var respuesta = JSON.parse(xhr.responseText);
			console.log(respuesta);

		
			
		}

	}
	// enviar la peticion
	xhr.send(datos);
}
