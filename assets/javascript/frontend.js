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
    console.log("name: " + obj.theatre);
    console.log("name: " + obj.ticketURI);
    // $("#dnd-output-movie-time").text(obj.times[0]);
    $("#dnd-output-movie-time").text("8 PM");
    $("#dnd-output-movie-name").text(obj.title);
    $("#dnd-output-movie-venue").text(obj.theatre);
    $("#dnd-output-movie-url").text(obj.ticketURI);
    

    $("#search").hide();
    $("#results").show();
}
//-----------------------------------------------//


// page load
$(document).ready(function () {

    //-----------------------------------------------//
    // jbc I added the below code to frontend.js
    $("#results").hide();
    //-----------------------------------------------//


    // supress default form action
    $('.btn').on('click', function (event) {
        event.preventDefault();
    });

    // search button clicked
    $('body').on('click', '#dnd-btn-search', function () {

        let userZipCode = $('#dnd-input-zipcode').val().trim();
        let userSelectedData = Date($('#dnd-input-date').val().trim());

        let selectedCuisines = getSelectedCuisines();
        let selectedGenres = getSelectedGenres();

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);
        console.log("dnd-btn-search has been clicked");

        //-----------------------------------------------//
        // jbc I added the below code to frontend.js
        numMovies = 1;
        radius = 10;
        callback = '';
        //  getMovies(numMovies, userZipCode, radius, userSelectedData, callback);

        getMovies(numMovies, userZipCode, radius, date, function (moviesInfo) {
            // add all the jquery outputs for movie info here > movie title / theater & show times
            console.log("about to go into writeMoviesToOutput");
            console.log("obj: " + JSON.stringify(obj));
            writeMovieToOutput(obj);
        });
    });
    //-----------------------------------------------//

});