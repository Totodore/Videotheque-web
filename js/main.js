import * as searcher from './searchHandler.js';
import {SavedDisplayer} from './savedDisplayer.js';
import {HomeDisplayer} from './homeDisplayer.js';
import {AccountDisplayer} from './accountDisplayer.js';
import {MovieDisplayer} from './movieDisplayer.js';
import {TagDisplayer} from './tagDisplayer.js';
import {PersonDisplayer} from './personDisplayer.js';
import { DataHandler } from './dataHandler.js';

var selectedSortButton;
var activeRequest;
var activeLocalRequest; 
var prevScrollPos = window.pageYOffset;
 
$(() => {
    "use strict";
    //We get the username and the password to call the apropriate json data file
    let urlHandler = new URLSearchParams(location.search);

    if (urlHandler.has("device")) {
        document.device = urlHandler.get("device");
        history.replaceState(null, "", "/#");
    }
    else 
        document.device = "app";

    document.isHome = true;    
    $(".menuIcon_open").click(openMenu); //On click on menu button
    $(".menuIcon_close").click(closeMenu); //On click on close button
    $(".navBar_icon").click(dispSort);
    $(".navBar_sort li").click(sortButton);
    $(".navBar_input").keyup(onInput);
    $(".dispHome").click(dispHome);
    $(".titleBar").click(dispHome);
    $(".dispMovies").click(dispMovies);
    $(".dispStats").click(dispStats);
    $(".logout").click(logout);
    $(window).scroll((e) => {
        let currentScrollPos = window.pageYOffset;
        if (prevScrollPos > currentScrollPos) {
            $("#header").css("max-height", "64px");
            setTimeout(() => {
                $("#header").css("overflow", "initial");
            }, 400);
        }
        else {
            $("#header").css("overflow", "hidden");
            $("#header").css("max-height", "0");
        }
        prevScrollPos = currentScrollPos;
    });
    window.onpopstate = parseUrl;
    $.get("https://api.themoviedb.org/3/genre/movie/list?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => { 
        document.genre_list = data;
    });
    $.get("/html/home.html", (data) => { 
        document.home = data;
    });
    $.get("/html/movie.html", (data) => {
        document.movie = data;
    });
    $.get("/html/person.html", (data) => {
        document.person = data;
    });
    $.get("/html/saved.html", (data) => {
        document.saved = data; 
    });
    $.get("/html/tag.html", (data) => {
        document.tag = data;
    });
    $.get("/html/account.html", (data) => {
        document.account = data;
    });
    $.get({
        url: "/json/"+document.id+"/data.json?t=" + Date.now().toString(),
        success: (data) => {
            document.data = data;
            parseUrl();
        },
        error: () => {
            location.replace("https://videotheque.scriptis.fr?error=true");
        }
    });
    document.month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    $(".navBar_sort li").first().click();

    document.gradient = () => {
        var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];
        
        function populate(a) {
            for ( var i = 0; i < 6; i++ ) {
                var x = Math.round( Math.random() * 14 );
                var y = hexValues[x];
                a += y;
            }
            return a;
        }
        
        var newColor1 = populate('#');
        var newColor2 = populate('#');
        var angle = Math.round( Math.random() * 360 );
        
        var gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
        
        return gradient;        
    };
    window.onbeforeunload = (e) => {
        let parser = document.createElement('a');
        parser.href = e.target.URL;
    };
});

