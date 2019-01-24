<script src="js/sweetalert2.all.min.js"></script>
<?php 

	$actual = obtenerPaginaActual();
	if($actual === 'crear-cuenta' || $actual === 'login') {
		echo '<script src="js/formulario.js"></script>';
	} else {
		echo '<script src="js/script.js"></script>';
	}


?>

</body>
</html>