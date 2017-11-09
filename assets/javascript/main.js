// globals
// genres from: http://www.imdb.com/genre/
var movieGenres = {"0":{"name":"Romance","romance":8},"1":{"name":"Comedy","romance":4},
                   "2":{"name":"Action","romance":1},"3":{"name":"Family","romance":4},
                   "4":{"name":"Musical","romance":3},"5":{"name":"Western","romance":-2},
                   "6":{"name":"Science Fiction","romance":2},"7":{"name":"Mystery","romance":3},
                   "8":{"name":"Drama","romance":4}};

// generate unique id
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var holdDinnerTime = "";

// build the restaurant cuisine list
function buildRestaurantCuinsineList() {
    var cuisineList = $('#dnd-cuisine-menu');
    cuisineList.empty();
    let restaurantKeys = Object.keys(restaurantCuisines);
    restaurantKeys.forEach(function(key) {
        let cuisineData = restaurantCuisines[key];
        // console.log('adding cuisine: "' + cuisineName + '" for index: ' + key);
        cuisineList.append('<option value="' + key + '" romance="' + cuisineData.romance + '">' + cuisineData.name + '</option>');
    });
}


// build the movie genre list
function buildMovieGenresList() {
    var movieGenreList = $('#dnd-genre-menu');
    movieGenreList.empty();
    for (key in Object.keys(movieGenres)) {
        let genreData = movieGenres[key];
        // console.log('adding genre: "' + genreName + '" for index: ' + key);
        movieGenreList.append('<option value="' + key + '" romance="' + genreData.romance + '">' + genreData.name + '</option>');
    }
}


// Return currently selected restaurant cuisines
function getSelectedCuisines() {
    var selected = [];
    $('select#dnd-cuisine-menu').find('option:selected').each(function() {
        selected.push(parseInt($(this).attr('value')));
    });
    return selected;
}


// Return currently selected movie genres
function getSelectedGenres() {
    var selected = [];
    $('select#dnd-genre-menu').find('option:selected').each(function() {
        selected.push($(this).text());
    });
    return selected;
}

// Write the movie output to the results page
function writeMovieToOutput(movieObj) {
    console.log("im in writeMovieToOutput");
    console.log("movieObj3: " + JSON.stringify(movieObj));
    console.log("name: " + movieObj.title);
    console.log("theatre: " + movieObj.theatre);
    console.log("ticketURI: " + movieObj.ticketURI);
    console.log("ticketURI: " + movieObj.times[0]);

    if (typeof movieObj.ticketURI === "undefined") {
        movieObj.ticketURI = "https://www.fandango.com/";
    }


    var tr = $('<tr>');
    tr.append('<td class="fa fa-film" aria-hidden="true"></td>');
    tr.append(`<td>${movieObj.time}</td>`);
    tr.append(`<td>${movieObj.title}</td>`);
    tr.append(`<td>${movieObj.theatre}</td>`);
    tr.append(`<td>${movieObj.ticketURI}</td>`);

    $('#dnd-user-results-tbody').prepend(tr);
    //calculate dinner time based on movie time
    // and write it to the results page
    holdDinnerTime = subtractTwoHourFromDate(movieObj.times[0]);
    // $("#dnd-output-dinner-time").text(dinnerTime);
}

//subtact 2 hours from a time in the format of "00:00 PM"
function subtractTwoHourFromDate(origTime) {
    console.log("origTime" + origTime);
    var origHour = origTime.split(":")[0];
    var origMinutes = origTime.split(":")[1];
    console.log("origHour" + origHour);
    console.log("origMinutes" + origMinutes);
    // calculate the dinner time based on movie time
    var earlierHour = parseInt(origHour) - 2;
    var earlierMinutes = origMinutes;
    console.log("earlierHour" + earlierHour);
    console.log("earlierMinutes" + earlierMinutes);
    var earlierTime = earlierHour + ":" + earlierMinutes;
    console.log("earlierTime" + earlierTime);
    return earlierTime;
}

function writeRestaurantToOutput(restaurants) {
    console.log("im in writeRestaurantToOutput");
    console.log("restaurants: " + JSON.stringify(restaurants));
    console.log("name: " + restaurants[0].name);
    console.log("venue: " + restaurants[0].location);
    console.log("url: " + restaurants[0].url);

    if (typeof restaurants[0].url === "undefined") {
        restaurants[0].url = "https://www.zomato.com/";
    }

    var tr = $('<tr>');
    tr.append('<td class="fa fa-cutlery" aria-hidden="true"></td>');
    tr.append(`<td>${holdDinnerTime}</td>`);
    tr.append(`<td>${restaurants[0].name}</td>`);
    tr.append(`<td>${restaurants[0].location}</td>`);
    tr.append(`<td>${restaurants[0].url}</td>`);

    $('#dnd-user-results-tbody').prepend(tr);
}

// Returns the date & time from the search form
function getDateTime() {
    if (!$('#dnd-input-date').val() || !$('#dnd-input-time').val()) {
        // return Date();
    }

    var currentDate = $('#dnd-input-date').val().trim();
    var currentTime = $('#dnd-input-time').val().trim();
    // return Date(date + ':' + time);
    return (currentDate + ':' + currentTime);
}

// UI

// toggle interface panes
function togglePaneElement(named) {
    let searchPane = $('#search-pane');
    let resultsPane = $('#results-pane');
    let priorsPane = $('#prior-results-pane');

    if (named === "search") {
        searchPane.show();
        resultsPane.hide();
        priorsPane.hide();
    } else if (named === "results") {
        resultsPane.show();
        searchPane.hide();
        priorsPane.hide();
    } else {
        priorsPane.show();
        searchPane.hide();
        resultsPane.hide();
    }
}

