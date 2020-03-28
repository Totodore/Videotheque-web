import {PersonDisplayer} from './personDisplayer.js';
import {MovieDisplayer} from './movieDisplayer.js';
import { DataHandler } from './dataHandler.js';

export class TagDisplayer {
    constructor(genre) {
        this.page = $(document.tag).clone();
        $(".main").children().remove();
        $(".navBar_results").children().remove(); 
        $(".main").append(this.page);
        this.genre = genre;
        $(".title").text("Tag : " + this.genre);
        this.iterate(DataHandler.getMoviesPeopleFromTag(this.genre));
        history.pushState(null, "", "#/tag/"+genre);

        $(".main").children().addClass("animation_toUp");        
    }
    static create(event) {
        return new TagDisplayer(event.data.genre);
    }

    iterate(elements) {
        elements.forEach((entry) => {
            let loader;
            let img;
            let title = $("<span></span>").text(entry.title);
            let element = $("<div></div>").addClass("displayer_el");
            loader = $("<div></div>").addClass("slider_image_loading");
            if (entry.image_url != "/images/unknown.jpg") {  //if there is one
                img = $("<img />").attr("src", "https://image.tmdb.org/t/p/w500" + entry.image_url);
            }
            else {  //otherwise : 
                img = $("<img />").attr("src", entry.image_url);
            }
            $(element).append(img, loader, "<br />", title);

            $(element).click({type: entry.type, data: entry}, this.onclick);
            
            $(".displayer li").append(element);

            $(img).on("load", () => {
                $(img).next().remove();
                $(img).fadeIn();
            });
        });
        if (elements.length == 0) {
            $(".displayer li").html("<div class='displayer_noData'><span>Aucun film ne possède encore ce tag, ajoutez en un !</span></div>");
        }
        $(".displayer li").addClass("animation_toUp");
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
        else if (event.data.type == "movie") {
            let data_sender = {};
            data_sender.data = {
                page: document.movie,
                movie: event.data.data,
                load: true
            };
            MovieDisplayer.launch(data_sender);
        }
    }
} 