<?php 

define("ERROR_TEXT","Erreur lors de la récupération du mail, veuillez recommencer dès que possible."); 
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_GET["mail"], $_GET["user"], $_GET["pass"])) {
    echo ERROR_TEXT;
    exit;
}

$json_subs = json_decode(file_get_contents("../json/subs.json"), true);

$users = array_column($json_subs, "user", "id");
$pass = array_column($json_subs, "pass", "id");

if (!in_array(strtoupper($_GET["user"]), $users)) {
    echo ERROR_TEXT;
    exit;
}

$id = array_keys($users, strtoupper($_GET["user"]))[0];

if (!password_verify($_GET["pass"], $json_subs[$id]["pass"])) {
    echo ERROR_TEXT;
    exit;
}
$json_subs[$id]["mail"] = $_GET["mail"];

if (file_put_contents("../json/subs.json", json_encode($json_subs)) === false) {
    echo ERROR_TEXT;
    exit;
}

?>