<?php


	$accion = $_POST['accion'];
	

if ($accion === 'crear') {
	// crear variables por que afuera de este bloque da error al ser mandados en el POST 
	$id_proyecto = (int) $_POST['id_proyecto'];
	$tarea = $_POST['tarea'];
	// importar la conexion
	include('../funciones/conexion.php');

	try {
		// Realizar la consulta a la base de datos
		$stmt = $dbc->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?)");
		$stmt->bind_param('si', $tarea, $id_proyecto);
		$stmt->execute();
		if ($stmt->affected_rows > 0) {
			$respuesta = array(
				'respuesta' => 'correcto',
				'id_insertado' => $stmt->insert_id,
				'tipo' => $accion,
				'tarea' => $tarea
			);
		} else {
			$respuesta = array(
				'respuesta' => 'error',
			);
		}
		$stmt->close();
		$dbc->close();
	} catch(Excepcion $e) {
		// En caso de un error, tomar la excepcion
		$respuesta = array(
			'error' => $e->getMessage()
		);
		

	}
	echo json_encode($respuesta);
}

if ($accion === 'actualizar') {
	$estado = $_POST['estado'];
	$id_tarea = (int) $_POST['id'];
	include('../funciones/conexion.php');

	try {
		// Realizar la consulta a la base de datos
		$stmt = $dbc->prepare("UPDATE tareas set estado = ? WHERE id = ?");
		$stmt->bind_param('ii', $estado, $id_tarea);
		$stmt->execute();
		if ($stmt->affected_rows > 0) {
			$respuesta = array(
				'respuesta' => 'correcto'
			);
		} else {
			$respuesta = array(
				'respuesta' => 'error',
			);
		}
		$stmt->close();
		$dbc->close();
	} catch(Excepcion $e) {
		// En caso de un error, tomar la excepcion
		$respuesta = array(
			'error' => $e->getMessage()
		);
		

	}
	echo json_encode($respuesta);
}

if ($accion === 'eliminar') {
	
	$id_tarea = (int) $_POST['id'];
	include('../funciones/conexion.php');

	try {
		// Realizar la consulta a la base de datos
		$stmt = $dbc->prepare("DELETE from tareas WHERE id = ?");
		$stmt->bind_param('i', $id_tarea);
		$stmt->execute();
		if ($stmt->affected_rows > 0) {
			$respuesta = array(
				'respuesta' => 'correcto'
			);
		} else {
			$respuesta = array(
				'respuesta' => 'error',
			);
		}
		$stmt->close();
		$dbc->close();
	} catch(Excepcion $e) {
		// En caso de un error, tomar la excepcion
		$respuesta = array(
			'error' => $e->getMessage()
		);
		

	}
	
}
if ($accion === 'eliminar_proyecto') {
	
	$id_proyecto = (int) $_POST['id'];
	include('../funciones/conexion.php');

	try {
		// Realizar la consulta a la base de datos
		$stmt = $dbc->prepare("DELETE from proyectos WHERE id = ?");
		$stmt->bind_param('i', $id_proyecto);
		$stmt->execute();
		if ($stmt->affected_rows > 0) {
			$respuesta = array(
				'respuesta' => 'correcto'
			);
		} else {
			$respuesta = array(
				'respuesta' => 'error',
			);
		}
		$stmt->close();
		$dbc->close();
	} catch(Excepcion $e) {
		// En caso de un error, tomar la excepcion
		$respuesta = array(
			'error' => $e->getMessage()
		);
		

	}
	echo json_encode($respuesta);
}









?>