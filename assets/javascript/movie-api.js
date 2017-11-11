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

// var obj = {};
// genres from: http://www.imdb.com/genre/
var movieGenres = {"0":{"name":"Romance","romance":8},"1":{"name":"Comedy","romance":4},
                   "2":{"name":"Action","romance":1},"3":{"name":"Family","romance":4},
                   "4":{"name":"Musical","romance":3},"5":{"name":"Western","romance":-2},
                   "6":{"name":"Science Fiction","romance":2},"7":{"name":"Mystery","romance":3},
                   "8":{"name":"Drama","romance":4},"9":{"name":"Horror","romance":2}};


let unusableKeys = ['s5r752t2j8u8jsjmex3vqjk7','86jv9kybwh7kkkaeprm5hez9'];
let apiKeyBank = ['vs8b3ghf7dfewx4kz8hfzuyu',
                  'addqr69eghub8vq4g8fw476d',
                  'rb8hzag4f93j2f86dbqbcrn5'];

// choose a random key so as not to hit the database too often
function getRandomKey() {
    return apiKeyBank[Math.floor(Math.random() * apiKeyBank.length)];
}

// given an array of genres, return the max romance factor
function getRomanceFactorForMovie(selectedGenres) {
    let genreKeys = Object.keys(movieGenres);
    var maxRomanceValue = 0;
    var maxRomanceGenre;
    var scores = genreKeys.map((cindex) => {
        let genreData = movieGenres[cindex];
        if (selectedGenres.includes(genreData.name)) {
            if (genreData.romance > maxRomanceValue) {

                maxRomanceValue = genreData.romance;
                maxRomanceGenre = genreData.name;
            }

            return genreData.romance;
        }
        return 0;
    });

    var uniqueScores = scores.filter(function(item, pos) {
        return scores.indexOf(item) == pos;
    });

    var sumOfScores = uniqueScores.reduce((a, b) => a + b, 0);
    let averageScore = (sumOfScores / uniqueScores.length);
    let randomizedScore = averageScore + (Math.random() * 2.0);
    return {'score': randomizedScore, 'genre': maxRomanceGenre};
}


function getMovies(numMovies, zipCode, radius, date, time, selectedGenres, callback) {
    let randomKey = getRandomKey();
    var queryURL = "https://data.tmsapi.com/v1.1/movies/showings";
    queryURL += '?' + $.param({
        'startDate': date,
        'zip': zipCode,
        'radius': radius,
        'units': "mi",
        'api_key': randomKey
    });

    // check for user cache
    let storageKeyName = 'dnd-movies-' + getIDString(zipCode, radius, numMovies, (date + ' ' + time))
    let hasSavedSearch = localStorage.hasOwnProperty(storageKeyName);

    if (hasSavedSearch) {
        let movieResults = JSON.parse(localStorage.getItem(storageKeyName));
        console.log('# returning ' + movieResults.length + ' movies from storage "' + storageKeyName + '"...');
        callback(movieResults);
        return
    }

    $.ajax({
        url: queryURL,
        method: 'GET',
        success: function (res) {
            console.log('# returning ' + res.length + ' results from movie database.');
            var movies = res
                    .filter(hasGenre)
                    .filter(checkGenre)
                    .map(function (movie) {
                    var obj = {};
                    obj.title = movie.title;
                    obj.genres = movie.genres;

                    // get the romance factor & genre
                    let romanceData = getRomanceFactorForMovie(obj.genres);
                    obj.romance = romanceData.score;
                    obj.primaryGenre = romanceData.genre;

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
                        // console.log("look for this: " + obj.times[0].dateTime);
                        obj.time = convertMilitaryToStandard(obj.times[0].dateTime.split('T')[1]);
                    } else {
                        obj.time = 'No showtimes this late'
                    }

                    obj.ticketURI = movie.showtimes[0].ticketURI;
                    return obj;
                });


            if (!localStorage.hasOwnProperty(storageKeyName)) {
                console.log('# caching ' + movies.length +' movies at: "' + storageKeyName + '"');
                localStorage.setItem(storageKeyName, JSON.stringify(movies));
            }

            function hasGenre(movie) {
                if (movie.genres) {
                    return true;
                }
                return false;
            }

            function checkGenre(movie) {
                //genre is an ARRAY!
                if (movie.genres.includes(selectedGenres[0])) {
                    return true;
                }
                return true;
            }


            // this variable returns a certain amount of movies from array (numMovies)
            var moviesInfo = movies.slice(0, numMovies);
            // this is the callback, it returns the movies object from above
            callback(moviesInfo);
        },
        // if an error happens, what is it
        error: function (err) {
            console.log("Error: an error callback was called for key: " + randomKey);
            console.log(err);
        }
    });



    function findTimesAfterFormTime(showTime) {
        // if time from form >= showTime return
        // split time from dateTime
        var timeFromApi = showTime.dateTime.split('T')[1];
        //add seconds to make js date datatype object to work
        var userTime = new Date(date + " " + time + ":00");
        var movieTime = new Date(date + " " + timeFromApi + ":00");
        if (userTime < movieTime) {
            // console.log("# this is a valid movie time");
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
