#!/usr/bin/node
$(document).ready(function () {
  const checkboxes = document.querySelectorAll('.amenities input[type="checkbox"]');
  const amenities = {};
  function addRemoveAmenity (checkbox, amenities) {
    const amenityId = checkbox.getAttribute('data-id');
    const amenityName = checkbox.getAttribute('data-name');
    const exists = amenities[amenityId];
    if (checkbox.checked && exists === undefined) {
      amenities[amenityId] = amenityName;
    } else if (exists !== undefined) {
      delete amenities[amenityId];
    }
  }
  for (const checkbox of checkboxes) {
    checkbox.addEventListener('change', function () {
      addRemoveAmenity(checkbox, amenities);
      const myAmenities = Object.keys(amenities).map(function (key) {
        return amenities[key];
      }).join(', ');
      $('.amenities h4').text(myAmenities);
    });
  }
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
  $.post({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data, textStatus) {
      for (const place of data) {
        // Create an article tag as a variable
        const article = $('<article>');
        // Create each component of the article tag as variable, and append later to the article

        const titleBox = $('<div>').addClass('title_box');
        $('<h2>').text(place.name).appendTo(titleBox);
        $('<div>').addClass('price_by_night').text('$' + place.price_by_night).appendTo(titleBox);

        const infoBox = $('<div>').addClass('information');
        const pluralGuest = place.max_guest > 1 ? ' Guests' : ' Guest';
        $('<div>').addClass('max_guest').text(place.max_guest + pluralGuest).appendTo(infoBox);
        const pluralRooms = place.number_rooms > 1 ? ' Bedrooms' : ' Bedroom';
        $('<div>').addClass('number_rooms').text(place.number_rooms + pluralRooms).appendTo(infoBox);
        const pluralBaths = place.number_bathrooms > 1 ? ' Bathrooms' : ' Bathroom';
        $('<div>').addClass('number_bathrooms').text(place.number_bathrooms + pluralBaths).appendTo(infoBox);

        // const user = $('<div>').addClass('user');
        // $('<b>Owner:</b>' + place.user.first_name + ' ' + place.user.last_name).appendTo(user);
        const description = $('<div>').addClass('description').html(place.description);
        // Append all elements to article
        article.append(titleBox, infoBox, description); // Add user if uncommented up. For now, as said in the task, we don't include the owner
        // Append article to places
        $('.places').append(article);
      }
    }
  });
});
