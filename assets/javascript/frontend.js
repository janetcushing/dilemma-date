

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

        let userZipCode = $('#dnd-input-zipcode').val().trim();
        let userSelectedData = Date($('#dnd-input-date').val().trim());

        let selectedCuisines = getSelectedCuisines();
        let selectedGenres = getSelectedGenres();

        console.log('# cuisines: ' + selectedCuisines);
        console.log('# genres:   ' + selectedGenres);
    });
});