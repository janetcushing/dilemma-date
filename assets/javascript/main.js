// globals
// genres from: http://www.imdb.com/genre/
var movieGenres = {
    "0": {
        "name": "Romance",
        "romance": 8
    },
    "1": {
        "name": "Comedy",
        "romance": 4
    },
    "2": {
        "name": "Action",
        "romance": 1
    },
    "3": {
        "name": "Family",
        "romance": 4
    },
    "4": {
        "name": "Musical",
        "romance": 3
    },
    "5": {
        "name": "Western",
        "romance": -2
    },
    "6": {
        "name": "Science Fiction",
        "romance": 2
    },
    "7": {
        "name": "Mystery",
        "romance": 3
    },
    "8": {
        "name": "Drama",
        "romance": 4
    }
};

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
var isMovieCallCompleted = false;
var isRestaurantCallCompleted = false;

// build the restaurant cuisine list
function buildRestaurantCuinsineList() {
    var cuisineList = $('#dnd-cuisine-menu');
    cuisineList.empty();
    let restaurantKeys = Object.keys(restaurantCuisines);
    restaurantKeys.forEach(function (key) {
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
    $('select#dnd-cuisine-menu').find('option:selected').each(function () {
        selected.push(parseInt($(this).attr('value')));
    });
    return selected;
}


// Return currently selected movie genres
function getSelectedGenres() {
    var selected = [];
    $('select#dnd-genre-menu').find('option:selected').each(function () {
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
    console.log("ticketURI: " + movieObj.time);

    if (typeof movieObj.ticketURI === "undefined") {
        movieObj.ticketURI = "https://www.fandango.com/";
    }


    var tr = $('<tr>');
    tr.append('<td class="fa fa-film" aria-hidden="true"></td>');
    tr.append(`<td>${movieObj.time}</td>`);
    tr.append(`<td>${movieObj.title}</td>`);
    tr.append(`<td>${movieObj.theatre}</td>`);
    tr.append(`<td><a href="${movieObj.ticketURI}">Link</a></td>`);

    $('#dnd-user-results-tbody').prepend(tr);
    //calculate dinner time based on movie time
    // and write it to the results page
    holdDinnerTime = subtractTwoHourFromDate(movieObj.time);
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
    tr.append(`<td><a href="${restaurants[0].url}">Link</a></td>`);

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

function openStatusModal(text, title = 'Alert', duration = 1500) {
    $('#dnd-alert-modal').foundation('open');
    $('#dnd-alert-modal-title').text(title);
    $('#dnd-alert-modal-body').text(text);
    setTimeout(() => {
        $('#dnd-alert-modal').foundation('close');
    }, duration);
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
$(function () {
    $(document).foundation();
});


// Foundation Modal Listeners
$(document).on('open.zf.reveal', '[data-reveal]', function () {
    var modal = $(this);
    let modalid = modal.attr('id');

    if (modalid == 'dnd-settings-modal') {
        populateSettingsForm(modal);
    }
});


// form validation failed
$(document).on("forminvalid.zf.abide", function (ev, frm) {
    // console.log('# form id "' + ev.target.id + '" is invalid');
})


// search form submitted...
$(document).on("submit", function (ev) {
    ev.preventDefault();

    console.log('# Searching...');

    openStatusModal('querying database...', title = 'Searching...');
    togglePaneElement('results');

    var numMovies = 1;
    var radius = 20;

    // get selection data from menus
    let selectedCuisines = getSelectedCuisines();
    let selectedGenres = getSelectedGenres();

    var zipCode = $('#dnd-input-zipcode').val().trim();
    var date = $('#dnd-input-date').val().trim();
    var time = $('#dnd-input-time').val().trim();

    // save data to local storage
    saveUserDataToLocal(zipCode, radius);

    numMovies = 1;
    radius = 10;
    callback = '';

    updateInputInDateHistoryJsonObject(zipCode, radius, date, selectedCuisines.toString(), selectedGenres);
    console.log("zipcode updated in json object " + JSON.stringify(dateHistoryData));

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


// page load
$(document).ready(function () {
    // show the search pane
    togglePaneElement('search');

    // load data from local storage
    currentUser.loadDataFromLocal();

    // build the ui elements
    buildMovieGenresList();
    buildRestaurantCuinsineList();

    // populate the form with default values
    populateSearchForm();


    // FOOTER
    // link to home page
    $('body').on('click', '#dnd-btn-home', function () {
        togglePaneElement('search');
    });

    // user preferences modal
    $('body').on('click', '#dnd-btn-settings', function () {
        $('#dnd-settings-modal').foundation('open');
    });


    // link to home page
    $('body').on('click', '#dnd-btn-suggestions', function () {
        getOutputFromDateHistoryDatabase(dateHistoryData.zipCode);
        togglePaneElement('prior');
    });

    // user preferences modal submitted
    $('body').on('click', '#dnd-settings-save', function () {
        let saveButton = $(this);
        let modal = saveButton.parents().find('#dnd-settings-modal');
        currentUser.zipCode = modal.find('#dnd-settings-input-zipcode').val();
        currentUser.radius = modal.find('#dnd-settings-input-radius').val();
        currentUser.movieStart = modal.find('#dnd-settings-input-movie-start').val();
        currentUser.saveLocalData();
        $('#dnd-settings-modal').foundation('close');
    });

    // NAVIGATION LINKS

    // home link clicked
    $('body').on('click', '#dnd-breadcumb-home', function () {
        togglePaneElement('search');
    });

    // results link clicked
    $('body').on('click', '#dnd-breadcumb-results', function () {
        togglePaneElement('results');
    });

    // other results link clicked
    $('body').on('click', '#dnd-breadcumb-prior-results', function () {
        togglePaneElement('prior');
        console.log("updating firebase-2, json object is " + JSON.stringify(dateHistoryData));
        // while (isRestaurantCallCompleted && isMovieCallCompleted) {
        //     console.log("waiting for asyncronous calls to complete");
        //     console.log("isRestaurantCallCompleted " + isRestaurantCallCompleted);
        //     console.log("isMovieCallCompleted " + isRestaurantCallCompleted);
            updateDateHistoryDatabase(dateHistoryData);
        //     isRestaurantCallCompleted = false;
        //     isRestaurantCallCompleted = false;
        // }
       
        getOutputFromDateHistoryDatabase(dateHistoryData.zipCode);
    });

    // force time input to validate
    $('body').on('change', '#dnd-input-time', function () {
        var timeInput = $(this);
        let currentValue = timeInput.val();
        if (timeInput.attr('class') == 'is-invalid-input') {
            timeInput.removeClass('is-invalid-input');
            timeInput.val(currentValue + ':00');
        }
    });
});