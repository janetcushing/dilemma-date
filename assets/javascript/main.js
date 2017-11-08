// globals
// genres from: http://www.imdb.com/genre/

var movieGenres = {"0":"romance","1":"comedy","2":"action","3":"family","4":"musical","5":"western","6":"sci-fi","7":"mystery","8":"drama"};
var restaurantCuisines = {"55":"italian","25":"chinese","1":"american","148":"indian","60":"japanese","82":"pizza","83":"seafood"};

// build the restaurant cuisine list
function buildRestaurantCuinsineList() {
    var cuisineList = $('#dnd-cuisine-menu');
    cuisineList.empty();
    let restaurantKeys = Object.keys(restaurantCuisines);
    restaurantKeys.forEach(function(key) {
        let cuisineName = restaurantCuisines[key];
        console.log('adding cuisine: "' + cuisineName + '" for index: ' + key);
        cuisineList.append('<option value="' + key + '">' + cuisineName + '</option>');
    });
}


// build the movie genre list
function buildMovieGenresList() {
    var movieGenreList = $('#dnd-genre-menu');
    movieGenreList.empty();
    for (key in Object.keys(movieGenres)) {
        let genreName = movieGenres[key];
        // console.log('adding genre: "' + genreName + '" for index: ' + key);
        movieGenreList.append('<option value="' + key + '">' + genreName + '</option>');
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
function writeMovieToOutput(obj) {
    console.log("im in writeMovieToOutput");
    console.log("obj3: " + JSON.stringify(obj));
    console.log("name: " + obj.title);
    console.log("theatre: " + obj.theatre);
    console.log("ticketURI: " + obj.ticketURI);
    // $("#dnd-output-movie-time").text(obj.times[0]);
    // $("#dnd-output-movie-time").text("8 PM");
    $("#dnd-output-movie-name").text(obj.title);
    $("#dnd-output-movie-venue").text(obj.theatre);
    if (typeof obj.ticketURI === "undefined") {
        obj.ticketURI = "https://www.fandango.com/";
        // $("#dnd-output-movie-url").text("https://www.fandango.com/");
        // } else
    }
    $("#dnd-output-movie-url").text(obj.ticketURI);

    //calculate dinner time based on movie time
    // and write it to the results page
    let dinnerTime = subractTwoHourFromDate(obj.times[0]);
    $("#dnd-output-dinner-time").text(dinnerTime);
}

//subtact 2 hours from a time in the format of "00:00 PM"
function subractTwoHourFromDate(origTime) {
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
    // $("#dnd-output-dinner-time").text("6 PM");
    $("#dnd-output-dinner-venue").text(restaurants[0].location);
    $("#dnd-output-dinner-name").text(restaurants[0].name);
    if (typeof restaurants[0].url === "undefined") {
        restaurants[0].url = "https://www.zomato.com/";
    }
    $("#dnd-output-dinner-url").text(restaurants[0].url);
}


// page load
$(document).ready(function () {
    console.log('starting up...');
    // jbc I added the below code to main.js
    $("#results").hide();
    $("#priorResults").hide();

    // build the ui elements
    buildMovieGenresList();
    buildRestaurantCuinsineList();

    // supress default form action
    $('.btn-search').on('click', function (event) {
        event.preventDefault();
    });

    // search button clicked
    $('body').on('click', '#dnd-btn-search', function () {

        $("#search").hide();
        $("#results").show();

        var numMovies = 1;
        var radius = 20;
        // var date = $('#dnd-input-date').val();
        // IMPORTANT: the date must be within 6 days from current day, else returns an error.
        console.log(date);


        let selectedCuisines = getSelectedCuisines();
        let selectedGenres = getSelectedGenres();

        let zipCode = $('#dnd-input-zipcode').val().trim();
        var date = $('#dnd-input-date').val().trim();
        numMovies = 1;
        radius = 10;
        callback = '';

        updateInputInDateHistoryJsonObject(zipCode, radius, date)

        // let userSelectedData = Date($('#dnd-input-date').val().trim());
        getLocation(zipCode, radius, selectedCuisines.toString());

        // getMovies(numMovies, zipCode, radius, date, function (moviesInfo) {
        //     console.log(moviesInfo);
        //     console.log("about to go into getLocation");

        // });

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);

        //-----------------------------------------------//
        // jbc I added the below code to main.js

        //  getMovies(numMovies, zipCode, radius, userSelectedData, callback);

        getMovies(numMovies, zipCode, radius, date, selectedGenres, function (moviesInfo) {
            // add all the jquery outputs for movie info here > movie title / theater & show times
            writeMovieToOutput(obj);
            updateMoviesInDateHistoryJsonObject(obj)
            updateDateHistoryDatabase(obj);
        });

    });


    // prior result button clicked
    $('body').on('click', '#dnd-output-priors', function () {
        console.log('get prior dates button clicked ');
        // get 3 prior rows
        $("#results").hide();
        $("#priorResults").show();
        // call database and display 3 rows
        updateDateHistoryDatabase(dateHistoryData);
        getOutputFromDateHistoryDatabase();
    });

    // back to search button clicked
    $('body').on('click', '#dnd-output-back-to-search', function () {
        console.log('back to search button clicked ');
        // go back to the search page
        $("#priorResults").hide();
        $("#search").show();

    });

    // back to results button clicked
    $('body').on('click', '#dnd-output-back-to-result', function () {
        console.log('back to date result button clicked ');
        // go back to the date results page
        $("#priorResults").hide();
        $("#results").show();
    });
});