<?php 
    error_reporting( E_ALL );
    ini_set('display_errors', 1);

    $new_username = $_GET['new_username'];
    $id = $_GET["id"];
    if (!isset($new_username, $id))
        exit;

    $subs = json_decode(file_get_contents("../json/subs.json"), true);

    $subs[$id]["user"] = strtoupper($new_username);
    
    file_put_contents("../json/subs.json", json_encode($subs));
    echo true;
?>