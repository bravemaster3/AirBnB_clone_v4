$(document).ready(function () {
  //const selectedAmenities = [];
  let selectedAmenities2 = [];
  const selectedCitiesDict = {}
  const selectedStatesDict = {}
  const selectedAmenitiesDict = {};

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
        '</article>';
      $('.places').append(article);
    }
  }

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
      //selectedAmenities.push(amenityName);
      selectedAmenitiesDict[amenityID] = amenityName;
    } else {
      //const index = selectedAmenities.indexOf(amenityName);
      //if (index !== -1) {
      //  selectedAmenities.splice(index, 1);
      delete selectedAmenitiesDict[amenityID];
      //}
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
