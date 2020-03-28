import { TagDisplayer } from "./tagDisplayer.js";
import { MovieDisplayer } from "./movieDisplayer.js";

//Data Handler class
export class DataHandler {  
    static getSavedMovies(start, number, sort_by) {
        let movies = $.map(document.data.movie, (entry) => {
            return entry;
        });
        if (sort_by == "date") {
            movies.sort((a, b) => { //we sort by adding date
                if (a.date > b.date)
                    return -1;
                else
                    return 1;
            });
        }
        else if (sort_by == "alpha") {
            movies.sort((a, b) => {
                return a.title.localeCompare(b.title);
            });
        }
        if (number != 0 && start > -1) 
            movies = movies.splice(start, number); //we take the first elements wanted
        return movies;    
    }

    static getSavedPeople(start, number, sort_by) {
        let people = $.map(document.data.people, (entry) => {
            return entry;
        });
        if (sort_by == "date") {
            people.sort((a, b) => {
                if (a.date > b.date)
                    return -1;
                else 
                    return 1;
            }); 
        }
        else if (sort_by == "alpha") {
            people.sort((a, b) => {
                return a.title.localeCompare(b.title);
            });
        } 
        if (number != 0 && start > -1) {
            people = people.splice(start, number);
        }
        return people;
    }
    static getSavedTags(start, number, sort_by) {
        //we get all the tags unsorted
        let tags = [];
        DataHandler.getMoviePeople().forEach(element => {
            element.genre.forEach(genre => {
                if (!tags.includes(genre))
                    tags.push(genre);
            });
        });
        //detect null values
        tags.forEach(element => {
            if (element == null) {
                delete tags[tags.indexOf(element)];
            }
        });
        //we sort them
        if (sort_by == "alpha" && tags.length > 0) {
            tags.sort((a, b) => {
                return a.localeCompare(b);
            });
        }
        //we split them
        if (number != 0 && start > -1) {
            tags = tags.splice(start, number);
        }
        return tags;
    }
    static getSavedTo_see(start, number, sort_by) {
        let to_see = document.data.to_see;
        let movies = $.map(document.data.movie, (entry) => {return entry;});
        let returnedEl = [];
        movies.forEach(movie => {
            to_see.forEach(element => {
                if (movie.id == element)
                    returnedEl.push(movie);
            });
        });

        //we sort them
        if (sort_by == "alpha") {
            returnedEl.sort((a, b) => {
                return a.title.localeCompare(b.title);
            });
        }
        else if (sort_by == "date") {
            returnedEl.sort((a, b) => {
                if (a.date > b.date)
                    return -1;
                else 
                    return 1;
            }); 
        }
        //we split them
        if (number != 0 && start > -1) {
            returnedEl = returnedEl.splice(start, number);
        }
        return returnedEl;
    }
    static getSavedSeen(start, number, sort_by) {
        let seen = document.data.seen;
        let movies = $.map(document.data.movie, (entry) => {return entry;});
        let returnedEl = [];
        movies.forEach(movie => {
            seen.forEach(element => {
                if (movie.id == element)
                    returnedEl.push(movie);
            });
        });
        //we sort them
        if (sort_by == "alpha") {
            returnedEl.sort((a, b) => {
                return a.title.localeCompare(b.title);
            });
        }
        else if (sort_by == "date") {
            returnedEl.sort((a, b) => {
                if (a.date > b.date)
                    return -1;
                else 
                    return 1;
            }); 
        }
        //we split them
        if (number != 0 && start > -1) {
            returnedEl = returnedEl.splice(start, number);
        }
        return returnedEl;
    }
    static getSavedFav(start, number, sort_by) {
        let fav = document.data.fav;
        let movies = $.map(document.data.movie, (entry) => {return entry;});
        let returnedEl = [];
        movies.forEach(movie => {
            fav.forEach(element => {
                if (movie.id == element)
                    returnedEl.push(movie);
            });
        });

        //we sort them
        if (sort_by == "alpha") {
            returnedEl.sort((a, b) => {
                return a.title.localeCompare(b.title);
            });
        }
        else if (sort_by == "date") {
            returnedEl.sort((a, b) => {
                if (a.date > b.date)
                    return -1;
                else 
                    return 1;
            }); 
        }
        //we split them
        if (number != 0 && start > -1) {
            returnedEl = returnedEl.splice(start, number);
        }
        return returnedEl;
    }
    static getStats() {
        let statPeople = 0;
        $.map(document.data.people, (entry) => {
            statPeople++;
            return entry;
        });
        let statMovies = 0;
        $.map(document.data.movie, (entry) => {
            statMovies++;
            return entry;
        });
        let statTo_see = document.data.to_see.length;
        let statSeen = document.data.seen.length;
        let statFav = document.data.fav.length;
        let statTags = DataHandler.getSavedTags(undefined, "alpha").length;
        return [statMovies, statPeople, statTo_see, statSeen, statFav, statTags];    
    }
    static getMoviesPeopleFromTag(tag) {
        let data = $.map(document.data.movie, (entry) => {
            return entry;
         });
         data = data.concat($.map(document.data.people, (entry) => {
             return entry;
         }));
         let elements = [];
         data.forEach((entry) => {   //for each artist or movie
             let parent = entry;
             entry.genre.forEach((entry) => {    //for each genre 
                 if (entry) {    //if ther is one
                     if (entry.toUpperCase() == tag.toUpperCase()) {
                         elements.push(parent);
                     }
                 }
             });
         });
         return elements;
    }
    static getMoviePeople() {
        let data = $.map(document.data.movie, (entry) => {
            return entry;
        });
        data = data.concat($.map(document.data.people, (entry) => {
            return entry;
        }));
        return data;
    }
    //Add movie to the DB
    static addMovie(event) {
        let movie = event.data.movie;
        var genres = [];
        let timestamp = new Date().getTime();
        let date = new Date(timestamp);
        date = date.getDate() + " " + document.month[date.getMonth()] + " " + date.getFullYear();
        movie.genre_ids.forEach((e) => {
            var genre_movie = e;
            //for each id of exicting genre
            $(document.genre_list.genres).each(function() {
                //we check if it match
                if (this.id == genre_movie)
                    genres.push(this.name);   
            });
        });

        document.data.movie[movie.id] = {
            "title": movie.title,
            "genre": genres,
            "id": movie.id,
            "date" : timestamp,
            "image_url": movie.poster_path || "/images/cinema.png",
            "type": "movie"
        };
        DataHandler.saveData();
        $(this).find("i").text("done");
        $(this).find("a").text("Ajouté à la bibliothèque");
        $(this).unbind();
        $(this).click({id: movie.id, movie: movie}, DataHandler.removeMovie);  
        $(".tags_movie").append("<span><a>"+date+"</a></span>");
        $(".tags_movie").children().last().click({genre: date}, TagDisplayer.create);
        $(".tags_movie").append("<span class='add_genre'><i class='material-icons'>add</i></span>");
        $(".tags_movie").find(".add_genre").click({id: movie.id, page: document.movie}, MovieDisplayer.addGenre);
        $(".add_to_see").show();
        $(".add_to_see").find("a").text("Ajouter aux films à voir");
        $(".add_to_see").find("i").text("playlist_add");
        $(".add_to_see").unbind();
        $(".add_to_see").click({id: movie.id}, DataHandler.addTo_see);
        $(".add_seen").show();
        $(".add_seen").find("a").text("Ajouter aux films vus");
        $(".add_seen").find("i").text("video_library");
        $(".add_seen").unbind();
        $(".add_seen").click({id: movie.id}, DataHandler.addSeen);
        $(".add_fav").show();
        $(".add_fav").find("a").text("Ajouter aux favoris");
        $(".add_fav").find("i").text("favorite_border");
        $(".add_fav").unbind();
        $(".add_fav").click({id: movie.id}, DataHandler.addFav);
    }

