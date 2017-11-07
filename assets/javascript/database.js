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


function updateDateHistoryDatabase(zipCode, radius, obj) {
    console.log("im in updateDateHistoryDatabase");
    // for (i = 0; i < Object.keys(obj).length; i++) {
    // console.log("length of json: " + Object.keys(obj).length);
    dateHistoryRef.push({
        zipCode: zipCode,
        radius: radius,
        movieTitle: obj.title,
        theatre: obj.theatre,
        date: obj.date,
        movieTime: obj.times[0],
        theatreUrl: obj.ticketURI
        // restaurantName: dateData[i].restaurantName,
        // restaurantAddress: dateData[i].restaurantAddress,
        // restaurantUrl: dateData[i].restaurantUrl,
        // dateRating: dateData[i].dateRating

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
        tdDinnerTime.text("7:00 PM");
        var tdDinnerVenue = $("<td>");
        tdDinnerVenue.attr("id", "dnd-output-prior-dinner-venue-" + i);
        tdDinnerVenue.text("Downtown Dover");
        var tdDinnerName = $("<td>");
        tdDinnerName.attr("id", "dnd-output-prior-dinner-name-" + i);
        tdDinnerName.text("The Thirsty Moose");
        var tdDinnerUrl = $("<td>");
        tdDinnerUrl.attr("id", "dnd-output-prior-dinner-time-" + i);
        tdDinnerUrl.text("www.thirstymoose.com");
        dinnerTr.append(tdDinnerTime);
        dinnerTr.append(tdDinnerVenue);
        dinnerTr.append(tdDinnerName);
        dinnerTr.append(tdDinnerUrl);
        $("#dnd-output-prior-results").append(dinnerTr);
        i++;
    });

}