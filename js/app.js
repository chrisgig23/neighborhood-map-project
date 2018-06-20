var Restaurant = function(data) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.cuisine = ko.observable(data.cuisine);
  this.placeId = ko.observable(data.id);
  // this.imgSrc = ko.observable(data.name);
  this.yelpID = ko.observable(data.yelpID);
}

var myRestaurants = [
  {
    name: "Aunt Butchie's of Brooklyn", location: {lat: 40.523841, lng: -74.238527}, cuisine: 'Italian', id: 0, yelpID: "HBcmdviQgkWO4bqgxAjtNw"
  }, {
    name: "Campania Coal Fired Pizzeria", location: {lat: 40.543107, lng: -74.163835}, cuisine: 'Pizza', id: 1, yelpID: "JIhIWha-3zOBKyoOzGq0TA"
  }, {
    name: "Capizzi", location: {lat: 40.538925, lng: -74.148333}, cuisine: 'Italian', id:2, yelpID: "mSFyMRKDLF8DOwOEhV35ow"
  }, {
    name: "Genki Sushi", location: {lat: 40.55278344473, lng: -74.193325368046}, cuisine: 'Sushi', id:3, yelpID: "6xFL5H9cVU2sAmEHZVI0gw"
  }, {
    name: "Project Brunch", location: {lat: 40.6298312, lng: -74.1096512}, cuisine: 'Brunch', id:4, yelpID: "ZNAOPaNS6U3h_LgRF7Eu_A"
  }
];

var ViewModel = function() {
  var self = this;

  this.placeList = ko.observableArray([]);
  this.filteredList = ko.observableArray([]);
  this.availableCuisines = ko.observableArray([]);
  this.selectedCuisine = ko.observable();

  myRestaurants.forEach(function(placeItem){
    self.placeList.push( new Restaurant(placeItem) );
    self.filteredList.push( new Restaurant(placeItem) );

    // If restaurant's cuisine is not already in cuisine list, add it for filtering
    if (self.availableCuisines.indexOf(placeItem.cuisine) == -1) {
      self.availableCuisines.push( placeItem.cuisine );
    };
  });
   this.currentPlace = ko.observable( this.placeList()[0] );

  var yelpID = this.placeList()[0].yelpID;

  this.highlightMarker = function(clickedPlace) {
    var markerID = clickedPlace.placeId();
    // markers[markerID].makeMarkerIcon('2465c9');
  };

  this.defaultMarker = function(clickedPlace) {
    var markerID = clickedPlace.placeId();
  }

  // When list item is clicked, update map
  this.setPlace = function(clickedPlace) {
    self.currentPlace(clickedPlace);
// Maybe separate the below into function

    // Retrieve the place ID from the DOM element
    var markerID = clickedPlace.placeId();
    // Trigger click event on Marker for this list item
    google.maps.event.trigger(markers[markerID], 'click');

    // Hide all markers on map
    hideRestaurants();

    // Center map and zoom over restaurant marker
    map.setCenter(clickedPlace.location());
    map.setZoom(15);
    // If markers are hidden, make visible for clicked restaurant
    if (markers[markerID].map != map) {
      markers[markerID].setMap(map);
      markers[markerID].setAnimation(google.maps.Animation.DROP);
    }
  };

  self.filterBy = ko.computed(function() {
    var cuisine = self.selectedCuisine();

    if (!cuisine) { // Show all
      // Clear filteredList array
      self.filteredList.removeAll();
      // Iterate through original array and push all back to filtered
      for (var i=0;i<self.placeList().length; i++) {
        self.filteredList.push(self.placeList()[i]);
      }
    } else { // Filtered by cuisine
      // Clear filteredList array
      self.filteredList.removeAll();
      // Iterate through original array
      for (var i=0;i<self.placeList().length; i++) {
        var thisCuisine = self.placeList()[i].cuisine();
        // If the cuisine matches selected cuisine, push to filteredList array
        if (thisCuisine == cuisine) {
          self.filteredList.push(self.placeList()[i]);
        }
      }
    };

    if (map) {
      filterMap(self.filteredList());
    }

  });
}

function filterMap(list) {
  var bounds = new google.maps.LatLngBounds();

  // Hide all markers on map
  hideRestaurants();

  // Extend the bounds of the map to include any new markers
  for (var i=0; i < list.length; i++) {
    markers[ list[i].placeId() ].setMap(map);
    markers[list[i].placeId()].setAnimation(google.maps.Animation.DROP);
    bounds.extend(markers[list[i].placeId()].position);
  }

  map.fitBounds(bounds);
}

var map;