// populate inital form values
function populateSearchForm() {
    // set the default date value to today's data
    var today = new Date().toISOString().slice(0, 10);
    $('#dnd-input-date').val(today);
    $('#dnd-input-time').val(currentUser.movieStart);
    $('#dnd-input-zipcode').val(currentUser.zipCode);
}

// when modal is opened, populate the form values
function populateSettingsForm(modal) {
    modal.find('#dnd-settings-input-zipcode').val(currentUser.zipCode);
    modal.find('#dnd-settings-input-radius').val(currentUser.radius);
    modal.find('#dnd-settings-input-movie-start').val(currentUser.movieStart);
}

// USER PREFS

function saveUserDataToLocal(data = {}) {
    for (var k in data) currentUser[k] = data[k];
    currentUser.saveLocalData();
}


function getUserDataFromLocal() {
    if (localStorage.hasOwnProperty('dnd-user-prefs')) {
        return JSON.parse(localStorage.getItem('dnd-user-prefs'));
    }
    return {};
}


// user prefs
var currentUser = {
    'uuid': guid(),
    'zipCode': '',
    'radius': 10,
    'latLng': {
        'lat': 0,
        'lng': 0
    },
    'movieStart': '19:00',
    saveLocalData() {
        localStorage.setItem('dnd-user-prefs', JSON.stringify(this));
        console.log('Saving user data...');
    },
    loadDataFromLocal() {
        var savedData = getUserDataFromLocal();
        for (var k in savedData) this[k] = savedData[k];
    }
};


// Foundation initialize
$(function() {
    $(document).foundation();
});


// Foundation Modal Listeners
$(document).on('open.zf.reveal', '[data-reveal]', function() {
    var modal = $(this);
    let modalid = modal.attr('id');

    if (modalid == 'dnd-settings-modal') {
        populateSettingsForm(modal);
    }
});


// form validation failed
$(document).on("forminvalid.zf.abide", function(ev, frm) {
    console.log('# form id "' + ev.target.id + '" is invalid');
})

// form validation passed
$(document).on("formvalid.zf.abide", function(ev, frm) {
    console.log('# form id "' + frm.attr('id') + '" is valid');
})


// page load
$(document).ready(function() {
    // show the search pane
    togglePaneElement('search');

    // load data from local storage
    currentUser.loadDataFromLocal();

    // build the ui elements
    buildMovieGenresList();
    buildRestaurantCuinsineList();

    // supress default form action
    $('.btn-search').on('click', function (event) {
        event.preventDefault();
    });

    // search button clicked
    $('body').on('click', '#dnd-btn-search', function () {

        $('#search-pane').hide();
        $('#results-pane').show();

        var today = new Date().toISOString().slice(0, 10);
        $('#dnd-input-date').text(today);

        var numMovies = 1;
        var radius = 20;
        // var date = $('#dnd-input-date').val();
        // IMPORTANT: the date must be within 6 days from current day, else returns an error.
        console.log(date);


        let selectedCuisines = getSelectedCuisines();
        let selectedGenres = getSelectedGenres();

        let zipCode = $('#dnd-input-zipcode').val().trim();
        var date = $('#dnd-input-date').val().trim();
        var time = $('#dnd-input-time').val().trim();
        numMovies = 1;
        radius = 10;
        callback = '';

        updateInputInDateHistoryJsonObject(zipCode, radius, date, selectedCuisines.toString(), selectedGenres);
        console.log("zipcode updated in json object " + JSON.stringify(dateHistoryData));

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);

        //-----------------------------------------------//
        // jbc I added the below code to main.js

        //  getMovies(numMovies, zipCode, radius, userSelectedData, callback);

        getMovies(numMovies, zipCode, radius, date, time, selectedGenres, function (moviesInfo) {
            // add all the jquery outputs for movie info here > movie title / theater & show times
            var movieObj = moviesInfo[0];
            console.log("movie returns control to program");
            console.log(movieObj);
            console.log(moviesInfo);
            writeMovieToOutput(movieObj);
            updateMoviesInDateHistoryJsonObject(movieObj);
            console.log("updating movies in json object " + JSON.stringify(dateHistoryData));
            // updateDateHistoryDatabase(dateHistoryData);
        });

        getLocation(zipCode, radius, selectedCuisines.toString());

    });


    // // prior result button clicked
    // $('body').on('click', '#dnd-output-priors', function () {
    //     console.log('get prior dates button clicked ');
    //     // get 3 prior rows
    //     $("#results-pane").hide();
    //     $("#prior-results-pane").show();
    //     // call database and display 3 rows
    //     console.log("updating firebase1, json object is " + JSON.stringify(dateHistoryData));
    //     updateDateHistoryDatabase(dateHistoryData); 
    //     getOutputFromDateHistoryDatabase();
    // });

    // home link clicked
    $('body').on('click', '#dnd-breadcumb-home', function () {
        $("#prior-results-pane").hide();
        $("#results-pane").hide();
        $("#search-pane").show();
    });

    // results link clicked
    $('body').on('click', '#dnd-breadcumb-results', function () {
        $("#prior-results-pane").hide();
        $("#results-pane").show();
        $("#search-pane").hide();
    });

    // other results link clicked
    $('body').on('click', '#dnd-breadcumb-prior-results', function () {
        $("#prior-results-pane").show();
        $("#results-pane").hide();
        $("#search-pane").hide();
        console.log("updating firebase-2, json object is " + JSON.stringify(dateHistoryData));
        updateDateHistoryDatabase(dateHistoryData);
        getOutputFromDateHistoryDatabase();
    });
});
