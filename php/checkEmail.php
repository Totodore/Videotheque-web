<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);
if (!isset($_GET["user"])) exit;

$json_subs = json_decode(file_get_contents("../json/subs.json"), true);

$users = array_column($json_subs, "user", "id");

if (!in_array(strtoupper($_GET["user"]), $users)) exit;

$id = array_keys($users, strtoupper($_GET["user"]));

if ($json_subs[$id[0]]["mail"] != "") echo "true";
else echo "false";

?>