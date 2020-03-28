import {MovieDisplayer} from './movieDisplayer.js';
import {PersonDisplayer} from './personDisplayer.js';
import {TagDisplayer} from './tagDisplayer.js';
import {DataHandler} from './dataHandler.js';

export function onlineSearch(query) {
    "use strict";
    $(".navBar_results").children().remove(); 
    $(".navBar_results").html("<img class='loader_search' src='/images/loader_search.gif' alt='Chargement...' />");
    //we use the api to transfer data to movie view after that
    let url = "https://api.themoviedb.org/3/search/multi?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR&page=1&include_adult=false&query="+query; 
    var request = $.get(url, (data) => { //we launch the research
        $(".loader_search").remove();        
        let max = (data.total_results < 5) ? data.total_results-1 : 5;     //we get only 5 results or less
        for (let i = 0; i < max; i++) { //for each movie got
            let movie = data.results[i]; //we get it
            if (movie) {
                if (movie.media_type == "movie") {
                    addMovie(movie.id, movie);
                }
                else if (movie.media_type == "person") {
                    addPeople(movie.id, movie);
                }
                else if (movie.media_type == 'tv') {
                    max++;
                    continue;
                }
            }
        }
        if (max < 1) {
            $(".navBar_results").children().remove(); 
            $(".navBar_results").append("<div class='navBar_noResults'><span>Aucuns résultats pour cette recherche...</span><div>");    
        }
    });
    return request;
}

export function searchLocal(query) {
    "use strict";
    $(".navBar_results").children().remove();
    $(".loader_search").remove(); 
    let results = [];
    let request = [];
    let moviePeople = DataHandler.getMoviePeople();       
    moviePeople.find(element => {
        if (element && query.length <= element.title.length) {
            //toUpperCase to avoid caps differences
            if (query.toUpperCase() == element.title.slice(0, query.length).toUpperCase()) {
                results.push(element);
            }
        }
    }); 
    results.forEach(element => {
        if(element.type == "movie")
            request.push(addMovie(element.id));
        else if (element.type == "people")
            request.push(addPeople(element.id));
    });
    if (moviePeople.length < 1) {
        $(".navBar_results").children().remove(); 
        $(".navBar_results").append("<div class='navBar_noResults'><span>Aucuns résultats pour cette recherche...</span><div>");    
    }
    return request;
}

export function searchTag(query) {
    "use strict";
    $(".navBar_results").children().remove();
    let localGenre = DataHandler.getSavedTags(undefined, "alpha");
    let results = [];
    console.log(query);
    localGenre.find(element => {
        if (element && query.length <= element.length) {
            //toUpperCase to avoid caps differences
            if (query.toUpperCase() == element.slice(0, query.length).toUpperCase()) {
                results.push(element);
            }
        }
    });
    results.forEach((entry) => {
        addTag(entry);
    });
    if (results.length == 0) {
        $(".navBar_results").children().remove(); 
        $(".navBar_results").append("<div class='navBar_noResults'><span>Aucuns résultats pour cette recherche...</span><div>");    
    }
}

function addMovie(id, data) {
    "use strict";
    if (!data) {
        return $.get("https://api.themoviedb.org/3/movie/"+id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
            let image_loader, image;
            let wrapper = $("<div></div>");
            if (data.poster_path) { //if there is an image
                let url = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
                image_loader = $("<div></div>").addClass("slider_image_loading");
                image = $("<img />").attr("src", url).attr("alt", "Couverture").addClass("navBar_image").click({movie: data, page: document.movie}, MovieDisplayer.launch);
                //we display the image 
            }
            else { //otherwise we create something with the title
                image = $("<div></div>").text(data.title).addClass("navBar_noImage").click({movie: data, page: document.movie}, MovieDisplayer.launch);
                $(wrapper).css("background", document.gradient());
            }
            $(wrapper).addClass("navBar_imageWrapper").append(image, image_loader);
            //we add the image to the wrapper
            $(".navBar_results").append(wrapper); //we add the poster
            $(image).on("load", () => {
                $(image).next().remove();
                $(image).fadeIn(200);            
            });
        });
    }
    else {
        let image_loader, image;
        let wrapper = $("<div></div>");
        if (data.poster_path) { //if there is an image
            let url = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
            image_loader = $("<div></div>").addClass("slider_image_loading");
            image = $("<img />").attr("src", url).attr("alt", "Couverture").addClass("navBar_image").click({movie: data, page: document.movie}, MovieDisplayer.launch);
            //we display the image 
        }
        else { //otherwise we create something with the title
            image = $("<div></div>").text(data.title).addClass("navBar_noImage").click({movie: data, page: document.movie}, MovieDisplayer.launch);
            $(wrapper).css("background", document.gradient());
        }
        $(wrapper).addClass("navBar_imageWrapper").append(image, image_loader);
        //we add the image to the wrapper
        $(".navBar_results").append(wrapper); //we add the poster
        $(image).on("load", () => {
            $(image).next().remove();
            $(image).fadeIn(200);            
        });
    }
}

function addPeople(id, data) {
    "use strict";
    if (!data) {
        return $.get("https://api.themoviedb.org/3/person/"+id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
            var image;
            let image_loader;
            let wrapper = $("<div></div>");
            if (data.profile_path) {
                let url = "https://image.tmdb.org/t/p/w500/" + data.profile_path;
                image = $("<img />").attr("src", url).attr("alt", "Couverture").addClass("navBar_image").click({person: data, page: document.person}, PersonDisplayer.launch);
                image_loader = $("<div></div>").addClass("slider_image_loading");
            }
            else { //otherwise we create something with the title
                image = $("<div></div>").text(data.name).addClass("navBar_noImage").css("background", document.gradient()).click({person: data, page: document.person}, PersonDisplayer.launch);
                $(wrapper).css("background", document.gradient());
            }
            $(wrapper).addClass("navBar_imageWrapper").append(image, image_loader);
            //we add the image to the wrapper
            $(".navBar_results").append(wrapper); //we add the poster
            $(image).on("load", () => {
                $(image).next().remove();
                $(image).fadeIn(200);
            });
        });
    }
    else {
        var image;
        let image_loader;
        let wrapper = $("<div></div>");
        if (data.profile_path) {
            let url = "https://image.tmdb.org/t/p/w500/" + data.profile_path;
            image = $("<img />").attr("src", url).attr("alt", "Couverture").addClass("navBar_image").click({person: data, page: document.person}, PersonDisplayer.launch);
            image_loader = $("<div></div>").addClass("slider_image_loading");
        }
        else { //otherwise we create something with the title
            image = $("<div></div>").text(data.name).addClass("navBar_noImage").css("background", document.gradient()).click({person: data, page: document.person}, PersonDisplayer.launch);
            $(wrapper).css("background", document.gradient());
        }
        $(wrapper).addClass("navBar_imageWrapper").append(image, image_loader);
        //we add the image to the wrapper
        $(".navBar_results").append(wrapper); //we add the poster
        $(image).on("load", () => {
            $(image).next().remove();
            $(image).fadeIn(200);
        });
    }
}

function addTag(tag) {
    "use strict";
    let tag_disp = $("<span></span>").addClass("navBar_noImage").append(tag);
    let wrapper = $("<div></div>").addClass("navBar_imageWrapper").css("background", document.gradient()).click({genre: tag}, TagDisplayer.create).append(tag_disp);
    $(".navBar_results").append(wrapper); //we add the poster
}