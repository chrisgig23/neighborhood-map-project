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

// ko.components.register('yelp-widget', {
//   viewModel: function(params) {
//     console.log("yelpID: " + yelpID.value);
//     getYelpData(yelpID.value);
//
//     console.log(YelpInfo.yelpName);
//
//   },
//   template: '<div class="yelp-tray" data-bind="visible: YelpInfo.yelpName">\ </div>'
// });

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
  // console.log(yelpID());

  // Load Yelp data for bottom tray
  // getYelpData(yelpID);

  this.highlightMarker = function(clickedPlace) {
    var markerID = clickedPlace.placeId();
    // markers[markerID].makeMarkerIcon('2465c9');
  };

  this.defaultMarker = function(clickedPlace) {
    var markerID = clickedPlace.placeId();
    // markers[markerID].makeMarkerIcon('93a7c6');
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
    // var yelpID = ;
    // Load Yelp data for bottom tray
    // getYelpData(clickedPlace.yelpID());
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
      // self.placeList.forEach(function(placeItem) {
        // If the cuisine matches selected cuisine, push to filteredList array
        if (thisCuisine == cuisine) {
          self.filteredList.push(self.placeList()[i]);
        }
      }
    };

    if (map) {
      console.log(self.filteredList()[0].placeId() );
      filterMap(self.filteredList());
    }

  });
}

// function displayYelpTray(yelpData) {
//     console.log(yelpData);
//     this.yelpName = ko.observable(yelpData.name);
// }

var YelpInfo = function(data) {
  // console.log(data);
  this.yelpName = ko.observable(data.name);
  this.rating = ko.observable(data.rating);
  this.address = ko.observable(data.location.address1);
  this.phone = ko.observable(data.phone);
  // this.hours = ko.observableArray([]);
  this.imgSrc = ko.observable(data.image_url);
  console.log(this.yelpName());
  console.log(this.rating());
  console.log(this.address());
  console.log(this.phone());
  // console.log(this.hours());
  console.log(this.imgSrc());
}



function filterMap(list) {
  // for (var i=0; i<list.length; i++) {
  //   console.log("Name:"+ list[i].name() );
  //   console.log(list[i].location() );
  //   console.log(list[i].placeId() )
  // }

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

// ----------------------------------------------------------
// Google Maps API
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
      success: {
        contentString = '<div>' + response.name + '<div>' + response.location.address1;
      }

      infoWindow.setContent(contentString);

      // statusCode: {
      //   404: function() {
        //     console.log("ERROR - Restaurant Not Found");
      //   }
      // };
      // }
      // self.yelpData.push(response);

    });

    infoWindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed
    infoWindow.addListener('closeclick', function() {
      infoWindow.setMarker = null;
    });
  };
}

// // Access Yelp API
// function getYelpData(yelpID) {
//   var settings = {
//     "async": true,
//     "crossDomain": true,
//     // Pass in the Yelp business ID for the clicked restaurant
//     "url": "https://api.yelp.com/v3/businesses/" + yelpID,
//     "method": "GET",
//     "headers": {
//       "Authorization": "Bearer nOpnNpO7xDeJt_YSypp1XJnL5__h4-i7QTvUYi7RS5VwFuk6ID4Q8IrbM5epxCFpQENG1Q7gy-NWeR8NefBLBo-ZK8x8-0ck3cfQ9mkvTzBDKxBvGIXzrtjO3bcWW3Yx",
//       "Cache-Control": "no-cache",
//       "Postman-Token": "dec353d8-ca31-7d0e-a03d-65c6381c0574"
//     },
//     "data": "{\"username\":\"Chris\", \"password\":\"Udacity\"}"
//   }
//
//   // console.log(settings.url);
//
//   $.ajax(settings).done(function (response) {
//     console.log(response);
//
//     return(response);
//
//     // return response;
//     // console.log("ERROR - Restaurant Not Found")
//
//   });
// }

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

  document.getElementById('show-restaurants').addEventListener('click', showRestaurants);
  document.getElementById('hide-restaurants').addEventListener('click', hideRestaurants);

  // Allow Enter key to submit text entry.
  document.getElementById('zoom-to-area-text').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is Enter key
      zoomToArea();
    }
  });

  // document.getElementById('cuisine-type').addEventListener('change', function() {
  //   // Update map to reflect filtered restaurants
  //   console.log(ViewModel().filteredList);
  //   filterMap( ViewModel().filteredList );
  // });
  document.getElementById('zoom-to-area').addEventListener('click', function() {
    zoomToArea();
  });
}

ko.applyBindings(new ViewModel(map));
