<?php 
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    function subscribe() {
        if (!isset($_GET['pass'], $_GET["user"], $_GET["mail"]))
            return "creds error not found";

        $user = strtoupper($_GET['user']);
        $pass = $_GET['pass'];
        $mail = $_GET["mail"];
        $json_subs = json_decode(file_get_contents("../json/subs.json"), true);

        if (in_array($user, array_column($json_subs, "user")) ||
            in_array($pass, array_column($json_subs, "pass")) ||
            in_array($mail, array_column($json_subs, "mail")))
            return "creds error exists";

        if (strlen($user) < 4 || strlen($pass) < 4)
            return "creds error size";

        $id = uniqid();
        // $result = mkdir("../json/".$user.".*___*.".$_GET['pass']);
        //We create a new folder
        mkdir("../json/".$id);
        $template = file_get_contents("../src/template.json");
        file_put_contents("../json/".$id."/data.json", $template);
        $json_subs[$id] = Array(
            "user" => strtoupper($user),
            "pass" => password_hash($pass, PASSWORD_DEFAULT),
            "id" => $id,
            "mail" => $mail
        ); 
        file_put_contents("../json/subs.json", json_encode($json_subs));
    }
    
    echo subscribe();
    exit;
?>