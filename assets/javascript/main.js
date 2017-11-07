
// globals
// genres from: http://www.imdb.com/genre/
var movieGenres = {"0":"romance","1":"comedy","2":"action","3":"family","4":"musical","5":"western","6":"sci-fi","7":"mystery","8":"drama"};
var restaurantCuisines = {"0":"italian","1":"french","2":"american","3":"indian","4":"british","5":"asian","6":"sushi"};

// build the restaurant cuisine list
function buildRestaurantCuinsineList() {
    var cuisineList = $('#dnd-cuisine-menu');
    cuisineList.empty();
    for (key in Object.keys(restaurantCuisines)) {
        let cuisineName = restaurantCuisines[key];
        // console.log('adding cuisine: "' + cuisineName + '" for index: ' + key);
        cuisineList.append('<option value="' + key + '">' + cuisineName + '</option>');
    }
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
        selected.push($(this).text());
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


// jbc I added the below code to main.js
function writeMovieToOutput(obj) {
    console.log("im in writeMovieToOutput");
    console.log("obj3: " + JSON.stringify(obj));
    console.log("name: " + obj.title);
    console.log("theatre: " + obj.theatre);
    console.log("ticketURI: " + obj.ticketURI);
    // $("#dnd-output-movie-time").text(obj.times[0]);
    $("#dnd-output-movie-time").text("8 PM");
    $("#dnd-output-movie-name").text(obj.title);
    $("#dnd-output-movie-venue").text(obj.theatre);
    if (typeof obj.ticketURI === "undefined") {
        obj.ticketURI = "https://www.fandango.com/";
        // $("#dnd-output-movie-url").text("https://www.fandango.com/");
        // } else
    }
    $("#dnd-output-movie-url").text(obj.ticketURI);

    $("#search").hide();
    $("#results").show();
}


// page load
$(document).ready(function () {


    // jbc I added the below code to main.js
    $("#results").hide();
    $("#priorResults").hide();

    // build the ui elements
    buildMovieGenresList();
    buildRestaurantCuinsineList();

    // supress default form action
    $('.btn').on('click', function (event) {
        event.preventDefault();
    });

    // search button clicked
    $('body').on('click', '#dnd-btn-search', function () {

        var numMovies = 1;
        var radius = 20;
        var date = $('#dnd-input-date').val();
        // IMPORTANT: the date must be within 6 days from current day, else returns an error.
        console.log(date);

        let zipCode = $('#dnd-input-zipcode').val().trim();
        var date = $('#dnd-input-date').val().trim();
        // let userSelectedData = Date($('#dnd-input-date').val().trim());

        getMovies(numMovies, zipCode, radius, date, function (moviesInfo) {
            console.log(moviesInfo);
        });



        let selectedCuisines = getSelectedCuisines();
        let selectedGenres = getSelectedGenres();

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);

        //-----------------------------------------------//
        // jbc I added the below code to main.js
        numMovies = 1;
        radius = 10;
        callback = '';
        //  getMovies(numMovies, zipCode, radius, userSelectedData, callback);

        getMovies(numMovies, zipCode, radius, date, function (moviesInfo) {
            // add all the jquery outputs for movie info here > movie title / theater & show times
            console.log("about to go into writeMoviesToOutput");
            console.log("obj: " + JSON.stringify(obj));
            writeMovieToOutput(obj);
            console.log("about to go into updateDateHistoryDatabase");
            updateDateHistoryDatabase(zipCode, radius, obj);
        });
    });
    //-----------------------------------------------//


    // prior result button clicked
    $('body').on('click', '#dnd-output-priors', function () {
        console.log('get prior dates button clicked ');
        // get 3 prior rows
        $("#results").hide();
        $("#priorResults").show();
        // call database and display 3 rows
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
