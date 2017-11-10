//Thre script tag below needs to be in the html to make the conversion from zip code to lat/long coordinates
//<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyApxgL2mMoiMcWrEvui6tLwqs6zD6T_E7Y"></script>
var restaurantCuisines = {"1":{"name":"American","romance":3},"3":{"name":"Asian","romance":3},"25":{"name":"Chinese","romance":2},
                          "45":{"name":"French","romance":8},"55":{"name":"Italian","romance":5},"60":{"name":"Japanese","romance":3},
                          "73":{"name":"Mexican","romance":-1},"82":{"name":"Pizza","romance":2},"83":{"name":"Seafood","romance":5},
                          "100":{"name":"Desserts","romance":5},"148":{"name":"Indian","romance":1},"168":{"name":"Burger","romance":1}};

var restaurants = {};

// parse the cuisines data from the Zomata data
function getCuisinesFromRestaurantData(data) {
    return data.split(',').map((element) => { return element.trim() });
}

// given an array of cuisines, return the max romance factor
function getRomanceFactorForRestaurant(cuisines) {
    let cuisinesKeys = Object.keys(restaurantCuisines);
    var scores = cuisinesKeys.map((cindex) => {
        let cuisineData = restaurantCuisines[cindex];
        if (cuisines.includes(cuisineData.name)) {
            return cuisineData.romance;
        }
        return 0;
    });

    var uniqueScores = scores.filter(function(item, pos) {
        return scores.indexOf(item) == pos;
    });

    var sumOfScores = uniqueScores.reduce((a, b) => a + b, 0);
    return (sumOfScores / uniqueScores.length);
}


/**
 Run a query for the given search params..
 - parameter zipCode: `String` zip code.
 - parameter radius: `Int` search radius (miles).
 - parameter selectedCuisines: `String` comma-separated string of restaurant codes.
 */
function getLocation(zipCode, radius, selectedCuisines, numSelections=10) {
    var geocoder = new google.maps.Geocoder();
    // var restaurants;
    geocoder.geocode({
        'address': zipCode
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            // console.log("Latitude: " + latitude + "\nLongitude: " + longitude);

            //This is the "ajax" call to the Zomato server to fetch 5 restaurants serving x cuisine within 15+/- miles of the zip code requested.
            $.get(
                "https://developers.zomato.com/api/v2.1/search?count=10&sort=cost&order=asc&lat=" + latitude + "&lon=" +
                longitude + "&radius=" + radius + "&cuisines=" + selectedCuisines +
                "&apikey=5c1a7ed52d0f6e28f3b6a0cbadd9284b",
                function (data, status) {

                    // take response data | slice off the first result | map over the result & create function to stick the restuarant details object you are building into restaurants variable
                    // console.log(data.restaurants);
                    var restaurants = data.restaurants.slice(0, numSelections).map(function (restaurantInfo) {
                        var restaurantDetails = {};
                        // console.log(restaurantInfo.restaurant);
                        restaurantDetails.id = restaurantInfo.restaurant.id;
                        restaurantDetails.name = restaurantInfo.restaurant.name;
                        restaurantDetails.location = restaurantInfo.restaurant.location.address;
                        restaurantDetails.url = restaurantInfo.restaurant.url;

                        // parse the restaurant's cuisines
                        restaurantDetails.cuisines = getCuisinesFromRestaurantData(restaurantInfo.restaurant.cuisines);
                        restaurantDetails.romance = getRomanceFactorForRestaurant(restaurantDetails.cuisines);

                        // this returns your restaurantDetails object & stuffs it into restaurants variable
                        // console.log(restaurantDetails);
                        return restaurantDetails;

                    });

                    writeRestaurantToOutput(restaurants);
                    updateRestaurantInDateHistoryJsonObject(restaurants);
                });
        } else {
            console.log("Request failed.")
        }
    });
}
