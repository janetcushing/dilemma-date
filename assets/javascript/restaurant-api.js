//Thre script tag below needs to be in the html to make the conversion from zip code to lat/long coordinates
//<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyApxgL2mMoiMcWrEvui6tLwqs6zD6T_E7Y"></script>

var restaurants = {};

/**
 Run a query for the given search params..
 - parameter zipCode: `String` zip code.
 - parameter radius: `Int` search radius (miles).
 - parameter selectedCuisines: `String` comma-separated string of restaurant codes.
 */
function getLocation(zipCode, radius, selectedCuisines) {
    var geocoder = new google.maps.Geocoder();
    // var restaurants;
    geocoder.geocode({
        // 'address': address
        'address': zipCode
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            console.log("Latitude: " + latitude + "\nLongitude: " + longitude);

            //This is the "ajax" call to the Zomato server to fetch 5 restaurants serving x cuisine within 15+/- miles of the zip code requested.
            $.get(
                "https://developers.zomato.com/api/v2.1/search?count=5&sort=cost&order=asc&lat=" + latitude + "&lon=" +
                longitude +
                "&radius=25000&cuisines=" + selectedCuisines +
                // "&radius=" + radius +
                // "&cuisines=" + selectedCuisines +
                "&apikey=5c1a7ed52d0f6e28f3b6a0cbadd9284b",
                function (data, status) {

                    // take response data | slice off the first result | map over the result & create function to stick the restuarant details object you are building into restaurants variable

                    var restaurants = data.restaurants.slice(0, 1).map(function (restaurantInfo) {
                        var restaurantDetails = {};
                        restaurantDetails.name = restaurantInfo.restaurant.name;
                        restaurantDetails.location = restaurantInfo.restaurant.location.address;
                        restaurantDetails.url = restaurantInfo.restaurant.url;

                        console.log(JSON.stringify(restaurantDetails));
                        // this returns your restaurantDetails object & stuffs it into restaurants variable
                        return restaurantDetails;
                    });
                    console.log("restaurants inside getRestaurant: " + JSON.stringify(restaurants));
                    writeRestaurantToOutput(restaurants);
                    updateRestaurantInDateHistoryJsonObject(restaurants);
                    console.log("updating restaurant in json object " + JSON.stringify(dateHistoryData));
                });
        } else {
            console.log("Request failed.")
        }
    });
}
