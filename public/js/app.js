var map;
var service;
var infowindow;
function getLocation(onSuccess) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function makeQueryFor(location, query) {
  var currentLatLng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

  map = new google.maps.Map(document.getElementById('map'), {
      center: currentLatLng,
      zoom: 15
    });

  var request = {
    location: currentLatLng,
    radius: '3000',
    openNow: true,
    query: query
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    restaurants = [];
    var $placelist = $('#placelist');
    $placelist.empty();
    for (var i = 0; i < results.length; i++) {
      restaurants.push(results[i]);
      $placelist.append(
        $('<li></li>').
          attr('class', 'place').
          append(
            $('<p></p>').html(
              '<i class="glyphicon glyphicon-cutlery"></i> ' + results[i].name
            )
          )
      );
    }
    drawRouletteWheel();
    setTimeout(function() { spin(wheel); }, 500);
  }
}

var currentLoc;
var restaurants = [];
getLocation(function(location) {
  currentLoc = location;
});

function onNewQuery() {
  var queryField = document.querySelector('[name="q"]');
  makeQueryFor(currentLoc, queryField.value);
}