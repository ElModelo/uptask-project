<?php 



	$dbc = new mysqli('localhost', 'root','1234','uptask');

	if($dbc->connect_error) {
		echo $dbc->connect_error;
	}

	$dbc->set_charset('utf8');





?>