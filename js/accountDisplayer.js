import {DataHandler} from './dataHandler.js';
export class AccountDisplayer {
    constructor() {
        let stats = DataHandler.getStats();
        $(".number_movies").html("<b>Films enregistrés : </b>" + stats[0]);
        $(".number_to_see").html("<b>Films à voir : </b>" + stats[2]);
        $(".number_seen").html("<b>Films vus : </b>" + stats[3]);
        $(".number_favorite").html("<b>Favoris : </b>" + stats[4]);
        $(".number_people").html("<b>Artistes enregistrés : </b>" + stats[1]);
        $(".number_tags").html("<b>Tags : </b>" + stats[5]);
        $(".username").html("<b>Nom d'utilisateur : </b>" + "<i>•••••••••</i>");
        $(".password").html("<b>Mot de passe : </b><i>•••••••••</i>");
        $(".edit_username").click(AccountDisplayer.editUsername);
        $(".edit_pass").click(AccountDisplayer.editPass);
        $(".clean_account").click(AccountDisplayer.erase);
        $(".delete_account").click(AccountDisplayer.delete);
        $(".main").children().addClass("animation_toUp");
    }

    static editUsername() {
        $(".displayer_modifier").children().remove();
        $(".title_modifier h5").text("Changer de nom d'utilisateur :");
        let form = $("<form method='get' class='form_account'></form>");
        let newUsername = $("<input type='text' placeholder='Nouveau nom d&apos;utilisateur : '/>");
        let okButton = $("<input type='submit' value='Changer de nom d&apos;utilisateur'/>");
        form.append(newUsername, "<br/>", okButton);
        $(".displayer_modifier").append(form);
        AccountDisplayer.openModal();
        $(form).submit(function(e) {
            e.preventDefault();
            let text = $(newUsername).val();
            DataHandler.setNewUsername(text);
            AccountDisplayer.closeModal();
        });
    }
    static editPass() {
        $(".displayer_modifier").children().remove();
        $(".title_modifier h5").text("Changer de mot de passe :");
        let form = $("<form method='get' class='form_account'></form>");
        let password = $("<input type='password' placeholder='Nouveau mot de passe : '/>");
        let confirmPassword = $("<input type='password' placeholder='Confirmer votre nouveau mot de passe : '/>");
        let okButton = $("<input type='submit' value='Changer de mot de passe'/>");
        form.append(password, "<br/>", confirmPassword, "<br />", okButton);
        $(".displayer_modifier").append(form);
        AccountDisplayer.openModal();
        $(form).submit(function(e) {
            e.preventDefault();
            let newPass = $(password).val();
            if ($(confirmPassword).val() == newPass) {
                DataHandler.setNewPassword(newPass);
                AccountDisplayer.closeModal();
            }
            else {
                alert("Les mots de passes ne concordent pas, veuillez réessayer.");
            }
        });
    }
    static erase() {
        $(".displayer_modifier").children().remove();
        $(".title_modifier h5").text("Effacer votre vidéothèque :");
        let form = $("<form method='get' class='form_account'></form>");
        let inform = $("<p>Êtes-vous sur de vouloir effacer votre vidéothèque ? Cette action est irréversible.</p>");
        let okButton = $("<input type='submit' value='Vider ma vidéothèque'/>");
        form.append(inform, "<br/>", okButton);
        $(".displayer_modifier").append(form);
        AccountDisplayer.openModal();
        $(form).submit(function(e) {
            e.preventDefault();
            DataHandler.eraseAccount();
        });
        
    }

    static delete() {
        $(".displayer_modifier").children().remove();
        $(".title_modifier h5").text("Supprimer votre compte :");
        let form = $("<form method='get' class='form_account'></form>");
        let inform = $("<p>Êtes-vous sur de vouloir supprimer votre compte ? Cette action est irréversible et conduira à la suppression de toutes vos données enregistrées. Vous ne pourrez plus y accéder une fois le compte supprimé  .</p>")
        let okButton = $("<input type='submit' value='Supprimer mon compte'/>");
        form.append(inform, "<br/>", okButton);
        $(".displayer_modifier").append(form);
        AccountDisplayer.openModal();
        $(form).submit(function(e) {
            e.preventDefault();
            DataHandler.removeAccount();
        });
    }

    static openModal() {
        $("#overlay").fadeIn(200);
        $("#overlay").click(AccountDisplayer.closeModal);
        $("#modifier_wrap").addClass("zoomIn");
        $("#modifier_wrap").css("display", "block");
    }

    static closeModal() {
        $("#overlay").fadeOut(200);
        $("#modifier_wrap").removeClass("zoomIn");
        $("#modifier_wrap").addClass("zoomOut");
        setTimeout(() => {
            $("#modifier_wrap").css("display", "none");
        }, 400);
    }
}