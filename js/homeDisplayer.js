import {DataHandler} from './dataHandler.js';
import {MovieDisplayer} from './movieDisplayer.js';
import {PersonDisplayer} from './personDisplayer.js';
export class HomeDisplayer {
    constructor() {
        document.isHome = true;
        this.loadedPeopleImage = 0;
        this.loadedMovieImage = 0;
        let last_movies = DataHandler.getSavedMovies(0, 10, "date");
        if (last_movies.length == 0) {
            $("#typesMovies_wrapper").hide();
        }
        else {
            //get the 10 last movies
            let max = (last_movies.length < 10) ? last_movies.length : 9;
            this.fetchMovie(0, last_movies, max);  
            //getch the first movie
        }
        let last_people = DataHandler.getSavedPeople(0, 10, "date");
        if (last_people.length == 0) {
            $("#actorMovies_wrapper").hide();
        }
        else {
            let max = (last_people.length < 10) ? last_people.length : 9;
            this.fetchPeople(0, last_people, max);
        }
        // let last_to_see = DataHandler.getSavedTo_see(0, 10, "date");
        // if (last_to_see.length == 0)
        //     $("#to_seeMovies_wrapper").hide();
        // else {
        //     let max = (last_to_see.length < 10) ? last_to_see.length : 9;
        //     this.fetchTo_see(0, last_to_see, max);
        // }    

        // let last_seen = DataHandler.getSavedSeen(0, 10, "date");
        // console.log(last_seen);
        // if (last_seen.length == 0)
        //     $("#seenMovies_wrapper").hide();
        // else {
        //     let max = (last_seen < 10) ? last_seen.length : 9;
        //     this.fetchSeen(0, last_seen, max);
        // }
            $("#to_seeMovies_wrapper").hide();
            $("#favoriteMovies_wrapper").hide();
            $("#seenMovies_wrapper").hide();
        this.fetchPopular(); 
        this.fetchMoviePopularity();
        if (document.genre_list) {
            this.fetchTagRated();
        }
        this.totalImage = 10;

    }
    //We do this recursive function which launch request one by one to keep the order of the movies, otherwise the movies are displayed randomly according to the fetching speed 
    fetchMovie(index, entries, max) {
        $.get("https://api.themoviedb.org/3/movie/"+entries[index].id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
            let image = $("<img />").attr("alt", "Chargement...").addClass("sample_el_image");
            if (data.poster_path != null) {
                let url = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
                image = $(image).attr("src", url);
            }
            else
                image = $(image).attr("src", "/images/cinema.png");
            let image_loader = $("<div></div>").addClass("slider_image_loading");
            let title = $("<span></span>").text(data.title).addClass("sample_name").addClass("slider_text_widget");
            let wrapper = $("<div></div>").addClass("sample_el").addClass("slider_el_widget").append(image, image_loader, "<br />", title).click({movie: data, page: document.movie}, MovieDisplayer.launch);
            //we add the image to the wrapper
            $(".sample_disp_movie").append(wrapper); //we add the poster
            $(image).on("load", () => {
                $(image).next().remove();
                $(image).fadeIn(200);
            });
        }).done(() => { 
            //if there it's not the last one we fetch the next
            if (index < max-1) {
                this.fetchMovie(index+1, entries, max);
            }
            else {
                let displayer = $(".sample_disp_movie");
                $(displayer).find(".loader_img").remove();
                $(displayer).children().fadeIn(400);
            }
        });
    }
    //Same reason that above
    fetchPeople(index, entries, max) {
        $.get("https://api.themoviedb.org/3/person/"+entries[index].id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
            let image = ("<img />");
            if (data.profile_path != null) {
                let url = "https://image.tmdb.org/t/p/w500/" + data.profile_path;
                image = $(image).attr("src", url);
            }
            else {
                image = $(image).attr("src", "/images/unknown.jpg");
            }
            image = $(image).attr("alt", "Couverture").addClass("sample_el_image");
            let image_loader = $("<div></div>").addClass("slider_image_loading");
            let title = $("<span></span>").text(data.name).addClass("sample_name").addClass("slider_text_widget");
            let wrapper = $("<div></div>").addClass("sample_el").addClass("slider_el_widget").append(image, image_loader, "<br/><br />", title).click({person: data, page: document.person}, PersonDisplayer.launch);
            //we add the image to the wrapper
            $(".sample_disp_people").append(wrapper); //we add the poster
            $(image).on("load", () => {
                $(image).next().remove();                
                $(image).fadeIn(200);
            });
            
        }).done(() => {
            if (index < max-1) {
                this.fetchPeople(index+1, entries, max);
            }
            else {
                let displayer = $(".sample_disp_people");
                $(displayer).find(".loader_img").remove();
                $(displayer).children().fadeIn(400);
            }
        });
    }
    fetchTo_see(index, entries, max) {  
        $.get("https://api.themoviedb.org/3/movie/"+entries[index].id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
            let image = ("<img />");
            if (data.poster_path != null) {
                let url = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
                image = $(image).attr("src", url);
            }
            else {
                image = $(image).attr("src", "/images/unknown.jpg");
            }
            image = $(image).attr("alt", "Couverture").addClass("sample_el_image");
            let image_loader = $("<div></div>").addClass("slider_image_loading");
            let title = $("<span></span>").text(data.title).addClass("sample_name").addClass("slider_text_widget");
            let wrapper = $("<div></div>").addClass("sample_el").addClass("slider_el_widget").append(image, image_loader, "<br/><br />", title).click({movie: data, page: document.movie}, MovieDisplayer.launch);
            //we add the image to the wrapper
            $(".to_see_disp").append(wrapper); //we add the poster
            $(image).on("load", () => {
                $(image).next().remove();                
                $(image).fadeIn(200);
            });
            
        }).done(() => {
            if (index < max-1) {
                this.fetchTo_see(index+1, entries, max);
            }
            else {
                let displayer = $(".to_see_disp");
                $(displayer).find(".loader_img").remove();
                $(displayer).children().fadeIn(400);
            }
        });
    }
    fetchSeen(index, entries, max) {
        $.get("https://api.themoviedb.org/3/movie/"+entries[index].id+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
            let image = ("<img />");
            if (data.poster_path != null) {
                let url = "https://image.tmdb.org/t/p/w500/" + data.poster_path;
                image = $(image).attr("src", url);
            }
            else {
                image = $(image).attr("src", "/images/unknown.jpg");
            }
            image = $(image).attr("alt", "Couverture").addClass("sample_el_image");
            let image_loader = $("<div></div>").addClass("slider_image_loading");
            let title = $("<span></span>").text(data.title).addClass("sample_name").addClass("slider_text_widget");
            let wrapper = $("<div></div>").addClass("sample_el").addClass("slider_el_widget").append(image, image_loader, "<br/><br />", title).click({movie: data, page: document.movie}, MovieDisplayer.launch);
            //we add the image to the wrapper
            $(".to_see_disp").append(wrapper); //we add the poster
            $(image).on("load", () => {
                $(image).next().remove();                
                $(image).fadeIn(200);
            });
            
        }).done(() => {
            if (index < max-1) {
                this.fetchTo_see(index+1, entries, max);
            }
            else {
                let displayer = $(".seen_disp");
                $(displayer).find(".loader_img").remove();
                $(displayer).children().fadeIn(400);
            }
        });
    }
    fetchPopular() {
        let url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR";
        $.get(url, (data) => {
            let max = (data.length < 10) ? data.length : 10;
            for (let i = 0; i < max; i++) {
                let movie = data.results[i];
                let image = ("<img />");
                if (movie.poster_path != null) {
                    let url = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
                    image = $(image).attr("src", url);
                }
                else {
                    image = $(image).attr("src", "/images/cinema.png");
                }
                let image_loader = $("<div></div>").addClass("slider_image_loading");
                image = $(image).attr("alt", "Couverture").addClass("sample_el_image");
                let title = $("<span></span>").text(movie.title).addClass("popular_name").addClass("slider_text_widget");
                let wrapper = $("<div></div>").addClass("popular_el").addClass("slider_el_widget").append(image, image_loader, "<br />", title).click({movie: movie, page: document.movie}, MovieDisplayer.launch);
                //we add the image to the wrapper
                $(".popular_disp").append(wrapper); //we add the poster
                $(image).on("load", () => {
                    $(image).next().remove();                    
                    $(image).fadeIn(200);
                });
            }
            // $(".popular_disp").children().fadeIn(400);
            $(".popular_disp > .loader_img").fadeOut(400);
        }).done(() => {
            let displayer = $(".popular_disp");
            $(displayer).find(".loader_img").remove();
            $(displayer).children().fadeIn(400);
        });
    }
    fetchMoviePopularity() {
        let date = this.randomDate(new Date(1960, 0, 1), new Date()).getFullYear();
        let url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR&primary_release_year="+date;        
        let slider = $("<div></div>").addClass("year_wrap").addClass("slider_widget");
        $(slider).html('<header class="year_head slider_head_widget"><span class="year_title slider_title_widget">Films les plus populaire de '+date+'</span></header><article class="year_disp slider_displayer_widget"><img src="/images/loader.gif" alt="Chargement..." class="loader_img"></article>');
        $(slider).addClass("animation_toRight");
        $("#wrapper_home").append(slider);
        $.get(url, (data) => {
            let max = (data.length < 10) ? data.length : 10;
            for (let i = 0; i < max; i++) {
                let movie = data.results[i];
                let image = $("<img />");
                if (movie.poster_path != null) {
                    let url = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
                    image = $(image).attr("src", url);
                }
                else {
                    image = $(image).attr("src", "/images/cinema.png");
                }
                let image_loader = $("<div></div>").addClass("slider_image_loading");
                image = $(image).attr("alt", "Couverture").addClass("year_el_image");
                let title = $("<span></span>").text(movie.title).addClass("year_name").addClass("slider_text_widget");
                let wrapper = $("<div></div>").addClass("year_el").addClass("slider_el_widget").append(image, image_loader, "<br />", title).click({movie: movie, page: document.movie}, MovieDisplayer.launch);
                //we add the image to the wrapper
                $(slider).find(".year_disp").append(wrapper); //we add the poster
                $(image).on("load", () => {
                    $(image).next().remove();
                    $(image).fadeIn(200);
                });
            }
        }).done(() => {
            let displayer = $(slider).find(".year_disp");
            $(displayer).find(".loader_img").remove();
            $(displayer).children().fadeIn(400);
        });
    }
    fetchTagRated() {
        let rand = this.randomInt(0, 18);
        let genre = document.genre_list.genres[rand];
        let url = "https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR&with_genres="+genre.id;        
        let slider = $("<div></div>").addClass("year_wrap").addClass("slider_widget");
        $(slider).html('<header class="year_head slider_head_widget"><span class="year_title slider_title_widget">Films du genre '+genre.name+'</span></header><article class="year_disp slider_displayer_widget"><img src="/images/loader.gif" alt="Chargement..." class="loader_img"></article>');
        $(slider).addClass("animation_toLeft");
        $("#wrapper_home").append(slider);
        $.get(url, (data) => {
            let max = (data.length < 10) ? data.length : 10;
            for (let i = 0; i < max; i++) {
                let movie = data.results[i];
                let image = ("<img />");
                if (movie.poster_path != null) {
                    let url = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
                    image = $(image).attr("src", url);
                }
                else {
                    image = $(image).attr("src", "/images/cinema.png");
                }
                let image_loader = $("<div></div>").addClass("slider_image_loading");
                image = $(image).attr("alt", "Couverture").addClass("year_el_image");
                let title = $("<span></span>").text(movie.title).addClass("year_name").addClass("slider_text_widget");
                let wrapper = $("<div></div>").addClass("year_el").addClass("slider_el_widget").append(image, image_loader, "<br />", title).click({movie: movie, page: document.movie}, MovieDisplayer.launch);
                //we add the image to the wrapper
                $(slider).find(".year_disp").append(wrapper); //we add the poster
                $(image).on("load", () => {
                    $(image).next().remove();                    
                    $(image).fadeIn(200);
                });
            }
        }).done(() => {
            let displayer = $(slider).find(".year_disp");
            $(displayer).find(".loader_img").remove();
            $(displayer).children().fadeIn(400);
        });
    }
    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
      }
}