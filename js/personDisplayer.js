import { MovieDisplayer } from "./movieDisplayer.js";
import { DataHandler } from "./dataHandler.js";
import { TagDisplayer } from "./tagDisplayer.js";

export class PersonDisplayer {
    constructor(event) {
        document.isHome = false;
        this.person = event.data.person; //We make a deep copy of the page in order to keep a clean page
        this.page = $(event.data.page).clone();
        $(".main").children().remove();
        $(".navBar_results").children().remove(); 
        $(".main").append(this.page);
        $(".main_person").hide();
        $(".loader_img").css("opacity", 1);
        $(".loader_img").css("display", "block");
        $.get("https://api.themoviedb.org/3/person/"+this.person.id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
            this.details = data;
            this.hydrate();
            history.pushState(null, "", "#/person/"+this.person.id);
            
        });
    }

    static launch(event) {
        return new PersonDisplayer(event);
    }

    hydrate() {
        let options = {year: 'numeric', month: 'long', day: 'numeric' };
        let birthday = new Date(this.details.birthday).toLocaleDateString("fr-FR", options);
        $("html, body").animate({scrollTop: 0}, 400);    
        $(".name_person").html("<b>Nom : </b>" + this.details.name);
        if (this.details.biography) {
            $(".resume_person").text(this.details.biography);     
        }
        else {
            $(".resume_person").hide();
        }       
        if (this.details.profile_path) {
            let poster = "https://image.tmdb.org/t/p/w500"  + this.details.profile_path;
            let image = $(".imagePoster_person");
            $(image).attr("src", poster);
            $(image).on("load", () => {
                $(image).next().remove();
                $(image).fadeIn(200);
            });
        }   
        else {
            $(".imagePoster_loader").remove();
        }
        
        $(".birthday_person").html("<b>Date de naissance : </b>" + birthday);
        if (this.details.deathday) {
            let deathday = new Date(this.details.deathday).toLocaleDateString("fr-FR", options);
            $(".deathday_person").html("<b>Date de mort : </b>" + deathday);
        }
        else 
            $(".deathday_person").hide();
        
        if (DataHandler.isSavedPeople(this.person.id)) {
            $(".add_person").find("i").text("done");
            $(".add_person").find("a").text("Ajouté à la bibliothèque");
            $(".add_person").click({id: this.person.id, person: this.person}, DataHandler.removePeople);
            $(".tags_movie").show();            
            let localPersonDatas = DataHandler.getPeople(this.person.id);
            if (localPersonDatas.genre) {
                localPersonDatas.genre.forEach((entry) => {
                    if (entry) {
                        $(".tags_movie").append("<span class='pimped_tags'><a>" + entry + "</a><i class='material-icons'>close</i></span>");
                        $(".tags_movie").children().last().find("i").click({id: this.person.id}, this.removeGenre);
                        $(".tags_movie").children().last().find("a").click({genre: entry}, TagDisplayer.create);
                    }
                });
            }
            $(".tags_movie").append("<span class='add_genre'><i class='material-icons'>add</i></span>");
            $(".tags_movie").find(".add_genre").click({id: this.person.id, page: this}, this.addGenre);
        }   
        else {
            $(".add_person").find("i").text("add");
            $(".add_person").find("a").text("Ajouter à la bibliothèque");
            $(".add_person").click({person: this.person, page: this}, DataHandler.addPeople);
        }
        $(".main_person").fadeIn(400);
        $("#wrapper_person").find(".loader_img").first().hide();
        //Url to get the casting infos
        let crewUrl = "https://api.themoviedb.org/3/person/"+this.person.id+"/movie_credits?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR";
        $.get(crewUrl, (data) => {  //We get the datas
            let casting = data.cast;
            //we get only 10 results or less
            let max = (casting.length < 10) ? casting.length : 10;     
            for (let i = 0; i < max; i++) {
                let image = $("<img />").attr("alt", "Chargement...");
                if (casting[i].poster_path != null) {
                    let url = "https://image.tmdb.org/t/p/w500/" + casting[i].poster_path;
                    image = $(image).attr("src", url);
                }
                else
                    image = $(image).attr("src", "/images/cinema.png");
                
                let image_loader = $("<div></div>").addClass("slider_image_loading");
                let character = casting[i].character;
                let title = casting[i].title;
                let element = $("<div class='known_el slider_el_widget'></div>");
                $(element).append(image, image_loader, "<br /><span class ='name slider_text_widget'>"+character+"</span><br /><span class='role slider_text_widget'>"+title+"</span>");
                //We add the datas to known_disp
                $(".known_disp").append(element);
                $(element).click({movie: casting[i], page: document.movie}, MovieDisplayer.launch);
                $(image).on("load", () => {
                    $(image).next().remove();
                    $(image).fadeIn(200);
                });
            }

            if (max == 0) { //If there is'nt picture we hide the crew window
                $(".known_wrap").fadeOut(200);
            }
            else {  //else we display it
                $(".known_wrap").css("display", "flex");
            }
        }).done(() => {
            let displayer = $(".known_disp");
            $(displayer).find(".loader_img").remove();
            $(displayer).children().fadeIn(400);
        });
    } 

    //Methode to add Genre
    addGenre(event) {
        let newTag = $("<span contenteditable='true'></span>");
        $(newTag).insertBefore($(".add_genre"));
        $(newTag).focus();
        $(newTag).keypress((e) => {
            if (e.which == 13) {
                let text = $(newTag).text();
                $(newTag).html("<a>" + text + "</a><i class='material-icons'>close</i>");
                $(newTag).attr("contenteditable", false).addClass("pimped_tags");
                DataHandler.addGenrePeople(event.data.id, text);
                DataHandler.saveData();
                $(newTag).unbind("keypress");
                $(newTag).find("a").click({genre: text}, TagDisplayer.create);
                $(newTag).find("i").click({id: event.data.id}, event.data.page.removeGenre);
            }
        });
    }
    //Methode to remove genre
    removeGenre(event) {
        //if it exists we remove it and we save the data
        if (DataHandler.removeGenrePeople(event.data.id, $(this).parent().find("a").text())) {
            $(this).parent().remove();
            DataHandler.saveData();
        }
    }
}