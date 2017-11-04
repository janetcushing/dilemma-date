// javascript code for writing to and reading from the firebase database


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
var dateDataRef = database.ref("/dateData");
var dateDataQuery = database.ref("dateData").orderByChild("dateRating").limitToFirst(3);
// var dateDataQuery = database.ref("dateData").orderByKey().limitToFirst(3);

//comment

var zipCodeIn = '03801';
{
    dateData = [

        {
            "zipCode": "03801",
            "radius": 10,
            "movieTitle": "Frozen",
            "theatre": "Regal Fox Run Stadium 15",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreaddress": "45 Gosling Road, Newington, NH 03801",
            "theatreUrl"  : "https://www.regmovies.com/theaters/regal-fox-run-stadium-15-rpx/C00352134632",
            "restaurantName": "Lexies",
            "restaurantAddress": "212 Islington, Portsmouth, NH",
            "restaurantUrl": "https://www.peaceloveburgers.com/portsmouth",
            "dateRating": "awesome"
        },

        {
            "zipCode": "03801",
            "radius": 10,
            "movieTitle": "Thor: Ragnarok",
            "theatre": "Cinematic Portsmouth",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreaddress": "2454 Lafayette Rd, Portsmouth, NH 03801",
            "theatreUrl"  : "http://www.cinemagicmovies.com/location/36613/Cinemagic-Stadium-10-in-Portsmouth-NH-Showtimes",
            "restaurantName": "Tuscan Kitchen",
            "restaurantAddress": "581 Lafayette Rd Portsmouth, NH 03801-5406",
            "restaurantUrl": "http://tuscanbrands.com/",
            "dateRating": "super duper"
        },

        {
            "zipCode": "03839",
            "radius": 10,
            "movieTitle": "HAPPY DEATH DAY",
            "theatre": "BARNZ'S BARRINGTON CINEMA",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreaddress": "586 Calef Highway, Suite One, Barrington, NH 03825",
            "theatreUrl"  : "http://www.barnzs.com/",
            "restaurantName": "Dinosaur Bar-B-Que",
            "restaurantAddress": "99 Court St Rochester, NH 14604",
            "restaurantUrl": "http://www.dinobbq.com/",
            "dateRating": "fun"
        },

        {
            "zipCode": "03801",
            "radius": 10,
            "movieTitle": "Loving Vincent",
            "theatre": "Portsmouth Music Hall",
            "times": ['7:00 PM'],
            "theatreaddress": "28 Chestnut St, Portsmouth, NH 03801",
            "theatreUrl"  : "http://www.themusichall.org/",
            "restaurantName": "The River House",
            "restaurantAddress": "53 Bow St Portsmouth, NH 03801",
            "restaurantUrl": "http://www.riverhouse53bow.com/",
            "dateRating": "good times"
        },

        {
            "zipCode": "03839",
            "radius": 10,
            "movieTitle": "THE FOREIGNER (2017)",
            "theatre": "SMITTY'S SANFORD CINEMA & PUB",
            "times": ['6:30 PM', '10:15 PM'],
            "theatreaddress": "45 Gosling Road, Newington, NH 03801",
            "theatreUrl"  : "http://smittyscinema.com/sanford/",
            "restaurantName": "Revolution Taproom and Grill",
            "restaurantAddress": " 61 N Main St, Rochester, NH 03867",
            "restaurantUrl": "www.revolutiontaproomandgrill.com/",
            "dateRating": "awesome"
        },

        {
            "zipCode": "03839",
            "radius": 10,
            "movieTitle": "Geostorm",
            "theatre": "BARNZ'S BARRINGTON CINEMA",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreaddress": "586 Calef Highway, Suite One, Barrington, NH 03825",
            "theatreUrl"  : "http://www.barnzs.com/",
            "restaurantName": "The Garage at The Governor's Inn",
            "restaurantAddress": " 78 Wakefield St, Rochester, NH 03867",
            "restaurantUrl": "www.governorsinn.com/thegarage.cfm",
            "dateRating": "great"
        }
    ]
}


function updateDatabase() {
    console.log("im in updateDatabase");
    for (i = 0; i < Object.keys(dateData).length; i++) {
        console.log("length of json: " + Object.keys(dateData).length);
        dateDataRef.push({
            zipCode: dateData[i].zipCode,
            radius: dateData[i].radius,
            movieTitle: dateData[i].movieTitle,
            theatre: dateData[i].theatre,
            times: dateData[i].times.toString(),
            theatreaddress: dateData[i].theatreaddress,
            theatreUrl: dateData[i].theatreUrl,
            restaurantName: dateData[i].restaurantName,
            restaurantAddress: dateData[i].restaurantAddress,
            restaurantUrl: dateData[i].restaurantUrl,
            dateRating: dateData[i].dateRating

        });
    }

}


function getOutputFromDatabase() {
    console.log("im in getOutputFromDatabase ");
    $("#pastDates").empty();
    dateDataQuery.on("child_added", function (snapshot) {
        console.log(snapshot.val().time);
        var movieDiv = $("<div>");
        var pTitle = $('<p class="movieOutput">Movie: ' + snapshot.val().movieTitle + '</p>');
        var pTheatre = $('<p class="theatreOutput">Theatre: ' + snapshot.val().theatre + '</p>');
        // var pTime = $('<p class="time">Times: ' + snapshot.val().time + '</p>');
        var pMovieAddress = $('<p class="movieAddress">Movie: ' + snapshot.val().theatreAddress + '</p>');
        var restaurantDiv = $("<div>");
        var pRestaurantName = $('<p class="restaurantOutput">Restaurant: ' + snapshot.val().restaurant + '</p>');
        var prestaurantUrl = $('<p class="restaurantUrlOutput">URL: ' + snapshot.val().restaurantUrl + '</p>');
        var ratingDiv = $("<div>");
        var dateRating = $('<p class="dateRatingOutput">Date Rating: ' + snapshot.val().dateRating + '</p>');
        movieDiv.append(pTitle);
        movieDiv.append(pTheatre);
        // movieDiv.append(pTime);
        movieDiv.append(pMovieAddress);
        restaurantDiv.append(pRestaurantName);
        restaurantDiv.append(prestaurantUrl);
        ratingDiv.append(dateRating);
        var date = $("<div>");
        date.append(movieDiv);
        date.append(restaurantDiv);
        date.append(ratingDiv);
        $("#pastDates").append(date);
    });

}




//----------------------//
// main processing
//----------------------//
$(document).ready(function () {


    $("#dInput").on('click', function () {
        event.preventDefault();
        updateDatabase();
    });


    $("#dOutput").on('click', function () {
        event.preventDefault();
        console.log("output button was clicked");
        getOutputFromDatabase();
    });

});