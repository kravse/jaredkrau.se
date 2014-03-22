<?php 
	$allowedExts = array("jpeg", "jpg", "png");
	$temp = explode(".", $_FILES["file"]["name"]);
	$extension = end($temp);

	$words = $_POST["text"];
	
	if ((($_FILES["file"]["type"] == "image/jpeg")
	|| ($_FILES["file"]["type"] == "image/jpg")
	|| ($_FILES["file"]["type"] == "image/png"))
	&& in_array($extension, $allowedExts)){
	
		if ($_FILES["file"]["error"] > 0){
		    	echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
		}else{
			$filename = filename(15, $extension);
			while(file_exists("../../img/gal/".$filename.".".$extension)){
				$filename = filename(15, $extension);
			}
		}
	

		move_uploaded_file($_FILES["file"]["tmp_name"], "../../img/gal/" .$filename);				
		makeThumbnails("../../img/gal/", $filename);

		include '../../php/login.php';
		
		//count current amount of entrys in database.
		try{		
			$DBH = new PDO("mysql:host=$host;dbname=$db", $user, $pass); 
			
			$data2 = array( 'about' => $words, 'code' => $filename);  
			# # the shortcut!  
			$STH = $DBH->prepare("INSERT INTO ".$table." (about, code) value (:about, :code)");  
			$STH->execute($data2);  
			
		} catch(PDOException $e) {  
			echo $e->getMessage();  
		}  	

		header( "Location: /" );	
	}

	function filename($length, $ex) {
	    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	    return substr(str_shuffle($chars),0,$length).".".$ex;
	   
	}

	function makeThumbnails($updir, $id){
	    $thumbnail_width = 200;
	    $thumbnail_height = 200;
	    $arr_image_details = getimagesize($updir . $id); // pass id to thumb name
	    $original_width = $arr_image_details[0];
	    $original_height = $arr_image_details[1];
	    if ($original_width > $original_height) {
	        $new_height = $thumbnail_height;
	        $new_width= intval($original_width/($original_height/$thumbnail_height));
	    }else if($original_width === $original_height) {
	        $new_height = $thumbnail_height;
	        $new_width = $thumbnail_width;
	    } 
	    else {
	    	$new_width = $thumbnail_width;
	        $new_height= intval($original_height/($original_width/$thumbnail_width));
	    }
	    $dest_x = intval(($thumbnail_width - $new_width) / 2);
	    $dest_y = intval(($thumbnail_height - $new_height) / 2);
	    if ($arr_image_details[2] == 1) {
	        $imgt = "ImageGIF";
	        $imgcreatefrom = "ImageCreateFromGIF";
	    }
	    if ($arr_image_details[2] == 2) {
	        $imgt = "ImageJPEG";
	        $imgcreatefrom = "ImageCreateFromJPEG";
	    }
	    if ($arr_image_details[2] == 3) {
	        $imgt = "ImagePNG";
	        $imgcreatefrom = "ImageCreateFromPNG";
	    }
	    if ($imgt) {
	        $old_image = $imgcreatefrom("$updir" . $id);
	        $new_image = imagecreatetruecolor($thumbnail_width, $thumbnail_height);
	        imagecopyresized($new_image, $old_image, $dest_x, $dest_y, 0, 0, $new_width, $new_height, $original_width, $original_height);
	        $imgt($new_image, "../../img/thumbnails/" . $id);
	    }
	}

	
?>
