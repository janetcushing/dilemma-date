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


// dateString @ "11/11/2017 19:00:00"
function getIDString(zipCode, radius, results, dateString) {
    let dtt = new Date(dateString);
    let mtt = moment(dtt);
    return (zipCode + ',' + mtt.format('YYYY-MM-DD:HH') + ',' + radius + ',' + results).hashCode();
}


// hash function
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


// Initialize Firebase
var config = {
    apiKey: "AIzaSyA1xGXNJrGt5WMHcopz8FXpkCEG5fcVdDQ",
    authDomain: "dilemmada-500cf.firebaseapp.com",
    databaseURL: "https://dilemmada-500cf.firebaseio.com",
    projectId: "dilemmada-500cf",
    storageBucket: "",
    messagingSenderId: "829055048426"
};

var mfconfig = {
  apiKey: "AIzaSyCU9xl8dhN7IntMOte_XdiaQXEyG8_pQRI",
  authDomain: "dilemma-date-1509903581959.firebaseapp.com",
  databaseURL: "https://dilemma-date-1509903581959.firebaseio.com",
  projectId: "dilemma-date-1509903581959",
  storageBucket: "dilemma-date-1509903581959.appspot.com",
  messagingSenderId: "967437045923"
};


firebase.initializeApp(mfconfig);

var database = firebase.database();
var dateHistoryRef = database.ref("/dateHistory");
var dateHistoryQuery = database.ref("dateHistory").orderByChild("timeStamp").limitToLast(3);
var userHistoryQuery = database.ref("/userHistory");
// var dateHistoryQuery2 = database.ref("dateHistory").orderByChild("zipCode").equalTo(zipCode);

// Checks to see if a user ID exists
function userIDExists(userID) {
    if (userID === null) { return false;}
    var exists = false;
    userHistoryQuery.once('value', function(snapshot) {
        let userData = snapshot.val();
        let userKeys = Object.keys(userData);
        userKeys.forEach(function(key) {
            let thisUser = userData[key];
            if (thisUser.userID === userID) {
                console.log(thisUser);
                exists = true;
            }
        })
    })
    return exists;
}


// Queries user id from email
function getUserReferenceForID(userID) {
    var refID = null;
    userHistoryQuery.once('value', function(snapshot) {
        var currentUser = snapshot.val();
        if (currentUser) {
            var values = Object.keys(snapshot.val());
            refID = values[0];
        }
    });
    return refID;
}


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
    "dateRating": 0,
    "movieRomance": 0,
    "restuarantRomance": 0
};

function updateInputInDateHistoryJsonObject(zipCode, radius, date, selectedCuisines, selectedGenres) {
    dateHistoryData.zipCode = zipCode;
    dateHistoryData.radius = radius;
    dateHistoryData.date = date;
    dateHistoryData.movieGenre = selectedGenres.toString();
    dateHistoryData.restaurantCuisine = selectedCuisines;
    dateHistoryData.dateRating = 0;
}

function updateMoviesInDateHistoryJsonObject(movieObj) {
    if (movieObj){
        dateHistoryData.movieTitle = movieObj.title;
        dateHistoryData.movieTheatre = movieObj.theatre;
        dateHistoryData.movieTime = movieObj.time;
        dateHistoryData.movieTheatreUrl = movieObj.ticketURI;
        // also insert the dinner time into the json object based on the movie time
        dateHistoryData.restaurantTime = subtractTwoHourFromDate(movieObj.time);
        isMovieCallComplete = true;
    }
}

function updateRestaurantInDateHistoryJsonObject(restaurants) {
    dateHistoryData.restaurantName = restaurants[0].name;
    dateHistoryData.restaurantLocation = restaurants[0].location;
    dateHistoryData.restaurantUrl = restaurants[0].url;
    dateHistoryData.restaurantID = restaurants[0].id;
    isRestaurantCallCompleted = true;
}


function updateDateHistoryDatabase(dateHistoryData) {
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
        movieRomance: dateHistoryData.movieRomance,
        restuarantRomance: dateHistoryData.restuarantRomance
        // dateRating: dateDataHistory.dateRating
    });

}

function getOutputFromDateHistoryDatabase(zipCode) {
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
        snapshot1.ref.orderByChild("timeStamp").limitToLast(3).on("value", function (snapshot2) {
            snapshot2.forEach(function (snapshot) {

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

                // add to prior-results
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
