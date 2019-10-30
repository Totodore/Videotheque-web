<?php 
    if (isset($_POST["data"], $_POST["id"])) {
            file_put_contents("../json/".$_POST["id"]."/data.json", $_POST["data"]);
            echo "Saved !";
    }
    else { 
        echo "Error while saving data";
    }
?> 