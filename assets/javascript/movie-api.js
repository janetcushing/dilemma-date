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

        // if an error happens
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
