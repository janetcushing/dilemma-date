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
var dateDataQuery = dateDataRef.orderByKey();

{
    dateData = [

        {
            "zipCode": "03801",
            "radius": 10,
            "movieTitle": "Frozen",
            "theatre": "Regal Fox Run Stadium 15",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreAddress": "45 Gosling Road, Newington, NH 03801",
            "restaurantName": "Lexies",
            "restaurantAddress": "212 Islington, Portsmouth, NH",
            "restaurantLink": "https://www.peaceloveburgers.com/portsmouth",
            "dateRating": "awesome"
        },

        {
            "zipCode": "03801",
            "radius": 10,
            "movieTitle": "Thor: Ragnarok",
            "theatre": "Cinematic Portsmouth",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreAddress": "2454 Lafayette Rd, Portsmouth, NH 03801",
            "restaurantName": "Tuscan Kitchen",
            "restaurantAddress": "581 Lafayette Rd Portsmouth, NH 03801-5406",
            "restaurantLink": "http://tuscanbrands.com/",
            "dateRating": "super duper"
        },

        {
            "zipCode": "03839",
            "radius": 10,
            "movieTitle": "HAPPY DEATH DAY",
            "theatre": "BARNZ'S BARRINGTON CINEMA",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreAddress": "586 Calef Highway, Suite One, Barrington, NH 03825",
            "restaurantName": "Dinosaur Bar-B-Que",
            "restaurantAddress": "99 Court St Rochester, NH 14604",
            "restaurantLink": "http://www.dinobbq.com/",
            "dateRating": "fun"
        },

        {
            "zipCode": "03801",
            "radius": 10,
            "movieTitle": "Loving Vincent",
            "theatre": "Portsmouth Music Hall",
            "times": ['7:00 PM'],
            "theatreAddress": "28 Chestnut St, Portsmouth, NH 03801",
            "restaurantName": "The River House",
            "restaurantAddress": "53 Bow St Portsmouth, NH 03801",
            "restaurantLink": "http://www.riverhouse53bow.com/",
            "dateRating": "good times"
        },

        {
            "zipCode": "03839",
            "radius": 10,
            "movieTitle": "THE FOREIGNER (2017)",
            "theatre": "SMITTY'S SANFORD CINEMA & PUB",
            "times": ['6:30 PM', '10:15 PM'],
            "theatreAddress": "45 Gosling Road, Newington, NH 03801",
            "restaurantName": "Revolution Taproom and Grill",
            "restaurantAddress": " 61 N Main St, Rochester, NH 03867",
            "restaurantLink": "www.revolutiontaproomandgrill.com/",
            "dateRating": "awesome"
                },

        {
            "zipCode": "03839",
            "radius": 10,
            "movieTitle": "Geostorm",
            "theatre": "BARNZ'S BARRINGTON CINEMA",
            "times": ['4:00 PM', '7:00 PM', '9:00 PM'],
            "theatreAddress": "586 Calef Highway, Suite One, Barrington, NH 03825",
            "restaurantName": "The Garage at The Governor's Inn",
            "restaurantAddress": " 78 Wakefield St, Rochester, NH 03867",
            "restaurantLink": "www.governorsinn.com/thegarage.cfm",
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
            theatreAddress: dateData[i].theatreAddress,
            restaurantName: dateData[i].restaurantName,
            restaurantAddress: dateData[i].restaurantAddress,
            restaurantLink: dateData[i].restaurantLink,
            dateRating: dateData[i].dateRating

        });
    }

}


function getOutputFromDatabase() {
    console.log("im in getOutputFromDatabase ");
        dateDataQuery.once("value").then(function(snap){
            snap.forEach(function (snapshot) {

                console.log("in the snap");
                var pTitle = $('<p class="movieOutput">Movie: ' + snapshot.val().movieTitle + '</p>');
                var pTitle = $('<p>');
                pTitle.addClass('movieOutput');
                pTitle.text('Movie: ' + snapshot.val().movieTitle);

                var pTheatre = $('<p class="theatreOutput">Theatre: ' + snapshot.val().theatre + '</p>');
                var pTime = $('<p class="time">Times: ' + snapshot.val().time.toString() + '</p>');
                var pMovieAddrese = $('<p class="movieAddress">Movie: ' + snapshot.val().theatreAddress + '</p>');
                var pMovie = $("div");
                var pRestaurant = $('<p class="restaurantOutput">Restaurant: ' + snapshot.val().restaurant + '</p>');
                var pRestaurantLink = $('<p class="restaurantLinkOutput">URL: ' + snapshot.val().restaurantLink + '</p>');
                var pRestaurant = $("div");
                var dateRating = $('<p class="dateRatingOutput">Date Rating: ' + snapshot.val().dateRating + '</p>');

                pMovie.append(pTitle);
                pMovie.append(pTheatre);
                pMovie.append(pTime);
                pMovie.append(pmovieAddress);
                pRestaurant.append(pRestaurant);
                pRestaurant.append(pRestaurantLink);

                var date = $("div");
                date.append(pmovie);
                date.append(prestaurant);
                date.append(pdateRating);
                // $("#pastDates").prepend(date);
            });
        });

    }




//----------------------//
// main processing
//----------------------//
$(document).ready(function () {


    $("#dInput").on('click', function () {
        updateDatabase();
    });


    $("#dOutput").on('click', function () {
        console.log("output button was clicked");
        getOutputFromDatabase();
    });

});