function logout() {
    if (document.device == "browser")
        location.replace("https://videotheque.scriptis.fr");
    else
        location.replace("about:blank");
}
function parseUrl() {
    "use strict";
    let hash = location.hash;
    let parameters = hash.split("/");
    if (parameters[1] == "saved") {
        dispMovies();
    }
    else if (parameters[1] == "account") {
        dispStats();
    }
    else if (parameters[1] == "movie") {
        if (parameters[2] != "") {
            $.get("https://api.themoviedb.org/3/movie/"+parameters[2]+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
                let event = {data: {page: document.movie, movie: data}};
                MovieDisplayer.launch(event);
                $(".loader_img").hide();
            }).fail(dispHome);
        }
        else {
            dispHome();
        }
    }
    else if (parameters[1] == "person") {
        if (parameters[2] != "") {
            $.get("https://api.themoviedb.org/3/person/"+parameters[2]+"?api_key=a6499d6e1a486416773626640f79de9d&language=fr-FR", (data) => {
                let event = {data: {page: document.person, person: data}};
                PersonDisplayer.launch(event);
                $(".loader_img").hide();
            }).fail(dispHome);
        }
        else {
            dispHome();
        }
    }
    else if (parameters[1] == "tag") {
        if (parameters[2] != "") {
            new TagDisplayer(decodeURIComponent(parameters[2]));
            $(".loader_img").hide();
        }
        else {
            dispHome();
        }
    }
    else {
        dispHome();
    }
}
function openMenu() { //menu open function
    "use strict";
    document.scrollTop = $("html, body").scrollTop();
    $("html, body").css("overflow", "hidden");
    $(".menu li").each(function(index) {
        $(this).css("animation-delay", index*100 + "ms").css("-moz-animation-delay", index*100 + "ms").css("-webkit-animation-delay", index*100 + "ms");
        $(this).addClass("animation_menu_toRight");
    });
    $("#menuWrapper").fadeIn(400); //display the menu
    $(this).css("opacity", 0); //hide the menu button
}

function closeMenu() {
    "use strict";
    $("html, body").css("overflow", "auto");
    $(".menuIcon_open").css("opacity", 1); //show the menu button
    $("#menuWrapper").fadeOut(400, () => {
        $(".menu li").removeClass("animation_toRight");
    }); //hide the menu
}

function onInput() {
    "use strict";
    var id = selectedSortButton.id;
    let query = $(".navBar_input").val();
    if (query.length > 1) {
        if (id == 0) {
            if (activeRequest)  //If there is an active request we cancel it
                activeRequest.abort();
            activeRequest = searcher.onlineSearch(query);
        }
        else if (id == 1) {
            if (activeLocalRequest) {
                activeLocalRequest.forEach(element => {
                    element.abort();
                });
            }
            activeLocalRequest = searcher.searchLocal(query);
        }
        else if (id == 2) {
            searcher.searchTag(query);
        }
    }
    else {
        $(".navBar_results").children().remove();
    }
}

function dispHome() {
    "use strict";
    closeMenu();
    $(".main").children().fadeOut(400, () => {
        $(".main").children().remove();
        $(".main").append($(document.home).clone());
        new HomeDisplayer();
        $($(".main").children().first().children()[0]).addClass("animation_toUp");
        $($(".main").children().first().children()[1]).addClass("animation_toUp");
        $($(".main").children().first().children()[2]).addClass("animation_toUp");
        $($(".main").children().first().children()[3]).addClass("animation_toUp");
        document.isHome = true;
        history.pushState(null, "", "#");
    });
}
function dispMovies() {
    "use strict";
    closeMenu();
    $(".main").children().fadeOut(400, () => {
        $(".main").children().remove();
        $(".main").append(document.saved);
        $(".main").children().addClass("animation_toUp"); 
        SavedDisplayer.init();
        history.pushState(null, "", "#/saved/movie/movie");
        document.isHome = false;
    });
}

function dispStats() {
    "use strict";
    closeMenu();
    $(".main").children().fadeOut(400, () => { 
        $(".main").children().remove();
        $(".main").append(document.account);
        new AccountDisplayer();
        history.pushState(null, "", "#/account/");
        document.isHome = false;
    });
}

function dispSort() {
    "use strict";
    if (window.outerWidth < 600)
        $(".navBar_sortWrapper").show();
    else
        $(".navBar_sortWrapper").show(300);

    $(".navBar_icon").off("click");
    $(".navBar_icon").click(hideSort);
}

function hideSort() {
    "use strict";
    if (window.outerWidth < 600)
        $(".navBar_sortWrapper").hide(0);
    else
        $(".navBar_sortWrapper").hide(300);
        
    $(".navBar_icon").off("click");
    $(".navBar_icon").click(dispSort);
}

function sortButton() {
    "use strict";
    $(selectedSortButton).removeClass("navBar_sortSelected");
    selectedSortButton = this;
    selectedSortButton.id = $(".navBar_sort li").index(this);
    $(this).addClass("navBar_sortSelected");
    hideSort();
}