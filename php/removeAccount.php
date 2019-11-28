<?php 
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    $id = $_GET['id'];
    if (isset($id) && $id != '') {
        echo exec("rm -r ../json/".$id);
        $json = json_decode(file_get_contents("../json/subs.json"), true);
        unset($json[$id]);
        file_put_contents("../json/subs.json", json_encode($json));
    }
?>