    static addTo_see(event) {
        let id = event.data.id;
        if (document.data.to_see.indexOf(id) == -1)
            document.data.to_see.push(id);
        DataHandler.saveData();
        $(this).find("i").text("playlist_added");
        $(this).find("a").text("Ajouté aux films à voir");
        $(this).unbind();
        $(this).click({id: id}, DataHandler.removeTo_see);
    }
    static addSeen(event) {
        let id = event.data.id;
        if (document.data.seen.indexOf(id) == -1)
            document.data.seen.push(id);
        DataHandler.saveData();
        $(this).find("i").text("video_library");
        $(this).find("a").text("Ajouté aux films vus");
        $(this).unbind();
        $(this).click({id: id}, DataHandler.removeSeen);
    }
    static addFav(event) {
        let id = event.data.id;
        if (!DataHandler.isFav()) {
            document.data.fav.push(id);
        }
        DataHandler.saveData();
        $(this).find("i").text("favorite");
        $(this).find("a").text("Ajouté aux favoris");
        $(this).unbind();
        $(this).click({id :id}, DataHandler.removeFav);
    }
    static removeTo_see(event) {
        let id = event.data.id;
        let to_see = document.data.to_see;
        let key = to_see.indexOf(id);
        if (key > -1) {
            to_see.splice(key, 1);
        }
        $(this).find("i").text("playlist_add");
        $(this).find("a").text("Ajouter aux films à voir");
        $(this).unbind();
        $(this).click({id: id}, DataHandler.addTo_see);
        DataHandler.saveData();        
    }
    static removeSeen(event) {
        let id = event.data.id;
        let seen = document.data.seen;
        let key = seen.indexOf(id);
        if (key > -1) {
            seen.splice(key, 1);
        }
        $(this).find("i").text("library_add");
        $(this).find("a").text("Ajouter aux films vu");
        $(this).unbind();
        $(this).click({id: id}, DataHandler.addSeen);
        DataHandler.saveData();   
    }
    static removeFav(event) {
        let id = event.data.id;
        let fav = document.data.fav;
        let key = fav.indexOf(id);
        if (key > -1) {
            fav.splice(key, 1);
        }
        $(this).find("i").text("favorite_border");
        $(this).find("a").text("Ajouter aux favoris");
        $(this).unbind();
        $(this).click({id: id}, DataHandler.addFav);
        DataHandler.saveData();
    }
    //Remove movie from the DB
    static removeMovie(event) {
        let id = event.data.id;
        let movie = document.data.movie;
        delete movie[id];

        let e = {};
        e.data = {
            id : id
        };
        $(".add_to_see").click();
        $(".add_seen").click();
        $(".add_fav").click();
        $(".add_to_see").unbind();
        $(".add_seen").unbind();
        $(".add_fav").unbind();
        DataHandler.saveData();
        $(this).find("i").text("add");
        $(this).find("a").text("Ajouter à la bibliothèque");
        $(this).unbind();
        $(this).click({movie: event.data.movie}, DataHandler.addMovie);
        $(".tags_movie").find(".add_genre").remove();
        $(".add_to_see").hide();
        $(".add_seen").hide();
        $(".add_fav").hide();
    }
    //Check if the movie is saved in the DB
    static isSavedMovie(id) {
        let movie = document.data.movie;
        if (movie[id])
            return true;
        return false;
    }
    static isToSeeMovie(id) {
        let to_see = document.data.to_see;
        if (to_see.indexOf(id) > -1)
            return true;
        return false;
    }
    static isSeenMovie(id) {
        let seen = document.data.seen;
        if (seen.indexOf(id) > -1)
            return true;
        return false;
    }
    static isFav(id) {
        let fav = document.data.fav;
        if (fav.indexOf(id) > -1)
            return true;
        return false;
    }
    static getMovie(id) {
        return document.data.movie[id];
    }

