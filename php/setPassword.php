<?php 
    error_reporting( E_ALL );
    ini_set('display_errors', 1);
    $new_password = $_GET['new_password'];
    $id = $_GET["id"];
    if (!isset($new_password, $id))
        exit;

    $subs[$id]["pass"] = password_hash($new_password, PASSWORD_DEFAULT);
    
    file_put_contents("../json/subs.json", json_encode($subs));
    echo true;
?>