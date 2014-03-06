<?php 

    include 'login.php';

    $json = array();
    $link = mysqli_connect($host, $user, $pass, $db);
    $result = mysqli_query ($link, 'SELECT * FROM '.$table.' ORDER BY datetime');
    while($row = mysqli_fetch_array ($result)){

        $content = array(
            'datetime' => $row['datetime'],
            'code' => $row['code'],
            'about' => $row['about']
        );
        array_push($json, $content);
    }
    $DBH = null;  


    $jsonstring = json_encode($json);
    echo $jsonstring;
?>