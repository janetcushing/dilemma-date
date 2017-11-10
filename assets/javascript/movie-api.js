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
// 'api_key': "s5r752t2j8u8jsjmex3vqjk7"
// 'api_key': "b8hzag4f93j2f86dbqbcrn5"


// var obj = {};

function getMovies(numMovies, zipCode, radius, date, time, selectedGenres, callback) {

    var queryURL = "https://data.tmsapi.com/v1.1/movies/showings";
    queryURL += '?' + $.param({
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
            console.log("res: ");
            console.log(res);
            var movies = res
                .filter(hasGenre)
                .filter(checkGenre)
                .map(function (movie) {
                    var obj = {};
                    obj.title = movie.title;
                    obj.genres = movie.genres;
                    obj.theatre = movie.showtimes[0].theatre.name;
                    obj.date = movie.showtimes[0].dateTime.split('T')[0];
                    //this only lists 1 showtime per movie
                    // obj.time = movie.showtimes[0].dateTime.split('T')[1];
                    // this creates an array of showtimes for each movie, only showing 3 times
                    // obj.times = movie.showtimes.map(convertDateTimeToTimes);
                    // take movie showtimes array and run this filter function, which a boolean response
                    // collects true responses in if block and then returns the first showtime
                    // else, no showtimes that match, returns string
                    obj.times = movie.showtimes.filter(findTimesAfterFormTime);
                    if (obj.times[0]) {
                        console.log("look for this: " + obj.times[0].dateTime);
                        obj.time = convertMilitaryToStandard(obj.times[0].dateTime.split('T')[1]);
                    } else {
                        obj.time = 'No showtimes available, try earlier'
                    }

                    obj.ticketURI = movie.showtimes[0].ticketURI;
                    console.log("obj inside ajax call, about to return it: " + JSON.stringify(obj));
                    return obj;
                });
            console.log("movies starts here");
            console.log(movies);

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
            var moviesInfo = random.fromArray(movies);
            console.log("this is what you are looking for: ");
            console.log(moviesInfo);

            // this is the callback, it returns the movies object from above
            callback(moviesInfo);
        },
        // if an error happens, what is it
        error: function (err) {
            console.log("an error callback was called");
            console.log(err);
        }
    });



    function findTimesAfterFormTime(showTime) {
        // if time from form >= showTime return
        // split time from dateTime 
        var timeFromApi = showTime.dateTime.split('T')[1];
        //add seconds to make js date datatype object to work
        var userTime = new Date(date + " " + time + ":00");
        // console.log("userTime variable: " + userTime);
        // console.log("this is time: " + time);
        // console.log("this is date: " + date);

        var movieTime = new Date(date + " " + timeFromApi + ":00");
        // console.log("movieTime variable: " + movieTime);
        // console.log("this is time: " + timeFromApi);
        // console.log("this is date: " + date);
        if (userTime < movieTime) {
            console.log("this is a valid movie time");
        }
        // if the movie showtime is later than the user inputted time, return that time.
        return movieTime > userTime;
    }

}
// this is what it looks like when a showtime.dateTime key gets pulled in
// {theatre: {…}, dateTime: "2017-11-03T12:45", barg: false, ticketURI: "http://www.fandango.com/tms.asp?t=AAVTP&m=157889&d=2017-11-03"}
// function convertDateTimeToTimes(showTime) {
//     return showTime.dateTime.split('T')[1];
// }

// converts military to regular time for output on results page
function convertMilitaryToStandard(militaryTime) {

    var time = militaryTime.split(':'); // convert to array

    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);

    // calculate
    var timeValue;

    if (hours > 0 && hours <= 12) {
        timeValue = "" + hours;
    } else if (hours > 12) {
        timeValue = "" + (hours - 12);
    } else if (hours == 0) {
        timeValue = "12";
    }

    timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes; // get minutes
    timeValue += (hours >= 12) ? " P.M." : " A.M."; // get AM/PM

    return timeValue;
}