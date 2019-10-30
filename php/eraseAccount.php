<?php 
    $id = $_GET['id'];
    if (isset($id) && $id != '') {
        echo file_put_contents("../json/".$id."/data.json", file_get_contents("../src/template.json"));
    }
?>