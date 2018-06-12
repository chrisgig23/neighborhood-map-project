var Restaurant = function(data) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.rating = ko.observable(data.rating);
  this.placeId = ko.observable(data.id);
  // this.imgSrc = ko.observable(data.name);
  this.yelpID = ko.observable(data.yelpID);


}


var myRestaurants = [
  {
    name: "Aunt Butchie's of Brooklyn", location: {lat: 40.523841, lng: -74.238527}, rating: 5, id: 0, yelpID: "HBcmdviQgkWO4bqgxAjtNw"
  }, {
    name: "Campania Coal Fired Pizzeria", location: {lat: 40.543107, lng: -74.163835}, rating: 4, id: 1, yelpID: "JIhIWha-3zOBKyoOzGq0TA"
  }, {
    name: "Capizzi", location: {lat: 40.538925, lng: -74.148333}, rating: 4, id:2, yelpID: "mSFyMRKDLF8DOwOEhV35ow"
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

  myRestaurants.forEach(function(placeItem){
    self.placeList.push( new Restaurant(placeItem) );
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
    for (var i=0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

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
    getYelpData(clickedPlace.yelpID());
  };
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


// Access Yelp API
function getYelpData(yelpID) {
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

  console.log(settings.url);

  $.ajax(settings).done(function (response) {
    console.log(response);

    YelpInfo(response);

    // return response;
    // console.log("ERROR - Restaurant Not Found")

  });
}

// ----------------------------------------------------------
// Google Maps API
var map;

// A blank array to contain all the markers for our restaurants
var markers = [];

function initMap() {
  // Styles array to use with the map -- Style WY from Snazzy Maps
  var styles = [
    {
      "featureType": "all",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "weight": "2.00"
          }
      ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7b7b7b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c8d7d4"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  }
  ];

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.586074, lng: -74.156711},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  // These are a list of my favorite restaurants
  // var locations = [
  //     {
  //     //   title: "Aunt Butchie's of Brooklyn", location: {lat: , lng: }
  //     // }, {
  //       title: "Campania Coal Fired Pizzeria", location: {lat: 40.585578, lng: -74.162485}
  //     }, {
  //       title: 'Home', location: {lat: 40.585578, lng: -74.162485}
  //     }, {
  //       title: 'Home', location: {lat: 40.585578, lng: -74.162485}
  //     },
  // ];

  var largeInfoWindow = new google.maps.InfoWindow();
  // Bounds of the map

  var defaultIcon = makeMarkerIcon('93a7c6');

  var highlightedIcon = makeMarkerIcon('2465c9');

  function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
      new google.maps.Size(21,34),
      new google.maps.Point(0,0),
      new google.maps.Point(10,34),
      new google.maps.Size(21,34),
      );
      return markerImage;
  }

  for (var i=0; i<myRestaurants.length; i++) {
    // Get the position from locations array
    var position = myRestaurants[i].location;
    var title = myRestaurants[i].name;
    var marker = new google.maps.Marker({
      // map:map,
      position:position,
      title:title,
      icon: defaultIcon,
      animation: google.maps.Animation.DROP,
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


  document.getElementById('show-restaurants').addEventListener('click', showRestaurants);
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

  function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div>' + marker.title + '<div>');
      infoWindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed
      infoWindow.addListener('closeclick', function() {
        infoWindow.setMarker = null;
      });

    };
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

  // This function hides our restaurant markers when the
  // Hide Restaurants button is clicked
  function hideRestaurants() {
    for (var i=0; i < markers.length; i++) {
      markers[i].setMap(null);
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
}

ko.applyBindings(new ViewModel(map));