// A blank array to contain all the markers for our restaurants
var markers = [];

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
  new google.maps.Size(21,34),
  new google.maps.Point(0,0),
  new google.maps.Point(10,34),
  new google.maps.Size(21,34),
  );
  return markerImage;
}

// When an area is searched, any markers located within the bounds of the map will be displayed.
function searchWithinBounds() {
  // Loop through markers array, and save the location of the markers position
  for (var i = 0; i<markers.length; i++) {
    var point = new google.maps.LatLng(parseFloat(markers[i].position.lat()), parseFloat(markers[i].position.lng()));
    var myBounds = map.getBounds();

    // Check if markers position falls within current bounds of the map, and display marker if yes.
    if (myBounds.contains(point)) {
      markers[i].setMap(map);
    } else {
      markers[i].setMap(null);
    }
  }
}

// This function takes the input value, locates it,
// and centers our map on that area.
function zoomToArea() {
  // Initialize the geocoder
  var geocoder = new google.maps.Geocoder();
  // Retrieve the address or place that the user entered
  var address = document.getElementById('zoom-to-area-text').value;
  // Check for blank address value
  if (address == '') {
    window.alert('You must enter an area, or address.');
  } else {
    // Geocode the address/area entered to get the center. Then center the map on it and zoom in.
    geocoder.geocode(
      { address:address,
        componentRestrictions: {locality: 'New York'}
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
          hideRestaurants();
          searchWithinBounds();
        } else {
          window.alert('We could not find that location - try entering a more specific place.');
        }
      }
    )
  }
}

