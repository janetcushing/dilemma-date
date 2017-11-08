///////////////////////////////////////////////This is for testing only //////////////////////////////////////////////
// var zero = 0;
// var numMovies = 3;
// var zipCode = "03867";
// var radius = 20;
// var date = "11/09/2017";

// IMPORTANT: the date must be within 6 days from current day, else returns an error.

// if we want to remove the date field from the form & only allow searches for the current day, use this instead
// var d = new Date();
// // this pulls in todays date
// var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

// this calls the whole getMovies function, which includes api call & creates the movieInfo array of objects
// this should be moved into biz logic file & attached to the onclick for the form submit button

// getMovies(numMovies, zipCode, radius, date, function (moviesInfo) {
//     // add all the jquery outputs for movie info here > movie title / theater & show times
//     console.log(moviesInfo);
// });


//////////////////////////////////////////////This is for testing only //////////////////////////////////////////////

// this function passes in the variable data for zipCode, radius & date, which is pulled from input fields on form
// the callback returns the moviesInfo object

var obj = {};

function getMovies(numMovies, zipCode, radius, date, selectedGenres, callback) {


    // this is how the date comes in from the form from looking at wireframe mockup
    // 10/31/2017
    // needs to be formated 2017-10-31
    // var day = date.split("/")[1];
    // var month = date.split("/")[0];
    // var year = date.split("/")[2];


    var queryURL = "https://data.tmsapi.com/v1.1/movies/showings";
    queryURL += '?' + $.param({
        // 'startDate': year + '-' + month + '-' + day,
        'startDate': date,
        'zip': zipCode,
        'radius': radius,
        'units': "mi",
        'api_key': "86jv9kybwh7kkkaeprm5hez9"
    });

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function (res) {
            var movies = res
                .filter(hasGenre)
                .filter(checkGenre)
                .map(function (movie) {
                    // var obj = {};
                    obj.title = movie.title;
                    obj.genres = movie.genres;
                    obj.theatre = movie.showtimes[0].theatre.name;
                    obj.date = movie.showtimes[0].dateTime.split('T')[0];
                    //this only lists 1 showtime per movie
                    // obj.time = movie.showtimes[0].dateTime.split('T')[1];
                    // this creates an array of showtimes for each movie, only showing 3 times
                    obj.times = movie.showtimes.slice(0, 3).map(convertDateTimeToTimes);
                    obj.ticketURI = movie.showtimes[0].ticketURI;
                    // console.log("obj: " + JSON.stringify(obj));
                    return obj;
                });

            function hasGenre(movie) {

                if (movie.genres) {
                    return true;
                }
            }

            function checkGenre(movie) {
                //genre is an ARRAY!
                if (movie.genres.includes(selectedGenres[0])) {
                    return true;
                }

            }


            // this variable returns a certain amount of movies from array (numMovies)
            var moviesInfo = movies.slice(0, numMovies);
            // console.log(moviesInfo);

            // this is the callback, it returns the movies object from above
            callback(moviesInfo);
        },
        // if an error happens, what is it
        error: function (err) {
            console.log("an error callback was called");
            console.log(err);
        }
    });
}
// this is what it looks like when a showtime.dateTime key gets pulled in
// {theatre: {…}, dateTime: "2017-11-03T12:45", barg: false, ticketURI: "http://www.fandango.com/tms.asp?t=AAVTP&m=157889&d=2017-11-03"}
function convertDateTimeToTimes(showTime) {
    return showTime.dateTime.split('T')[1];
}
