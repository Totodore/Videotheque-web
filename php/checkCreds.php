<?php 
    $subs = json_decode(file_get_contents("../json/subs.json"), true);
    if (isset($_GET["user"], $_GET["pass"])) {
        $users = array_column($subs, "user", "id");
        if (in_array(strtoupper($_GET["user"]), $users)) {
            $id = array_keys($users, strtoupper($_GET["user"]))[0];
            if (password_verify($_GET["pass"], $subs[$id]["pass"])) {
                return;
                exit;
            } else {
                echo "Le mot de passe rentré n'existe pas";
                exit;
            }
        } else {
            echo "Le nom d'utilisateur rentré n'existe pas";
            exit;
        }
    } else {
        echo "Erreur lors de la tentative de connexion";
        exit;
    }
?>