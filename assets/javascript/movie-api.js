var zipCode = "03867";
var radius = 5;
var d = new Date();
var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();



var queryURL = "http://data.tmsapi.com/v1.1/movies/showings";
queryURL += '?' + $.param({
    'startDate': today,
    'zip': zipCode,
    'radius': radius,
    'units': "mi",
    'api_key': "rb8hzag4f93j2f86dbqbcrn5"
});

console.log(queryURL);


// http://data.tmsapi.com/v1.1/movies/showings?api-key=rb8hzag4f93j2f86dbqbcrn5&zip=03867&radius=5&units=mi


$.ajax({
    url: queryURL,
    method: 'GET',
}).done(function (response) {
    console.log(response);
    // console.log(response.data[0].url); 
});