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


//-----------------------------------------------//
// jbc I added the below code to frontend.js
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


}

function writeRestaurantToOutput(restaurants) {
    console.log("im in writeRestaurantToOutput");
    console.log("restaurants: " + JSON.stringify(restaurants));
    console.log("name: " + restaurants[0].name);
    console.log("venue: " + restaurants[0].location);
    console.log("url: " + restaurants[0].url);
    $("#dnd-output-dinner-time").text("6 PM");
    $("#dnd-output-dinner-venue").text(restaurants[0].location);
    $("#dnd-output-dinner-name").text(restaurants[0].name);
    if (typeof restaurants[0].url === "undefined") {
        restaurants[0].url = "https://www.zomato.com/";
    }
    $("#dnd-output-dinner-url").text(restaurants[0].url);

}

//-----------------------------------------------//


// page load
$(document).ready(function () {

    //-----------------------------------------------//
    // jbc I added the below code to frontend.js
    $("#results").hide();
    $("#priorResults").hide();
    //-----------------------------------------------//


    // supress default form action
    $('.btn').on('click', function (event) {
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
        getLocation(zipCode, radius, selectedCuisines);

        // getMovies(numMovies, zipCode, radius, date, function (moviesInfo) {
        //     console.log(moviesInfo);
        //     console.log("about to go into getLocation");

        // });

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);
        console.log("dnd-btn-search has been clicked");

        //-----------------------------------------------//
        // jbc I added the below code to frontend.js

        //  getMovies(numMovies, zipCode, radius, userSelectedData, callback);

        getMovies(numMovies, zipCode, radius, date, selectedGenres, function (moviesInfo) {
            // add all the jquery outputs for movie info here > movie title / theater & show times
            writeMovieToOutput(obj);
            updateMoviesInDateHistoryJsonObject(obj)
            updateDateHistoryDatabase(obj);
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