    static addGenreMovie(id, genre) {
        document.data.movie[id].genre.push(genre);
    } 
    static removeGenreMovie(id, genre) {
        let genre_list = document.data.movie[id].genre;
        let index = genre_list.indexOf(genre);
        if (index > -1) {
            delete genre_list[index];
            return true;
        }
        return false;
    }
    //Add people to the DB
    static addPeople(event) {
        let person = event.data.person;
        let timestamp = new Date().getTime();
        let date = new Date(timestamp);
        date = date.getDate() + " " + document.month[date.getMonth()] + " " + date.getFullYear();
        document.data.people[person.id] = {
            "title": person.name,
            "id" : person.id,
            "date" : new Date().getTime(),
            "type": "people",
            "image_url": person.profile_path || "/images/unknown.jpg",
            "genre": []
        };
        DataHandler.saveData();
        $(this).find("i").text("done");
        $(this).find("a").text("Ajouté à la bibliothèque");
        $(this).unbind();
        $(this).click({id: person.id, person: event.data.person}, DataHandler.removePeople);
        $(".tags_movie").show();
        $(".tags_movie").append("<span><a>"+date+"</a></span>");
        $(".tags_movie").children().last().click({genre: date}, TagDisplayer.create);
        $(".tags_movie").append("<span class='add_genre'><i class='material-icons'>add</i></span>");
        $(".tags_movie").find(".add_genre").click({id: person.id, page: document.person}, event.data.page.addGenre);
    }
    //remove people from the DB
    static removePeople(event) {
        let id = event.data.id;
        let people = document.data.people;
        delete people[id];
        DataHandler.saveData();
        $(this).find("i").text("add");
        $(this).find("a").text("Ajouter à la bibliothèque");
        $(this).unbind();
        $(this).click({person: event.data.person}, DataHandler.addPeople);
        $(".tags_movie").hide();
    }
    //Check if people is saved in the DB
    static isSavedPeople(id) {
        let people = document.data.people;
        if (people[id])
            return true;
        return false;
    }