// This function hides our restaurant markers when the
// Hide Restaurants button is clicked
function hideRestaurants() {
  for (var i=0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// This function shows our restaurant markers when the
// Show Restaurants button is clicked
function showRestaurants() {
  var bounds = new google.maps.LatLngBounds();

  // Extend the bounds of the map to include any new markers
  for (var i=0; i < markers.length; i++) {
    if (markers[i].map != map) {
      markers[i].setMap(map);
      markers[i].setAnimation(google.maps.Animation.DROP);
    }
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

function populateInfoWindow(marker, infoWindow) {
  var self = this

  self.yelpData = ko.observableArray([]);
  var contentString = '';
  var yelpLogoImgSrc = '/assets/Yelp_logo.png';
  var yelpID = marker.yelpID;
  if (infoWindow.marker != marker) {
    infoWindow.marker = marker;

    var settings = {
      "async": true,
      "crossDomain": true,
      // Pass in the Yelp business ID for the clicked restaurant
      "url": "https://api.yelp.com/v3/businesses/" + yelpID,
      "method": "GET",
      "headers": {
        "Authorization": "Bearer nOpnNpO7xDeJt_YSypp1XJnL5__h4-i7QTvUYi7RS5VwFuk6ID4Q8IrbM5epxCFpQENG1Q7gy-NWeR8NefBLBo-ZK8x8-0ck3cfQ9mkvTzBDKxBvGIXzrtjO3bcWW3Yx",
        "Cache-Control": "no-cache",
        "Postman-Token": "dec353d8-ca31-7d0e-a03d-65c6381c0574"
      },
      "data": "{\"username\":\"Chris\", \"password\":\"Udacity\"}"
    }

    $.ajax(settings).done(function (response) {
      // console.log(response);
      var starCountImg = yelpStarGenerator(response.rating);
      var phoneNumber = formatPhone(response.phone);
      var todaysHours = '';

      // returns formatted hours string
      todaysHours = hoursCalc(response.hours[0]);

      contentString = (
        '<div class="info-window-resInfo">' +
          '<div class="restaurant-image">' +
            '<img src="' + response.image_url + '" alt="restaurant image"' +
          '</div>' +
          '<div class="restaurant-info"' +
            '<p id="yelp-name">' +
              response.name +
            '</p>' +
            '<p id="yelp-address">' +
              response.location.address1 +
            '</p>' +
            '<a href="tel: ' + response.phone + '">' +
              phoneNumber +
            '</a> ' +
          '</div>' +
          '<div class="yelp-star-icons">' +
            '<a target="_blank" href="' + response.url + '"><img src="' + starCountImg + '" alt="yelp stars">' +
            '<p>Read more</p></a>' +
          '</div>' +
          '<div class="todays-hours">' +
            '<p>' + todaysHours + '</p>' +
          '</div>' +
          '<div class="powered-by">' +
            '<p>Powered by </p><img id="yelp-logo" src="' + yelpLogoImgSrc + '" alt="yelp logo">' +
          '</div>' +
        '</div>'
      );

      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);

    }).fail(function (xhr) {
      if (xhr.status == 404) {
        console.log("ERROR - Restaurant Not Found");
        infoWindow.setContent('<p>Restaurant Info Not Found</p>');
        infoWindow.open(map, marker);
      }
    });

    // Make sure the marker property is cleared if the infowindow is closed
    infoWindow.addListener('closeclick', function() {
      infoWindow.setMarker = null;
    });
  };
}

// Function takes in raw phone number, and formats it to user-friendly output
function formatPhone(phone) {
  var areacode = phone.slice(2,5);
  var prefix = phone.slice(5,8);
  var lineNumber = phone.slice(8);

  phone = "(" + areacode + ") " + prefix + "-" + lineNumber;

  return phone
}

// Function takes in hours array from Yelp API and converts it into formatted string
// Possible return values are the current hours (if open), current hours with Closed now if opening at some point today, and 'Closed today' if closed all day.
function hoursCalc(hours) {
  // Yelp's week starts with Monday at index 0, while javascript's Date function starts with Sunday at index 0.
  var today = new Date();
  today = today.getDay();
  if (today == 0) { // Sunday
    today = 6; // Yelp's Sunday
  } else { // Every other day
    today--; // Convert today to Yelp time
  }

  var isOpen = hours.is_open_now;
  var openHours = hours.open;

  var openDays = [];
  for (var i=0; i<openHours.length; i++) {
    openDays.push(openHours[i].day);
  }

  var openToday = openHours[today].start;
  openToday = formatTime(openToday);
  var closeToday = openHours[today].end;
  closeToday = formatTime(closeToday);
  var todaysHours = openToday + " - " + closeToday
  if (openDays.includes(today)) {
    if (isOpen) {
      return todaysHours;
    } else {
      return todaysHours + " (Closed now)";
    }
  } else {
    return "Closed today";
  }
}

// Function takes in military time, and converts to 12 hour clock with AM/PM
function formatTime(time) {
  var hours = time.slice(0,2);
  var minutes = time.slice(2,4);
  var ampm = '';

  if (hours>12) {
    ampm = 'pm';
    hours = hours - 12;
  } else {
    hours = hours - 0;
    ampm = 'am';
  }

  return (hours + ':' + minutes + ampm);
}

function yelpStarGenerator (starCount){
  var imgSrc = '/assets/yelp_stars/web_and_ios/small/';
  switch (starCount) {
    case 0:
      imgSrc = imgSrc + '0stars.png';
      break;
    case 1:
      imgSrc = imgSrc + '1stars.png';
      break;
    case 1.5:
      imgSrc = imgSrc + '1halfstars.png';
      break;
    case 2:
      imgSrc = imgSrc + '2stars.png';
      break;
    case 2.5:
      imgSrc = imgSrc + '2halfstars.png';
      break;
    case 3:
      imgSrc = imgSrc + '3stars.png';
      break;
    case 3.5:
      imgSrc = imgSrc + '3halfstars.png';
      break;
    case 4:
      imgSrc = imgSrc + '4stars.png';
      break;
    case 4.5:
      imgSrc = imgSrc + '4halfstars.png';
      break;
    case 5:
      imgSrc = imgSrc + '5stars.png';
      break;
  }

  return imgSrc;
}

function initMap() {
  // Styles array to use with the map -- Style WY from Snazzy Maps
  var styles = [
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e0efef"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#1900ff"
                },
                {
                    "color": "#c0e8e8"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": 700
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#7dcdcd"
                }
            ]
        }
    ];

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.586074, lng: -74.156711},
    zoom: 13,
    styles: styles,
    mapTypeControl: false,
    maxZoom: 15
  });

  var largeInfoWindow = new google.maps.InfoWindow();
  // Bounds of the map

  var defaultIcon = makeMarkerIcon('93a7c6');

  var highlightedIcon = makeMarkerIcon('2465c9');

  for (var i=0; i<myRestaurants.length; i++) {
    // Get the position from locations array
    var position = myRestaurants[i].location;
    var title = myRestaurants[i].name;
    var yelpID = myRestaurants[i].yelpID;
    var marker = new google.maps.Marker({
      // map:map,
      position:position,
      title:title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
      yelpID: yelpID,
      id: i
    });

    // Push the marker to array of markers
    markers.push(marker);
    // Creates an onclick event to show the infoWindow for each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  showRestaurants(); // Display markers by default

  document.getElementById('show-restaurants').addEventListener('click', function() {
    showRestaurants();
    largeInfoWindow.close();
  });
  document.getElementById('hide-restaurants').addEventListener('click', hideRestaurants);

  // Allow Enter key to submit text entry.
  document.getElementById('zoom-to-area-text').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is Enter key
      zoomToArea();
    }
  });

  document.getElementById('zoom-to-area').addEventListener('click', function() {
    zoomToArea();
  });
}

ko.applyBindings(new ViewModel(map));
