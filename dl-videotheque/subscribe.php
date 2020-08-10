<?php 
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    function subscribe() {
        if (!isset($_GET['pass']) || !isset($_GET['user']))
            return "creds error not found";

        $user = strtoupper($_GET['user']);
        $pass = $_GET['pass'];
        $json_subs = json_decode(file_get_contents("../videotheque/json/subs.json"), true);

        if (in_array($user, array_column($json_subs, "user")) ||
            in_array($pass, array_column($json_subs, "pass")))
            return "creds error exists";

        if (strlen($user) < 4 || strlen($pass) < 4)
            return "creds error size";

        $id = uniqid();
        // $result = mkdir("../videotheque/json/".$user.".*___*.".$_GET['pass']);
        //We create a new folder
        mkdir("../videotheque/json/".$id);
        $template = file_get_contents("../videotheque/src/template.json");
        file_put_contents("../videotheque/json/".$id."/data.json", $template);
        $json_subs[$id] = Array(
            "user" => strtoupper($user),
            "pass" => password_hash($pass, PASSWORD_DEFAULT),
            "id" => $id
        ); 
        file_put_contents("../videotheque/json/subs.json", json_encode($json_subs));
    }
    echo subscribe();
    exit;
?>