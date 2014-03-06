<?php 

	include '../../php/login.php';
	
	$action = $_POST['action'];
	$id = $_POST['id'];
	$text = $_POST['text'];
	
	//count current amount of entrys in database.
	$link = mysqli_connect($host, $user, $pass, $db) or die("Error " . mysqli_error($link));;
	if($action == "delete"){
	 	$query = "DELETE FROM ".$db.".".$table." WHERE ".$table.".code = '".$id."'";
		$result = mysqli_query ($link, $query);	

		unlink('../../img/gal/'.$id);
		unlink('../../img/thumbnails/'.$id);
		
	}else if($action == "edit"){
	 	$query = "UPDATE ".$db.".".$table." SET ".$table.".about = '".$text."' WHERE code = '".$id."'";
		$result = mysqli_query ($link, $query);	
	}

?>

