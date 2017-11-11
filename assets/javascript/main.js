// globals
var holdDinnerTime = "";
var isMovieCallCompleted = false;
var isRestaurantCallCompleted = false;

// ROMANCE EXTRAS
var mostRomanticMovie;
var mostRomanticRestaurant;
let romanceAltTags = {'1': 'You probably will not get laid tonight.', '2': 'With enough alcohol, you might get laid tonight.',
                      '3': 'There is a fair chance of you getting laid tonight.', '4': 'You will most likely get laid tonight.',
                      '5': 'You will absolutely get laid tonight.'}

// build the restaurant cuisine list
function buildRestaurantCuinsineList() {
    var cuisineList = $('#dnd-cuisine-menu');
    cuisineList.empty();
    let restaurantKeys = Object.keys(restaurantCuisines);
    restaurantKeys.forEach(function(key) {
        let cuisineData = restaurantCuisines[key];
        cuisineList.append('<option value="' + key + '" romance="' + cuisineData.romance + '">' + cuisineData.name + '</option>');
    });
}


// build the movie genre list
function buildMovieGenresList() {
    var movieGenreList = $('#dnd-genre-menu');
    movieGenreList.empty();
    for (key in Object.keys(movieGenres)) {
        let genreData = movieGenres[key];
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
    if (movieObj) {
        if (typeof movieObj.ticketURI === "undefined") {
            movieObj.ticketURI = "https://www.fandango.com/";
        }
        console.log('# writing movie object: ');

        var tr = $('<tr>');
        tr.append('<td class="fa fa-film" aria-hidden="true"></td>');
        tr.append(`<td>${movieObj.time}</td>`);
        tr.append(`<td>${movieObj.title}</td>`);
        tr.append(`<td>${movieObj.theatre}</td>`);
        tr.append(`<td><a href="${movieObj.ticketURI}">Link</a></td>`);

        $('#dnd-user-results-movies-tbody').prepend(tr);

        // $('#dnd-user-results-tbody').prepend(tr);
        //calculate dinner time based on movie time
        // and write it to the results page
        holdDinnerTime = subtractTwoHourFromDate(movieObj.time);
    }
}

//subtract 2 hours from a time in the format of "00:00 PM"
function subtractTwoHourFromDate(origTime) {
    var origHour = origTime.split(":")[0];
    var origMinutes = origTime.split(":")[1];

    // calculate the dinner time based on movie time
    var earlierHour = parseInt(origHour) - 2;
    var earlierMinutes = parseInt(origMinutes);

    // round minutes down to the nearest half hour; suggested dinner times should be even numbers
    var minutesRoundedDown = (earlierMinutes <= 15) ? 0 : (earlierMinutes <= 45) ? 30 : 0;
    var earlierTime = earlierHour + ":" + String(minutesRoundedDown).padStart(2, '0');
    return earlierTime;
}

function writeRestaurantToOutput(restaurants) {
    if (typeof restaurants[0].url === "undefined") {
        restaurants[0].url = "https://www.zomato.com/";
    }

    restaurants.forEach(restaurant => {
        var tr = $('<tr>');
        tr.append('<td class="fa fa-cutlery" aria-hidden="true"></td>');
        tr.append(`<td>${holdDinnerTime}</td>`);
        tr.append(`<td>${restaurant.name}</td>`);
        tr.append(`<td>${restaurant.cuisines}</td>`);
        tr.append(`<td>${restaurant.location}</td>`);
        tr.append(`<td><a href="${restaurant.url}">Link</a></td>`);
        $('#dnd-user-results-tbody').prepend(tr);
    });
}

// NEW ROMANCE STUFF

function parseRestaurantData(restaurants) {
    console.log('# ' + restaurants.length + ' restaurants received.');
}

function parseMovieData(movies) {
    var maxRomanceValue = 0;
    var mostRomantic;
    console.log('# parsing ' + movies.length + ' movies...');
    movies.forEach(movie => {
        if (movie.romance > maxRomanceValue) {
            maxRomanceValue = movie.romance;
            mostRomantic = movie;
        }

        if (typeof movie.ticketURI === "undefined") {
            movie.ticketURI = "https://www.fandango.com/";
        }
    })

    $('#dnd-restaurant-results').empty();
    $('#dnd-movie-results').empty();
    console.log('# most romantic movie is: "' + mostRomantic.title + '"');
    mostRomanticMovie = writeMovieToRandomResults(mostRomantic);
    $('#dnd-movie-results').append(mostRomanticMovie)
}

function writeMovieToRandomResults(movie) {
    var movieOutputHTML =
    '<tr>' +
    '<td class="shrink">' + movie.time + '</td>' +
    '<td class="expand">' +
    '<i class="fa fa-film" aria-hidden="true"></i>' +
    '<span class="dnd-date-detail-title">  ' + movie.title + '</span>' +
    '<p class="dnd-date-detail-desc">' + movie.theatre + '</p>' +
    '</td><td class="shrink">' + movie.primaryGenre + '</td>' +
    '<td class="shrink" id="insert-romance"></td>' +
    '<td class="shrink"><a href="' + movie.ticketURI + '">Link</a></td>' +
    '</tr>'



    let movieElement = $(movieOutputHTML);
    movieElement.find('#insert-romance').append(getRatingsWidget(movie.romance));

    return movieElement;
}


function clearRandomResults() {
    $('#dnd-restaurant-results').empty();
    $('#dnd-movie-results').empty()
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


function milesToMeters(miles) {
    return parseFloat(miles) * 1609.34;
}

// UI

// toggle interface panes
function togglePaneElement(named) {
    let searchPane = $('#search-pane');
    let resultsPane = $('#results-pane');

    if (named === "search") {
        searchPane.show();
        resultsPane.hide();
    } else {
        resultsPane.show();
        searchPane.hide();
    }
}

// populate inital form values
function populateSearchForm() {
    $('#dnd-input-date').val(moment().startOf('day').add(1, 'day').format('YYYY-MM-DD'));
    $('#dnd-input-time').val(currentUser.movieStart);
    $('#dnd-input-radius').val(currentUser.radius);
    $('#dnd-input-zipcode').val(currentUser.zipCode);
}

// Returns the difference between the user's requested time, and now (in hours).
function hoursUntilUserTime() {
    let currentDate = $('#dnd-input-date').val();
    let currentTime = $('#dnd-input-time').val();
    let userDate = moment(currentDate + ' ' + currentTime);
    let localDate = moment.utc(userDate).toDate();
    var duration = moment.duration(moment.utc().diff(localDate));
    return Math.abs(duration.asHours());
}

// when modal is opened, populate the form values
function populateSettingsForm(modal) {
    modal.find('#dnd-settings-input-zipcode').val(currentUser.zipCode);
    modal.find('#dnd-settings-input-radius').val(currentUser.radius);
    modal.find('#dnd-settings-input-movie-start').val(currentUser.movieStart);
}


// opens a progress modal
function openProgressModal(text, title = 'Alert', duration = 1500) {
    $('#dnd-progress-modal').foundation('open');
    $('#dnd-progress-modal-title').text(title);
    $('#dnd-progress-modal-body').text(text);
    if (duration > 0) {
        setTimeout(() => {
            $('#dnd-progress-modal').foundation('close');
        }, duration);
    }
}

// opens an alert modal
function openAlertModal(text, duration = 1500) {
    $('#dnd-alert-modal').foundation('open');
    $('#dnd-alert-modal-title').text('Error');
    $('#dnd-alert-modal-body').text(text);
    if (duration > 0) {
        setTimeout(() => {
            $('#dnd-alert-modal').foundation('close');
        }, duration);
    }

}

// USER PREFS

function saveUserDataToLocal(data={}) {
    for (var k in data) currentUser[k] = data[k];
    currentUser.saveLocalData();
}


function getUserDataFromLocal() {
    if (localStorage.hasOwnProperty('dnd-user-prefs')) {
        return JSON.parse(localStorage.getItem('dnd-user-prefs'));
    }
    return {};
}

// Generates a widget with 0-5 heart rating
function getRatingsWidget(starCount, uuid=null) {
    // fa-heart-o on fa-heart
    let tooltip = $('<span data-tooltip aria-haspopup="true" class="has-tip top" data-disable-hover="false" tabindex="2" title="' + romanceAltTags[starCount] + '">')
    let container = $('<div class="dnd-user-rating-container"></div>');
    // container.append(tooltip)
    let parentDiv = $('<div data-value="' + (uuid || guid()) + '" id="dnd-rating-widget" class="dnd-user-rating-widget"></td>');
    [1, 2, 3, 4, 5].forEach(function(item) {
        var ariaName = (item <= starCount) ? 'fa-heart' : 'fa-heart-o';
        var fillValue = (item <= starCount) ? 'filled' : 'unfilled';
        var classString = (item <= starCount) ? 'dnd-heart-widget' : 'dnd-heart-widget unfilled';
        parentDiv.append($('<i fill-value="' + fillValue + '" data-value="' + item + '" class="fa ' + ariaName + ' ' + classString + '" aria-hidden="true"></i>'));
    });
    container.append(parentDiv);
    parentDiv.append(tooltip)
    return container;
}

// pass this a '#dnd-rating-widget'
function ratingWidgetData(widget) {
    if (!widget) {
        return {};
    }

    let rating = widget.find("i[fill-value='filled']").length;
    return {
        'rating': rating,
        'uuid': widget.attr('data-value')
    };
}

function processUserRating(data) {

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
    'dateIDs': [],
    saveLocalData() {
        localStorage.setItem('dnd-user-prefs', JSON.stringify(this));
        console.log('# Saving user preferences...');
    },
    loadDataFromLocal() {
        var savedData = getUserDataFromLocal();
        for (var k in savedData) this[k] = savedData[k];
    }
};


class DateObject {
    constructor() {
        this.movie = null;
        this.restaurant = null;
    }
}


// Foundation initialize
$(function() {
    $(document).foundation();
    console.log('# initializing Foundation...');
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
$('#dnd-input-time').on('change', function () {
    $(this).trigger('validate.zf.abide');
});

// form validation failed
$(document).on("forminvalid.zf.abide", function (ev, frm) {
    // console.log('# form id "' + ev.target.id + '" is invalid');
})


// search form submitted...
$(document).on("submit", function(ev) {
    ev.preventDefault();

    // check time until the requested date...
    let hours = hoursUntilUserTime();
    // if it's less than three hours away, no dice...
    if (hours < 3.0) {
        openAlertModal('Not enough time to plan your date! Perhaps buy some flowers?', 0);
        return;
    }

    let requestedDate = new Date(getDateTime());
    let requestedHour = requestedDate.getHours();

    if (requestedHour > 21 ) {
        openAlertModal('That\'s too late to plan this date!', 0);
        return;
    }


    // progress modal alert
    openProgressModal('querying database...', title = 'Searching...');
    togglePaneElement('results');

    // get selection data from menus
    let selectedCuisines = getSelectedCuisines();
    let selectedGenres = getSelectedGenres();

    var zipCode = $('#dnd-input-zipcode').val().trim();
    var date = $('#dnd-input-date').val().trim();
    var time = $('#dnd-input-time').val().trim();
    var radius = parseInt($('#dnd-input-radius').val().trim());

    // save data to local storage
    saveUserDataToLocal({
        'zipCode': zipCode,
        'radius': radius
    });

    numMovies = 50;
    callback = '';

    // this sends to firebase?
    updateInputInDateHistoryJsonObject(zipCode, radius, date, selectedCuisines.toString(), selectedGenres);

    getMovies(numMovies, zipCode, radius, date, time, selectedGenres, function(moviesInfo) {
        // add all the jquery outputs for movie info here > movie title / theater & show times
        var movieObj = moviesInfo[0];
        writeMovieToOutput(movieObj);
        updateMoviesInDateHistoryJsonObject(movieObj);
        parseMovieData(moviesInfo);
        // updateDateHistoryDatabase(dateHistoryData);
    });

    getLocation(zipCode, milesToMeters(radius), selectedCuisines.toString());
});


// page load
$(document).ready(function() {
    // show the search pane
    togglePaneElement('search');

    // load data from local storage
    currentUser.loadDataFromLocal();
    let userCon = currentUser.dbRef = userHistoryQuery.push(true);
    userCon.onDisconnect().remove();
    userHistoryQuery.child(currentUser.dbRef.key).update({'userID': currentUser.uuid})

    // build the ui elements
    buildMovieGenresList();
    buildRestaurantCuinsineList();

    // populate the form with default values
    populateSearchForm();


    // FOOTER
    // link to home page
    $('body').on('click', '#dnd-btn-home', function() {
        togglePaneElement('search');
    });

    // user preferences modal
    $('body').on('click', '#dnd-btn-settings', function() {
        $('#dnd-settings-modal').foundation('open');
    });


    // link to home page
    $('body').on('click', '#dnd-btn-suggestions', function() {
        getOutputFromDateHistoryDatabase(dateHistoryData.zipCode);
        togglePaneElement('prior');
    });

    // user preferences modal submitted
    $('body').on('click', '#dnd-settings-save', function() {
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
        console.log("updating firebase-2, json object is " + JSON.stringify(dateHistoryData));

        updateDateHistoryDatabase(dateHistoryData);
        getOutputFromDateHistoryDatabase(dateHistoryData.zipCode);
    });


    // rating widget clicked
    $('body').on('click', '.dnd-heart-widget', function() {
        let icon = $(this);
        let heartNum = icon.attr('data-value');
        let isFilled = icon.attr('fill-value');
        let parentDiv = icon.parents().find('#dnd-rating-widget');
        let ratingData = ratingWidgetData(parentDiv);
        console.log(ratingData);
    });
});
