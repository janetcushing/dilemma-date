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


// write movie result to results
function writeMovieToOutput(obj) {
    console.log(obj);
    // $("#dnd-output-movie-time").text(obj.times[0]);
    // $("#dnd-output-movie-time").html("8 PM");
    // $("#dnd-output-movie-name").html(obj.title);
    // $("#dnd-output-movie-venue").html(obj.theatre);
    if (typeof obj.ticketURI === "undefined") {
        obj.ticketURI = "https://www.fandango.com/";
        // $("#dnd-output-movie-url").text("https://www.fandango.com/");
        // } else
    }
    // $("#dnd-output-movie-url").text(obj.ticketURI);


    var tr = $('<tr>');
    tr.append('<td class="fa fa-film" aria-hidden="true"></td>');
    tr.append(`<td>${"8 PM"}</td>`);
    tr.append(`<td>${obj.title}</td>`);
    tr.append(`<td>${obj.theatre}</td>`);
    tr.append(`<td>${obj.ticketURI}</td>`);

    $('#dnd-user-results-tbody').append(tr);

}


function writeRestaurantToOutput(restaurants) {
    console.log(restaurants);
    if (typeof restaurants[0].url === "undefined") {
        restaurants[0].url = "https://www.zomato.com/";
    }

    var tr = $('<tr>');
    tr.append('<td class="fa fa-cutlery" aria-hidden="true"></td>');
    tr.append(`<td>${"8 PM"}</td>`);
    tr.append(`<td>${restaurants[0].name}</td>`);
    tr.append(`<td>${restaurants[0].location}</td>`);
    tr.append(`<td>${restaurants[0].url}</td>`);
    $('#dnd-user-results-tbody').append(tr);
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


    // populate the form with default values
    populateSearchForm();


    // search button clicked
    $('body').on('click', '#dnd-btn-search', function() {

        togglePaneElement('search');

        var numMovies = 1;
        var radius = 20;

        // get selection data from menus
        let selectedCuisines = getSelectedCuisines();
        let selectedGenres = getSelectedGenres();

        let zipCode = $('#dnd-input-zipcode').val().trim();
        var date = $('#dnd-input-date').val().trim();

        // save data to local storage
        saveUserDataToLocal(zipCode, radius);

        numMovies = 1;
        radius = 10;
        callback = '';

        updateInputInDateHistoryJsonObject(zipCode, radius, date)

        getLocation(zipCode, radius, selectedCuisines.toString());

        // getMovies(numMovies, zipCode, radius, date, function (moviesInfo) {
        //     console.log(moviesInfo);
        //     console.log("about to go into getLocation");

        // });

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);

        //  getMovies(numMovies, zipCode, radius, userSelectedData, callback);

        getMovies(numMovies, zipCode, radius, date, selectedGenres, function(moviesInfo) {
            // add all the jquery outputs for movie info here > movie title / theater & show times
            var obj = moviesInfo[0];
            console.log("movie returns control to program");
            console.log(obj);
            console.log(moviesInfo);
            writeMovieToOutput(obj);
            updateMoviesInDateHistoryJsonObject(obj)
            updateDateHistoryDatabase(obj);
        });
    });

    // MODALS

    // user preferences modal
    $('body').on('click', '#dnd-btn-settings', function() {
        $('#dnd-settings-modal').foundation('open');
    });

    // user preferences modal submitted
    $('body').on('click', '#dnd-settings-save', function() {

        let saveButton = $(this);
        let modal = saveButton.parents().find('#dnd-settings-modal');
        console.log(modal);
        currentUser.zipCode = modal.find('#dnd-settings-input-zipcode').val();
        currentUser.radius = modal.find('#dnd-settings-input-radius').val();
        currentUser.movieStart = modal.find('#dnd-settings-input-movie-start').val();
        currentUser.saveLocalData();
        $('#dnd-settings-modal').foundation('close');
    });

    // NAVIGATION LINKS

    // home link clicked
    $('body').on('click', '#dnd-breadcumb-home', function() {
        togglePaneElement('search');
    });

    // results link clicked
    $('body').on('click', '#dnd-breadcumb-results', function() {
        togglePaneElement('results');
    });

    // other results link clicked
    $('body').on('click', '#dnd-breadcumb-prior-results', function() {
        togglePaneElement('prior');

        updateDateHistoryDatabase(dateHistoryData);
        getOutputFromDateHistoryDatabase();
    });

    // force time input to validate
    $('body').on('change', '#dnd-input-time', function() {
        var timeInput = $(this);
        let currentValue = timeInput.val();
        if (timeInput.attr('class') == 'is-invalid-input') {
            timeInput.removeClass('is-invalid-input');
            timeInput.val(currentValue + ':00');
        }
    });
});
