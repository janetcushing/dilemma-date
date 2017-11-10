var restaurantOutputHTML =
'<tr>' +
'<td class="shrink">' + time + '</td>' +
'<td class="expand">' +
'<i class="fa fa-cutlery" aria-hidden="true"></i>' +
'<span class="dnd-date-detail-title">  ' + restaurant.name + '</span>' +
'<p class="dnd-date-detail-desc">' + restaurant.address + '</p>' +
'</td><td class="shrink">Seafood</td>' +
'<td class="shrink" id="insert-romance"></td>' +
'<td class="shrink"><a href="' + restaurant.url + '">Link</a></td>' +
'</tr>'


var movieOutputHTML =
'<tr>' +
'<td class="shrink">' + movie.times[0] + '</td>' +
'<td class="expand">' +
'<i class="fa fa-film" aria-hidden="true"></i>' +
'<span class="dnd-date-detail-title">  ' + movie.title + '</span>' +
'<p class="dnd-date-detail-desc">' + movie.theatre + '</p>' +
'</td><td class="shrink">' + movie.genre + '</td>' +
'<td class="shrink" id="insert-romance"></td>' +
'<td class="shrink"><a href="' + movie.ticketURI + '">Link</a></td>' +
'</tr>'
