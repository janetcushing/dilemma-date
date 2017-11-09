//--------------------------------------------------------------------------//
// javascript code for writing to and reading from the firebase database
//--------------------------------------------------------------------------//


// Initialize Firebase
var config = {
    apiKey: "AIzaSyA1xGXNJrGt5WMHcopz8FXpkCEG5fcVdDQ",
    authDomain: "dilemmada-500cf.firebaseapp.com",
    databaseURL: "https://dilemmada-500cf.firebaseio.com",
    projectId: "dilemmada-500cf",
    storageBucket: "",
    messagingSenderId: "829055048426"
};
firebase.initializeApp(config);

var database = firebase.database();
var dateHistoryRef = database.ref("/dateHistory");
var dateHistoryQuery = database.ref("dateHistory").orderByChild("zipCode").limitToLast(3);


dateHistoryData = {
    "zipCode": '',
    "radius": '',
    "date": '',
    "movieTitle": '',
    "movieTheatre": '',
    "movieTime": '',
    "movieTheatreUrl": '',
    "movieGenre": "",
    "restaurantTime": '',
    "restaurantName": '',
    "restaurantLocation": '',
    "restaurantUrl": '',
    "restaurantCuisine": '',
    "dateRating": ''
};

function updateInputInDateHistoryJsonObject(zipCode, radius, date, selectedCuisines, selectedGenres) {
    dateHistoryData.zipCode = zipCode;
    dateHistoryData.radius = radius;
    dateHistoryData.date = date;
    dateHistoryData.movieGenre = selectedGenres.toString();
    dateHistoryData.restaurantCuisine = selectedCuisines;
    dateHistoryData.dateRating = '';
}

function updateMoviesInDateHistoryJsonObject(movieObj) {
    dateHistoryData.movieTitle = movieObj.title;
    dateHistoryData.movieTheatre = movieObj.theatre;
    dateHistoryData.movieTime = movieObj.times[0];
    dateHistoryData.movieTheatreUrl = movieObj.ticketURI;
    // also insert the dinner time into the json object based on the movie time
    dateHistoryData.restaurantTime = subtractTwoHourFromDate(movieObj.times[0]);
}

function updateRestaurantInDateHistoryJsonObject(restaurants) {
    dateHistoryData.restaurantName = restaurants[0].name;
    dateHistoryData.restaurantLocation = restaurants[0].location;
    dateHistoryData.restaurantUrl = restaurants[0].url;
    console.log("dateHistoryData " + JSON.stringify(dateHistoryData));
}


function updateDateHistoryDatabase(dateHistoryData) {
    console.log("im in updateDateHistoryDatabase");
    console.log("the json object " + JSON.stringify(dateHistoryData));
    let timeStamp = (new Date()).getTime();
    dateHistoryRef.push({
        timeStamp: timeStamp,
        zipCode: dateHistoryData.zipCode,
        radius: dateHistoryData.radius,
        date: dateHistoryData.date,
        movieTitle: dateHistoryData.movieTitle,
        movieTheatre: dateHistoryData.movieTheatre,
        movieTime: dateHistoryData.movieTime,
        movieTheatreUrl: dateHistoryData.movieTheatreUrl,
        movieGenre: dateHistoryData.movieGenre,
        restaurantTime: dateHistoryData.restaurantTime,
        restaurantName: dateHistoryData.restaurantName,
        restaurantLocation: dateHistoryData.restaurantLocation,
        restaurantUrl: dateHistoryData.restaurantUrl,
        restaurantCuisine: dateHistoryData.restaurantCuisine
        // dateRating: dateDataHistory.dateRating

    });

}

function getOutputFromDateHistoryDatabase() {
    console.log("im in getOutputFromDatabase ");

    var i = 0;
    dateHistoryQuery.on("child_added", function (snapshot) {
   // dateHistoryQuery.once("child_added", function (snap) {
        // snap.forEach(function (snapshot) {
  
        console.log("snapshot.val().movieTime1 " + snapshot.val().movieTime);
        console.log("snapshot.val().movieTime2 " + snapshot.val().movieTime.toString());
        let dinnerTr = $("<tr>");
        let tdDinnerTime = $("<td>");
        tdDinnerTime.attr("id", "dnd-output-prior-dinner-time-" + i);
        tdDinnerTime.text(snapshot.val().restaurantTime);
        let tdDinnerVenue = $("<td>");
        tdDinnerVenue.attr("id", "dnd-output-prior-dinner-venue-" + i);
        tdDinnerVenue.text(snapshot.val().restaurantLocation);
        let tdDinnerName = $("<td>");
        tdDinnerName.attr("id", "dnd-output-prior-dinner-name-" + i);
        tdDinnerName.text(snapshot.val().restaurantName);
        let tdDinnerUrl = $('<td><a href="' + snapshot.val().restaurantUrl + '">Link</a>');
        tdDinnerUrl.attr("id", "dnd-output-prior-dinner-url-" + i);
        dinnerTr.append(tdDinnerTime);
        dinnerTr.append(tdDinnerName);
        dinnerTr.append(tdDinnerVenue);
        dinnerTr.append(tdDinnerUrl);
        $("#dnd-prior-results-tbody").append(dinnerTr);

        let movieTr = $("<tr>");
        let tdMovieTime = $("<td>");
        tdMovieTime.attr("id", "dnd-output-prior-movie-time-" + i);
        tdMovieTime.text(snapshot.val().movieTime);
        let tdMovieTitle = $("<td>");
        tdMovieTitle.attr("id", "dnd-output-prior-movie-title-" + i);
        tdMovieTitle.text(snapshot.val().movieTitle);
        let tdMovieVenue = $("<td>");
        tdMovieVenue.attr("id", "dnd-output-prior-movie-venue-" + i);
        tdMovieVenue.text(snapshot.val().movieTheatre);
        let tdMovieTheatreUrl = $('<td><a href="' + snapshot.val().movieTheatreUrl + '">Link</a>');
        tdMovieTheatreUrl.attr("id", "dnd-output-prior-movie-url-" + i);

        movieTr.append(tdMovieTime);
        movieTr.append(tdMovieTitle);
        movieTr.append(tdMovieVenue);
        movieTr.append(tdMovieTheatreUrl);
        $("#dnd-prior-results-tbody").append(movieTr);

        i++;
    });

}
