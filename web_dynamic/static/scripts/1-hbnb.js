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
});
