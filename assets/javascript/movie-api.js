function getMovies(numMovies, zipCode, radius, date, time, selectedGenres, callback) {

    var queryURL = "https://data.tmsapi.com/v1.1/movies/showings";
    queryURL += '?' + $.param({
        'startDate': date,
        'zip': zipCode,
        'radius': radius,
        'units': "mi",
        'api_key': "addqr69eghub8vq4g8fw476d"
    });


    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function (res) {
            var movies = res
                .filter(hasGenre)
                .filter(checkGenre)
                .map(function (movie) {
                    var obj = {};
                    obj.title = movie.title;
                    obj.genres = movie.genres;
                    obj.theatre = movie.showtimes[0].theatre.name;
                    obj.date = movie.showtimes[0].dateTime.split('T')[0];
                    // take movie showtimes array and run this filter function, which is boolean response
                    // collects true responses in if block and then returns the first showtime
                    // else, no showtimes that match, returns string
                    obj.times = movie.showtimes.filter(findTimesAfterFormTime);
                    if (obj.times[0]) {
                        // console.log("look for this: " + obj.times[0].dateTime);
                        obj.time = convertMilitaryToStandard(obj.times[0].dateTime.split('T')[1]);
                    } else {
                        obj.time = 'No showtimes available, try earlier'
                    }

                    obj.ticketURI = movie.showtimes[0].ticketURI;
                    // console.log("obj inside ajax call, about to return it: " + JSON.stringify(obj));
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
            var moviesInfo = random.fromArray(movies);

            // this is the callback, it returns the movies object from above
            callback(moviesInfo);
        },

        // if an error happens
        error: function (err) {
            console.log("an error callback was called");
            console.log(err);
        }
    });



    function findTimesAfterFormTime(showTime) {
        // split time from dateTime 
        var timeFromApi = showTime.dateTime.split('T')[1];
        //add seconds to make js date datatype object to work
        var userTime = new Date(date + " " + time + ":00");
        var movieTime = new Date(date + " " + timeFromApi + ":00");
        if (userTime < movieTime) {
            // console.log("this is a valid movie time");
        }
        // if the movie showtime is later than the user inputted time, return that time.
        return movieTime > userTime;
    }

}

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