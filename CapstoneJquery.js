// Google Maps API key AIzaSyD__zNryK3aQH46g_4ArIrk4zYdhHr7pAo 
//https://schoolgrades.georgia.gov/api/action/datastore/search.json?resource_id=34a95003-f3fb-4dce-af6c-8f69b18617db&limit=5"

//geolocation reference https://stackoverflow.com/questions/22603220/uncaught-invalidvalueerror-not-a-feature-or-featurecollection
//Working with google refernce https://developers.google.com/maps/documentation/javascript/combining-data#loading-the-state-boundary-polygons
var map;
var geocoder;
var address="4440 fairfax drive cumming GA";
$(document).ready(function(){
    initMap();
    codeAddress();
});
//intializes google maps and the geocoder
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:  33.753746, lng: -84.9001},
    zoom: 8
    });
    loadMapShapes();
}
//This function takes in an address and creates a marker on the map of it, Look into adding details to the makers. It should bring up the school when you click it
function codeAddress() {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}
// load US state outline polygons from a GeoJSON file
function loadMapShapes() {
        map.data.loadGeoJson("shape.geojson");
}

//This was just a test to see if I could get anything from the georgia grades API
$GetDistrictList = function(){
    console.log("so far so good");
    $.getJSON("https://data.georgia.gov/api/action/datastore/search.json?resource_id=fb961222-b9dc-48d5-936f-2ecf86882b7d&limit=5", function(response){        
    console.log(response);
    }).catch(function(error){
        console.log('Request Failed', error)
    });
}