    static getPeople(id) {
        return document.data.people[id];
    }
    static addGenrePeople(id, genre) {
        document.data.people[id].genre.push(genre);
    }
    static removeGenrePeople(id, genre) {
        let genre_list = document.data.people[id].genre;
        let index = genre_list.indexOf(genre);
        if (index > -1) {
            delete genre_list[index];
            return true;
        }
        return false;
    }

    static setNewUsername(username) {
        $.get("/php/setUsername.php?new_username=" + username + "&id=" + document.id, () => {
            console.log("Username changed");
        }).fail(() => {
            alert("Une erreur s'est produite lors de l'opération. Le nom d'utilisateur n'a pas pu être mis à jour.");
        });
    }
    static setNewPassword(password) {
        $.get("/php/setPassword.php?new_password=" + password + "&id=" + document.id, () => {
            console.log("Password changed");
        }).fail(() => {
            alert("Une erreur s'est produite lors de l'opération. Le nom d'utilisateur n'a pas pu être mis à jour.");
        });
    }
    static removeAccount() {
        $.get("/php/removeAccount.php?id="+document.id, () => {
            if (document.device == "browser")
                location.replace("https://videotheque.scriptis.fr");
            else
                location.replace("about:blank");           
            }).fail(() => {
            alert("Une erreur s'est produite lors de l'opération. Votre compte n'a pas pu être supprimé");  
        });
    }

    static eraseAccount() {
        $.get("/php/eraseAccount.php?id="+document.id, () => {
            location.replace("");
        }).fail(() => {
            alert("Une erreur s'est produite lors de l'opération. Votre compte n'a pas pu être supprimé");
        });
    }
    //Send DB to the server
    static saveData() {
        let args = new FormData();
        args.append("data", JSON.stringify(document.data));
        args.append("id", document.id);    
        $.ajax({
            type: 'POST',
            url: "/php/saveData.php",
            data: args,
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: () => {
            },
            error: (request, error) => {
                console.log("Erreur lors de la requête : " + request.responseText + " " + error);
            },
            success: (data) => {
                console.log(data);
            }
        });
    }
}