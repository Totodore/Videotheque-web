<?php 
    session_start();
    // error_reporting(E_ALL);
    // ini_set('display_errors', 1);
?>
<!DOCTYPE html>
<html>
<head> 
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="theme-color" content="#B5E2E2" />
    <title>Vidéothèque</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="/images/icon.ico" /> 
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/icon?family=Material+Icons">  
    <link rel="stylesheet" type="text/css" href="/css/main.css" />
    <link rel="stylesheet" type="text/css" href="/css/animations.css" />
    <link rel="stylesheet" type="text/css" href="/css/home.css"/>
    <link rel="stylesheet" type="text/css" href="/css/movie.css"/>
    <link rel="stylesheet" type="text/css" href="/css/person.css"/>
    <link rel="stylesheet" type="text/css" href="/css/saved.css"/>
    <link rel="stylesheet" type="text/css" href="/css/tag.css"/>
    <link rel="stylesheet" type="text/css" href="/css/account.css"/>
    <script src="/lib/js/jquery-3.3.1.min.js"></script>
    <script>
        <?php 
        $user; $pass;
        if (isset($_GET['user']) && isset($_GET['pass'])) { 
            $user = $_GET["user"];
            $pass = $_GET["pass"]; ?>
        <?php }
        else if(isset($_POST['user']) && isset($_POST['pass'])) {
            $user = $_POST["user"];
            $pass = $_POST["pass"]; ?>
        <?php } 
        $subs = json_decode(file_get_contents("./json/subs.json"), true);
        $id = array_column($subs, "id", "user")[strtoupper($user)];
        if (password_verify($pass, $subs[$id]["pass"])) { ?>
            document.id = "<?php echo $id ?>";
            console.log(document.id);
        <?php }
        if (isset($_GET["id"])) { ?>
            document.id = "<?php echo $_GET["id"] ?>";
            console.log(document.id);
        <?php } ?>
    </script>
    <script src="/js/main.js" type="module"></script>
</head>
<body>
    <div id="wrapper">
        <header id="header">
            <i class="menuIcon_open material-icons">menu</i>
            <span class="titleBar">Vidéothèque</span>
            <div class="navBar_wrapper">
                <input type="search" name="search" class="navBar_input" placeholder="Rechercher un film, un artiste..." autofocus/>
                <hr class="search_separator" />
                <i class="material-icons navBar_icon">sort</i>
                <div class="navBar_results">   
                </div>
                <div class="navBar_sortWrapper">
                    <ul class="navBar_sort">
                        <li>Films et artistes en ligne</li>
                        <li>Films et artistes enregistrés</li>
                        <li>Tags enregistrés</li>
                    </ul>
                </div>
            </div>
        </header>     
        <main class="main"><img src="/images/loader.gif" alt="chargement..." class="loader_img"></main>
        <footer class="footer">
            <span class="footer_announce">
                L'application Vidéothèque est une application libre de droits et open source disponible sur
                <a href="https://github.com/Elariondakta/Videotheque/">GitHub</a>.
            </span>
            <span class="footer_credits">Développée par <a href="mailto:prevottheodore@gmail.com">Théodore Prévot</a></span>
        </footer>
    </div> 
    <div id="menuWrapper">
        <i class="menuIcon_close material-icons">close</i>
        <ul class="menu">
            <li><a href="#" class="dispHome">Accueil</a></li>
            <li><a href="#" class="dispMovies">Ma Vidéothèque</a></li>
            <li><a href="#" class="dispStats">Mon compte</a></li>
            <li><a class="logout">Me déconnecter</a></li>
        </ul> 
    </div>
    <div id="modifier_wrap">
        <header class="title_modifier">
                <h5></h5>
        </header>
        <div class="displayer_modifier">

        </div>
    </div>
    <div id="background"></div>
    <div id="overlay"></div>
</body>
</html>
