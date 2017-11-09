#dnd-cuisine-menu - restaurant cuisine menu
#dnd-genre-menu - movie genre menu
#dnd-btn-search - search button
#dnd-input-zipcode - zip code input
#dnd-input-date - date input

#dnd-result-tabs - tab bar for search results
#dnd-results-table - table for search results
#dnd-user-results-tbody - table result




```
// https://foundation.zurb.com/sites/docs/abide.html
// pattern="/([0-9]*)[:]([0-5][0-9])/"
// Set paramaters
Foundation.Abide.defaults.patterns['dashes_only'] = /^[0-9-]*$/;
Foundation.Abide.defaults.validators['greater_than'] =

// Init Foundation
$(document).foundation();

function($el,required,parent) {
  // parameter 1 is jQuery selector
  if (!required) return true;
  var from = $('#'+$el.attr('data-greater-than')).val(),
      to = $el.val();
  return (parseInt(to) > parseInt(from));
};
```
