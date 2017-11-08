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
var dateHistoryQuery = database.ref("dateHistory").orderByChild("zipCode").limitToFirst(3);


dateHistoryData = {
    "zipCode": '',
    "radius": '',
    "date": '',
    "movieTitle": '',
    "theatre": '',
    "time": '',
    "theatreUrl": '',
    "restaurantTime": '',
    "restaurantName": '',
    "restaurantLocation": '',
    "restaurantUrl": '',
    "dateRating": ''
};

function updateInputInDateHistoryJsonObject(zipCode, radius, date) {
    dateHistoryData.zipCode = zipCode;
    dateHistoryData.radius = radius;
    dateHistoryData.date = date;
    dateHistoryData.dateRating = '';
}

function updateMoviesInDateHistoryJsonObject(obj) {
    dateHistoryData.movieTitle = obj.title;
    dateHistoryData.theatre = obj.theatre;
    dateHistoryData.time = obj.times[0];
    dateHistoryData.theatreUrl = obj.ticketURI;
    // also insert the dinner time into the json object based on the movie time
    dateHistoryData.restaurantTime = subractTwoHourFromDate(obj.times[0]);
}

function updateRestaurantInDateHistoryJsonObject(restaurants) {
    dateHistoryData.restaurantTime = "7:00 PM";
    dateHistoryData.restaurantName = restaurants[0].name;
    dateHistoryData.restaurantLocation = restaurants[0].location;
    // dateHistoryData.restaurantUrl = restaurants[0].url;
    dateHistoryData.restaurantUrl = restaurants[0].url;
    console.log("dateHistoryData " + JSON.stringify(dateHistoryData));
}


function updateDateHistoryDatabase(dateHistoryData) {
    console.log("im in updateDateHistoryDatabase");
    console.log("the json object " + JSON.stringify(dateHistoryData));

    console.log("zip " + dateHistoryData.zipCode);
    console.log("zip " + dateHistoryData.radius);
    console.log("zip " + dateHistoryData.restaurantTime);
    console.log("zip " + dateHistoryData.restaurantLocation);
    console.log("zip " + dateHistoryData.restaurantName);
    console.log("zip " + dateHistoryData.restaurantUrl);
    dateHistoryRef.push({
        zipCode: dateHistoryData.zipCode,
        radius: dateHistoryData.radius,
        movieTitle: dateHistoryData.movieTitle,
        theatre: dateHistoryData.theatre,
        date: dateHistoryData.date,
        movieTime: dateHistoryData.time,
        theatreUrl: dateHistoryData.theatreUrl,
        restaurantTime: dateHistoryData.restaurantTime,
        restaurantName: dateHistoryData.restaurantName,
        restaurantLocation: dateHistoryData.restaurantLocation,
        restaurantUrl: dateHistoryData.restaurantUrl
        // dateRating: dateDataHistory.dateRating

    });
    // }

}

function getOutputFromDateHistoryDatabase() {
    console.log("im in getOutputFromDatabase ");
    // $("#pastDates").empty();
    var i = 0;
    dateHistoryQuery.on("child_added", function (snapshot) {
        console.log(snapshot.val().movieTime);
        var movieTr = $("<tr>");
        var tdTime = $("<td>");
        tdTime.attr("id", "dnd-output-prior-movie-time-" + i);
        tdTime.text(snapshot.val().movieTime);
        var tdTitle = $("<td>");
        tdTitle.attr("id", "dnd-output-prior-movie-title-" + i);
        tdTitle.text(snapshot.val().movieTitle);
        var tdVenue = $("<td>");
        tdVenue.attr("id", "dnd-output-prior-movie-venue-" + i);
        tdVenue.text(snapshot.val().theatre);
        var tdTheatreUrl = $("<td>");
        tdTheatreUrl.attr("id", "dnd-output-prior-movie-url-" + i);
        tdTheatreUrl.text(snapshot.val().theatreUrl);

        movieTr.append(tdTime);
        movieTr.append(tdVenue);
        movieTr.append(tdTitle);
        movieTr.append(tdTheatreUrl);
        $("#dnd-output-prior-results").append(movieTr);

        console.log("i just appended to #dnd-output-priors");
        var dinnerTr = $("<tr>");
        var tdDinnerTime = $("<td>");
        tdDinnerTime.attr("id", "dnd-output-prior-dinner-time-" + i);
        tdDinnerTime.text(snapshot.val().restaurantTime);
        var tdDinnerVenue = $("<td>");
        tdDinnerVenue.attr("id", "dnd-output-prior-dinner-venue-" + i);
        tdDinnerVenue.text(snapshot.val().restaurantLocation);
        var tdDinnerName = $("<td>");
        tdDinnerName.attr("id", "dnd-output-prior-dinner-name-" + i);
        tdDinnerName.text(snapshot.val().restaurantName);
        var tdDinnerUrl = $("<td>");
        tdDinnerUrl.attr("id", "dnd-output-prior-dinner-time-" + i);
        tdDinnerUrl.text(snapshot.val().restaurantUrl);
        dinnerTr.append(tdDinnerTime);
        dinnerTr.append(tdDinnerVenue);
        dinnerTr.append(tdDinnerName);
        dinnerTr.append(tdDinnerUrl);
        $("#dnd-output-prior-results").append(dinnerTr);
        i++;
    });

}