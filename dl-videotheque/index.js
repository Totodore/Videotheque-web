$(() => {
    let URLHandler = new URLSearchParams(location.search);
    if (URLHandler.get("error") != undefined) {
        $(".announce p").text("Une erreur est survenue lors de la connection à votre compte, veuillez vous reconnecter.");
        $(".announce").slideDown(400);        
    }
    $('.to_register_button').click(function() {
        $(this).addClass("select");
        $(".to_connect_button").removeClass("select");
        $(".register_form").css("max-width", "100%");
        $(".connect_form").css("max-width", "0%");
    });
    $(".to_connect_button").click(function() {
        $(".to_register_button").removeClass("select");
        $(this).addClass("select");
        $(".connect_form").css("max-width", "100%");
        $(".register_form").css("max-width", "0%");
    })
    $(".sub_action").submit((e) => {    
        e.preventDefault();
        let user = $(".user_sub").val();
        let pass = $(".pass_sub").val();
        $.get("./subscribe.php?user=" + user + "&pass=" +pass, (data) => {
            if (data == "creds error exists")
                $(".announce p").text("Une erreur est survenue lors de la création de votre compte, ce nom d'utilisateur existe déjà...");
            else if (data == "creds error size")
                $(".announce p").text("Une erreur est survenue lors de la création de votre compte, le mot de passe et le nom d'utilisateur doivent faire au moins 4 caractères...");
            else if (data == "creds error not found")
                $(".announce p").text("Une erreur est survenue lors de la création de votre compte, aucun mot de passe et identifiant n'ont été fournis !");
            else {
                $(".announce p").text("Votre compte à bien été créé, vous pouvez vous connecter depuis l'application android ou sur votre navigateur !");
                $(".to_connect_button").click();        
            }
            $(".announce").slideDown(400);
        });
    });
});