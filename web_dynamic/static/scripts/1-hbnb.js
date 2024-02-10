#!/usr/bin/node
$(document).ready(function () {
    let checkboxes = document.querySelectorAll('.amenities input[type="checkbox"]');
    let amenities = {};
    function addRemoveAmenity(checkbox, amenities) {
        let amenityId = checkbox.getAttribute('data-id');
        let amenityName = checkbox.getAttribute('data-name');
        let exists = amenities[amenityId];
        if (checkbox.checked && exists === undefined) {
            amenities[amenityId] = amenityName;
        } else if (exists !== undefined) {
            delete amenities[amenityId];
        }
    }
    for (let checkbox of checkboxes) {
        checkbox.addEventListener('change', function () {
            addRemoveAmenity(checkbox, amenities);
            let myAmenities = Object.keys(amenities).map(function (key) {
                return amenities[key];
            }).join(', ');
            $('.amenities h4').text(myAmenities);
        })
    }
});
