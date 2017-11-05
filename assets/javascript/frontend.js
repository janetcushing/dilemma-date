

// Return currently selected restaurant cuisines
function getSelectedCuisines() {
    var selected = [];
    $('select#dnd-cuisine-menu').find('option:selected').each(function() {
        selected.push($(this).text());
    });
    return selected;
}

// Return currently selected movie genres
function getSelectedGenres() {
    var selected = [];
    $('select#dnd-genre-menu').find('option:selected').each(function() {
        selected.push($(this).text());
    });
    return selected;
}

// page load
$(document).ready(function() {

    // supress default form action
    $('.btn').on('click', function(event) {
        event.preventDefault();
    });

    // search button clicked
    $('body').on('click', '#dnd-btn-search', function() {

        var numMovies = 1;
        var radius = 20;
        var date = $('#dnd-input-date').val();
        // IMPORTANT: the date must be within 6 days from current day, else returns an error.
        console.log(date);

        let zipCode = $('#dnd-input-zipcode').val().trim();
        var date = $('#dnd-input-date').val().trim();
        // let userSelectedData = Date($('#dnd-input-date').val().trim());

        getMovies(numMovies, zipCode, radius, date, function (moviesInfo) {
            console.log(moviesInfo);
        });

     

        let selectedCuisines = getSelectedCuisines();
        let selectedGenres = getSelectedGenres();

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);
    });
});
