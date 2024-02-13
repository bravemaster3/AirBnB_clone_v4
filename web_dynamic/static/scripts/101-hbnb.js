$(document).ready(function () {
  //const selectedAmenities = [];
  let selectedAmenities2 = [];
  const selectedCitiesDict = {}
  const selectedStatesDict = {}
  const selectedAmenitiesDict = {};
  let userDict = {};


  // Function to update the locations list
  function updateLocationsList() {
    selectedLocations = Object.values(selectedStatesDict).concat(Object.values(selectedCitiesDict))
    $('.locations h4').text('Selected Locations: ' + selectedLocations.join(', '));
  }
  function updateAmenitiesList() {
    selectedAmenities2 = Object.values(selectedAmenitiesDict)
    $('.amenities h4').text('Selected Amenities: ' + selectedAmenities2.join(', '));
  }
  // Function to render places based on data
  function renderPlaces(data) {
    $('.places').empty();
    for (const place of data) {
      const article =
        '<article>' +
        '<div class="title_box">' +
        '<h2>' + place.name + '</h2>' +
        '<div class="price_by_night">$' + place.price_by_night + '</div>' +
        '</div>' +
        '<div class="information">' +
        '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>' +
        '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>' +
        '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>' +
        '</div>' +
        '<div class="description">' + place.description + '</div>' +
        '<br />' +
        '<div class="reviews">' +
        '<h2 class=reviews><span class="reviewCount" id="' +place.id +'"> 0 </span>Reviews</h2>' +
        '<span id="'+place.id + '"class="toggleReviews">show</span>' +
        '</div>' +
        '<span class="reviewContent" id="' + place.id +'"></span>'+
        '</article>';
        renderReviews(place)
      $('.places').append(article);
    }
  }
// Render reviews

// Function to render reviews
function renderReviews(place) {
  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews/',
    success: function (reviews) {
      $('.places.reviews').empty();
      let $contentSpan = $('span.reviewContent#' + place.id);
      let $toggleSpan = $('span.toggleReviews#' + place.id);
      console.log(reviews);

      if ($contentSpan.attr('id')) {
        // Call the fetchUsers function and wait for it to complete using promises
          for (const review of reviews) {
            reviewDate = formatDate(review.created_at)
            $('span.reviewCount#' + place.id).text(reviews.length + ' ');
            $contentSpan.append('<h3>' + userDict[review.user_id].first_name + ' ' + userDict[review.user_id].last_name + ' ' + reviewDate[0] + '\t\t' + reviewDate[1] + '</h3><p class="reviewText">' + review.text + '</p>');
            $contentSpan.hide();
          }
      }
      $toggleSpan.click(function () {
        if ($contentSpan) {
          $contentSpan.toggle('slow');
          if ($toggleSpan.text() === 'hide') {
            $toggleSpan.text('show');
          } else {
            $toggleSpan.text('hide');
          }
        }
      });
    }
  });
}

// Function to fetch users and return a promise
$.ajax({
  type: 'GET',
  url: 'http://0.0.0.0:5001/api/v1/users/',
  success: function (users) {
    $(users).each(function (index, user) {
      userDict[user.id] = user;
    });
  }
});



  // Initial GET request to fetch all places
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      renderPlaces(data);
    }
  });

  // Checkbox change event handling
  $('.locations ul li input[type="checkbox"]').change(function () {

    const ID = $(this).data('id');
    const name = $(this).data('name');

    if ($(this).is(':checked')) {
      if ($(this).data('type')==="state"){
        selectedStatesDict[ID] = name;
      } else {
        selectedCitiesDict[ID] = name
      }
    } else {
      if ($(this).data('type')==="state"){
        delete selectedStatesDict[ID];
      } else {
        delete selectedCitiesDict[ID];
      }
    }

    updateLocationsList();
  });

  // Checkbox change event handling
  $('.amenities ul li input[type="checkbox"]').change(function () {
    const amenityID = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      selectedAmenitiesDict[amenityID] = amenityName;
    } else {
      delete selectedAmenitiesDict[amenityID];
    }

    updateAmenitiesList();
  });

  // Button click event handling
  $('.filters button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(selectedAmenitiesDict),
                            states: Object.keys(selectedStatesDict),
                          cities: Object.keys(selectedCitiesDict)}),
      success: function (data) {
        renderPlaces(data);
      }
    });
  });

  // API status check
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});

//format date:
const formatDate = (inputDate) => {
  const dateObj = new Date(inputDate);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return [`${day}${nthNumber(day)} ${month} ${year}`, formattedTime];
};
