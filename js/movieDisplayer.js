import { PersonDisplayer } from "./personDisplayer.js";
import { DataHandler } from "./dataHandler.js";
import {TagDisplayer} from "./tagDisplayer.js";

export class MovieDisplayer { 
    constructor(event) {
        document.isHome = false;
        this.page = $(event.data.page).clone(); //We make a deep copy of the page in order to keep a clean page
        $(".main").children().remove();
        $(".navBar_results").children().remove(); 
        $(".main").append(this.page);
        $(".main_movie").hide();
        $(".loader_img").css("opacity", 1);
        if (event.data.load) {
            $.get("https://api.themoviedb.org/3/movie/"+event.data.movie.id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
                this.movie = data;
                this.genre_list = document.genre_list;
                this.hydrate();
                this.ended = true;
                history.pushState(null, "", "#/movie/"+this.movie.id);
            });
        }
        else {
            this.movie = event.data.movie;
            this.genre_list = document.genre_list;
            this.hydrate();
            this.ended = true;
            history.pushState(null, "", "#/movie/"+this.movie.id);
        }
    }
    static launch(event) {
        return new MovieDisplayer(event);
    }

    hydrate() {
        //set the poster and format the date
        let options = {year: 'numeric', month: 'long', day: 'numeric' };
        let date = new Date(this.movie.release_date).toLocaleDateString("fr-FR", options);

        $("html, body").animate({scrollTop: 0}, 400);    
        $(".title_movie").html("<b>Titre : </b>" + this.movie.title);    
        $(".resume_movie").text(this.movie.overview);
        $(".releaseDate_movie").html("<b>Date de parution :</b> " + date);
        if (this.movie.poster_path) {
            let poster = "https://image.tmdb.org/t/p/w500"  + this.movie.poster_path;
            $(".imagePoster_movie").attr("src", poster).on("load", function() {
                $(this).next().remove();
                $(this).fadeIn(200);
            });
        }   
        else {
            $(".imagePoster_loader").remove();
        }
        $.get("/php/getlanguage.php?language=" + this.movie.original_language, (data) => {
            $(".originalLanguage_movie").html("<b>Langue originale :</b> " + data); 
        });
        if (DataHandler.isSavedMovie(this.movie.id)) {
            $(".add_movie").find("i").text("done");
            $(".add_movie").find("a").text("Ajouté à la bibliothèque");
            $(".add_movie").click({id: this.movie.id, movie: this.movie}, DataHandler.removeMovie);
            if (DataHandler.isToSeeMovie(this.movie.id)) {
                $(".add_to_see").find("i").text("playlist_added");
                $(".add_to_see").find("a").text("Ajouté aux films à voir");
                $(".add_to_see").click({id: this.movie.id}, DataHandler.removeTo_see);
            }
            else {
                $(".add_to_see").find("i").text("playlist_add");
                $(".add_to_see").find("a").text("Ajouter aux films à voir");
                $(".add_to_see").click({id: this.movie.id}, DataHandler.addTo_see);
            }
            if (DataHandler.isSeenMovie(this.movie.id)) {
                $(".add_seen").find("i").text("video_library");
                $(".add_seen").find("a").text("Ajouté aux films vus");
                $(".add_seen").click({id: this.movie.id}, DataHandler.removeSeen);
            }
            else {
                $(".add_seen").find("i").text("library_add");
                $(".add_seen").find("a").text("Ajouter aux films vus");
                $(".add_seen").click({id: this.movie.id}, DataHandler.addSeen);
            }
            if (DataHandler.isFav(this.movie.id)) {
                $(".add_fav").find("i").text("favorite");
                $(".add_fav").find("a").text("Ajouté aux favoris");
                $(".add_fav").click({id: this.movie.id}, DataHandler.removeFav);
            }
            else {
                $(".add_fav").find("i").text("favorite_border");
                $(".add_fav").find("a").text("Ajouter aux favoris");
                $(".add_fav").click({id: this.movie.id}, DataHandler.addFav);
            }
            let localMovieDatas = DataHandler.getMovie(this.movie.id);
            if (localMovieDatas.genre) {
                localMovieDatas.genre.forEach((entry) => {
                    if (entry) {
                        $(".tags_movie").append("<span class='pimped_tags'><a>" + entry + "</a><i class='material-icons'>close</i></span>");
                        $(".tags_movie").children().last().click({genre: entry}, TagDisplayer.create);
                        $(".tags_movie").children().last().find("i").click({id: this.movie.id}, MovieDisplayer.removeGenre);
                    }   
                });
            }
            $(".tags_movie").append("<span class='add_genre'><i class='material-icons'>add</i></span>");
            $(".tags_movie").find(".add_genre").click({id: this.movie.id, page: this}, MovieDisplayer.addGenre);
        }   
        else {
            $(".add_movie").find("i").text("add");
            $(".add_movie").find("a").text("Ajouter à la bibliothèque");
            $(".add_movie").click({movie: this.movie, page: this}, DataHandler.addMovie);
            $(".add_to_see").hide();
            $(".add_seen").hide();
            $(".add_fav").hide();

             //we add all the differents tags
            //For each Id of the film
            if (!this.movie.genre_ids) {    //if there is a different list of genre
                this.movie.genre_ids = [];
                this.movie.genres.forEach((e) => {
                    this.movie.genre_ids.push(e.id);
                });
            }
            this.movie.genre_ids.forEach((e) => {
                var genre_movie = e;
                //for each id of exicting genre
                $(this.genre_list.genres).each(function() {
                    //we check if it match
                    if (this.id == genre_movie) {
                        //we display it
                        $(".tags_movie").append("<span><a>"+this.name+"<a></span>");     
                        $(".tags_movie").children().last().click({genre: this.name}, TagDisplayer.create);
                    }
                });
            });
        }
        //Url to get the casting infos
        let crewUrl = "https://api.themoviedb.org/3/movie/"+this.movie.id+"/credits?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR";
        $.get(crewUrl, (data) => {  //We get the datas
            let casting = data.cast;
            let crew = data.crew;
            //we get only 10 results or less
            let max = (casting.length < 10) ? casting.length : 10;     
            for (let i = 0; i < max; i++) {
                let image = $("<img />").attr("alt", "Chargement...");
                if (casting[i].profile_path != null) {
                    let profile = "https://image.tmdb.org/t/p/w500" + casting[i].profile_path;
                    image = $(image).attr("src", profile);
                }
                else
                    image = $(image).attr("src", "/images/unknown.jpg");

                let character = casting[i].character;
                let name = casting[i].name;
                let image_loader = $("<div></div>").addClass("slider_image_loading");
                let element = $("<div class='casting_el slider_el_widget'></div>");
                $(element).append(image, image_loader, "<br /><span class='name slider_text_widget'>"+name+"</span><br /><span class='role slider_text_widget'>"+character+"</span>");
                //We add the datas to casting_disp
                $(".casting_disp").append(element);
                $(".casting_el").last().click({person: casting[i], page: document.person}, PersonDisplayer.launch);
                
                $(image).on("load", () => {
                    $(image).next().remove();
                    $(image).fadeIn(200);
                });
            }
            let displayer = $(".casting_disp");
            $(displayer).find(".loader_img").remove();
            $(displayer).children().fadeIn(400);

            if ($(".casting_disp").children().length == 0) //If there is'nt picture we hide the crew window
                $(".casting_wrap").fadeOut(200);
            else  //else we display it
                $(".casting_wrap").css("display", "flex");
            
            max = (crew.length < 10) ? crew.length : 10;
            for (let i = 0; i < max; i++) {
                let image = $("<img />").attr("alt", "Chargement...");

                if (crew[i].profile_path != null) {
                    let profile = "https://image.tmdb.org/t/p/w500" + crew[i].profile_path;
                    image = $(image).attr("src", profile);
                }
                else
                    image = $(image).attr("src", "/images/unknown.jpg");
                let job = crew[i].job;  
                let name = crew[i].name;
                let image_loader = $("<div></div>").addClass("slider_image_loading");
                let element = $("<div class='crew_el slider_el_widget'></div>");
                $(element).append(image, image_loader, "<br /><span class='name slider_text_widget'>"+name+"</span><br /><span class='role slider_text_widget'>"+job+"</span>");
                $(".crew_disp").append(element);
                $(element).click({person: crew[i], page: document.person}, PersonDisplayer.launch);

                $(image).on("load", () => {
                    $(image).next().remove();
                    $(image).fadeIn(200);
                });
            }
            let displayer_crew = $(".crew_disp");
            $(displayer_crew).find(".loader_img").remove();
            $(displayer_crew).children().fadeIn(400);
            if ($(displayer_crew).children().length == 0) //If there is'nt picture we hide the crew window
                $(".crew_wrap").fadeOut(200);
            else  //else we display it
                $(".crew_wrap").css("display", "flex");

            $(".main_movie").fadeIn(400);
            $("#wrapper_movie").find(".loader_img").first().hide();
            
        });
        let videoUrl = "https://api.themoviedb.org/3/movie/"+this.movie.id+"/videos?api_key=a6499d6e1a486416773626640f79de9d";
        $.get(videoUrl, (data) => {
            $(".trailer").hide();                
            $(data.results).each(function() {
                if (this.type == ("Trailer" || "Teaser")) {
                    let iframe = $('<iframe src="https://www.youtube.com/embed/' + this.key+ '" frameborder="0" class="trailer"></iframe>');
                    $("#wrapper_movie").append(iframe);
                    $(iframe).on("load", () => {
                        $(iframe).fadeIn(400);
                    });
                    return false;
                } 
            });
            
        });
    }

    static addGenre(event) {
        // $(".add_genre").html("<input type='text' />");
        let newTag = $("<span contenteditable='true'></span>");
        $(newTag).insertBefore($(".add_genre"));
        $(newTag).focus();
        $(newTag).keypress((e) => {
            if (e.which == 13) {
                let text = $(newTag).text();
                $(newTag).html("<a>"+ text + "</a><i class='material-icons'>close</i>");
                $(newTag).attr("contenteditable", false).addClass("pimped_tags");
                DataHandler.addGenreMovie(event.data.id, text);
                DataHandler.saveData();
                $(newTag).unbind("keypress");
                $(newTag).find("a").click({genre: text}, TagDisplayer.create);
                $(newTag).find("i").click({id: event.data.id}, MovieDisplayer.removeGenre);
            }
        });
    }

    static removeGenre(event) {
        if (DataHandler.removeGenreMovie(event.data.id, $(this).parent().find("a").text())) {
            $(this).parent().remove();
            DataHandler.saveData();
        }
    }
}