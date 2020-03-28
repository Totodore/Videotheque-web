import {MovieDisplayer} from "./movieDisplayer.js";
import {PersonDisplayer} from "./personDisplayer.js";
import { DataHandler } from "./dataHandler.js";
import { TagDisplayer } from "./tagDisplayer.js";

export class SavedDisplayer {
    constructor(type, data) {
        this.type = type;
        this.URLType = type;
        this.length = data.length;
        this.actualIndex = 0;
        this.count = (data.length < 10) ? data.length : 10;
        this.data = data;
        if (this.type == "people") { //if its type is people we change it to person
            this.URLType = "person";
        }

        if (data.length == 0) {
            if (this.type == "movie")
                $(".disp_movie").append("<div class='displayer_noData'><span>Ajoutez un film à votre vidéothèque pour qu'il apparaisse ici !</span></div>");
            else if (this.type == "people")
                $(".disp_people").append("<div class='displayer_noData'><span>Ajoutez un artiste à votre vidéothèque pour qu'il apparaisse ici !</span></div>");
            else if (this.type == "tags")
                $(".disp_tags").append("<div class='displayer_noData'><span>Ajoutez un tag à votre vidéothèque pour qu'il apparaisse ici !</span></div>");
            else if (this.type == "to_see")
                $(".disp_to_see").append("<div class='displayer_noData'><span>Vous n'avez aucun film à voir pour le moment !</span></div>");
            else if (this.type == "seen")
                $(".disp_seen").append("<div class='displayer_noData'><span>Vous n'avez regardé aucun film pour le moment !</span></div>");
            else if (this.type == "fav")               
                $(".disp_fav").append("<div class='displayer_noData'><span>Ajoutez un film à vos favoris pour qu'il apparaisse ici !</span></div>")
        }
        else {
            $(window).off("scroll", this.scroll);
            $(window).scroll({self: this},this.scroll);
            this.update();
        }
    }
    scroll(event) {
        self = event.data.self;
        if (($(window).scrollTop()+50) > $(document).height()-$(window).height()){
            self.update();
        }
    }
    update() {
        if (this.actualIndex < this.length) {
            this.count = (this.length < this.actualIndex + 10) ? this.length : this.actualIndex + 10;
            this.data.slice(this.actualIndex, this.count).forEach(entry => {
                this.hydrate(entry);
            });
            this.actualIndex = this.count;
        }
    }
    hydrate(entry) {
        let img;
        let loader;
        let title = $("<span></span>").text(entry.title || entry);
        let element = $("<div></div>").addClass("displayer_el");
        if (this.type != "tags") {
            loader = $("<div></div>").addClass("slider_image_loading");
            if ((entry.image_url != "/images/unknown.jpg") && (entry.image_url != "/images/cinema.png")) {
                img = $("<img />").attr("src", "https://image.tmdb.org/t/p/w500" + entry.image_url);
            }
            else 
                img = $("<img />").attr("src", entry.image_url);
            $(element).append(img, loader, "<br />", title);
        }
        else {
            img = $("<div></div>").addClass("displayer_el_tag").css("background", document.gradient());
            $(img).append(title);
            $(element).append(img);
        }
        $(element).click({type: this.type, data: entry}, this.onclick);
        $(".disp_" + this.type).append(element);

        $(img).on("load", () => {
            $(img).next().remove();
            $(img).fadeIn();
        });
    }

    onclick(event) {
        if (event.data.type == "people") {
            let data_sender = {};
            data_sender.data = {
                page: document.person,
                person: event.data.data
            };
            PersonDisplayer.launch(data_sender);
        }
        else if (event.data.type == "movie" || event.data.type == "to_see" 
        || event.data.type == "seen" || event.data.type == "fav") {
            let data_sender = {};
            data_sender.data = {
                page: document.movie,
                movie: event.data.data,
                load: true
            };
            MovieDisplayer.launch(data_sender);
        }
        else if (event.data.type == "tags") {
            let data_sender = {};
            data_sender.data = {
                genre: event.data.data
            }
            TagDisplayer.create(data_sender);
        }
    }
    static init() {
        //parse URL :
        let hash = location.hash;
        let parameters = hash.split("/");

        if (parameters[2] && parameters[2].length > 2) {
            let type = parameters[2];
            if (type == "movie") {
                $(".subsort_movie").addClass("animation_toDown");
                $(".subsort_movie > .selected_sort").removeClass("selected_sort");
                $(".subsort_movie > ."+parameters[3]).addClass("selected_sort");
                $(".disp_"+parameters[3]).addClass("animation_toUp");
                SavedDisplayer.update(parameters[3]);
            }
            else {
                $(".disp_"+parameters[2]).addClass("animation_toUp");
                SavedDisplayer.update(parameters[2]);
            }
            $(".sort > .selected_sort").removeClass("selected_sort");
            $(".sort > ."+parameters[2]).addClass("selected_sort");
        } else {
            $(".subsort_movie").addClass("animation_toDown");   
            SavedDisplayer.update("movie", "alpha"); 
        }        
        

        $(".sort > span").click(function() {
            let type = $(this).attr("class");
            //if it's a different button
            if (!$(this).hasClass("selected_sort")) {
                history.pushState(null, "", "#/saved/" + type + "/");
                //we change style
                $(".sort > .selected_sort").removeClass("selected_sort");
                $(this).addClass("selected_sort");
                if (type == "movie") {
                    $(".subsort_movie").addClass("animation_toDown");
                    let subtype = $(".subsort_movie > .selected_sort").attr("class").split(" ")[0];
                    if (subtype && subtype != "movie") {
                        SavedDisplayer.update(subtype, "alpha");                
                        $(".disp_" + subtype).addClass("animation_toUp");
                    }
                    else {
                        SavedDisplayer.update("movie", "alpha");
                        $(".disp_movie").addClass("animation_toUp");
                    }
                }
                else {
                    $(".animation_toDown").removeClass("animation_toDown");
                    $("ul > .animation_toUp").removeClass("animation_toUp");
                    SavedDisplayer.update(type, "alpha");
                    $(".disp_" + type).addClass("animation_toUp");
                }
            }
        });
        $(".subsort_movie > span").click(function() {
            let type = $(this).attr("class");
            if (!$(this).hasClass("selected_sort")) {
                history.pushState(null, "", "#/saved/movie/" + type + "/");
                
                $(".subsort_movie > .selected_sort").removeClass("selected_sort");
                $(this).addClass("selected_sort");

                SavedDisplayer.update(type, "alpha");
                $(".disp_" + type).addClass("animation_toUp");                
            }
        });
    }
    static update(type, sort) {
        $(".displayer li").children().remove();
        if (type == "movie")
            new SavedDisplayer(type, DataHandler.getSavedMovies(-1, 0, sort));
        else if (type == "to_see")
            new SavedDisplayer(type, DataHandler.getSavedTo_see(-1, 0, sort));
        else if (type == "seen")
            new SavedDisplayer(type, DataHandler.getSavedSeen(-1, 0, sort));
        else if (type == "people")
            new SavedDisplayer(type, DataHandler.getSavedPeople(-1, 0, sort));
        else if (type == "tags")
            new SavedDisplayer(type, DataHandler.getSavedTags(-1, 0, sort));
        else if (type == "fav")
            new SavedDisplayer(type, DataHandler.getSavedFav(-1, 0, sort));
    }
    
}