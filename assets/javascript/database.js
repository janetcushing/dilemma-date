//--------------------------------------------------------------------------//
// javascript code for writing to and reading from the firebase database
//--------------------------------------------------------------------------//

// generate unique id
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

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
var dateHistoryQuery = database.ref("dateHistory").orderByChild("timeStamp").limitToLast(3);
// var dateHistoryQuery2 = database.ref("dateHistory").orderByChild("zipCode").equalTo(zipCode);


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
    "dateRating": '',
    "romanceLevel": 0

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
    dateHistoryData.movieTime = movieObj.time;
    dateHistoryData.movieTheatreUrl = movieObj.ticketURI;
    // also insert the dinner time into the json object based on the movie time
    dateHistoryData.restaurantTime = subtractTwoHourFromDate(movieObj.time);
    isMovieCallComplete = true;
}

function updateRestaurantInDateHistoryJsonObject(restaurants) {
    dateHistoryData.restaurantName = restaurants[0].name;
    dateHistoryData.restaurantLocation = restaurants[0].location;
    dateHistoryData.restaurantUrl = restaurants[0].url;
    dateHistoryData.restaurantID = restaurants[0].id;
    console.log("dateHistoryData " + JSON.stringify(dateHistoryData));
    isRestaurantCallCompleted = true;
}


function updateDateHistoryDatabase(dateHistoryData) {
    console.log("im in updateDateHistoryDatabase");
    console.log("the json object " + JSON.stringify(dateHistoryData));
    // let timeStamp = (new Date()).getTime();
    let timeStamp = firebase.database.ServerValue.TIMESTAMP;

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
        restaurantCuisine: dateHistoryData.restaurantCuisine,
        restaurantID: dateHistoryData.restaurantID,
        romanceLevel: dateHistoryData.romanceLevel
        // dateRating: dateDataHistory.dateRating

    });

}

function getOutputFromDateHistoryDatabase(zipCode) {
    console.log("im in getOutputFromDatabase ");
    console.log("zipCode " + zipCode);
    isRestaurantCallCompleted = false;
    isMovieCallComplete = false;
    var i = 0;

    // dateHistoryQuery.on("child_added", function (snapshot) {
    // dateHistoryQuery.once("child_added", function (snap) {
    // snap.forEach(function (snapshot) {

    // dateHistoryQuery2.on("child_added", function (snapshot) {
    // database.ref("dateHistory").orderByChild("zipCode").equalTo(zipCode).on("child_added", function (snap) {
    //    this works:  database.ref("dateHistory").orderByChild("zipCode").equalTo(zipCode).on("child_added", function (snapshot){
    database.ref("dateHistory").orderByChild("zipCode").equalTo(zipCode).once("value", function (snapshot1) {
        console.log("im in the data call1");
        console.log("snapshot1.val() " + JSON.stringify(snapshot1.val()));
        console.log("snapshot1.val().timeStamp " + snapshot1.val().timeStamp);
        snapshot1.ref.orderByChild("timeStamp").limitToLast(3).on("value", function (snapshot2) {
            snapshot2.forEach(function (snapshot) {
                console.log("im in the next data call2");
                // snapshot2.ref.startAt(1).endAt(3).on("value", function (snapshot) {

                // console.log("im in the third data call3");
                // snap.ref.orderByChild("timeStamp").limitToLast(3).on("value", function (snapshot) {
                // snapshot.ref.orderByChild("timeStamp").limitToLast(3);
                console.log("snapshot.val() " + JSON.stringify(snapshot.val()));
                // console.log("snap.val() " + snap.val());
                console.log("snapshot.val().restaurantTime2 " + snapshot.val().restaurantTime);
                console.log("snapshot.val().restaurantName " + snapshot.val().restaurantName);
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
        });

    });

}