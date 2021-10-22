// Google Maps API key AIzaSyD__zNryK3aQH46g_4ArIrk4zYdhHr7pAo 
//https://schoolgrades.georgia.gov/api/action/datastore/search.json?resource_id=34a95003-f3fb-4dce-af6c-8f69b18617db&limit=5"

//geolocation reference https://stackoverflow.com/questions/22603220/uncaught-invalidvalueerror-not-a-feature-or-featurecollection
//Working with google refernce https://developers.google.com/maps/documentation/javascript/combining-data#loading-the-state-boundary-polygons
//use https://api.jquery.com/jquery.grep/ to search the object arrays https://stackoverflow.com/questions/6930350/easiest-way-to-search-a-javascript-object-list-with-jquery
var map; //google maps
var geocoder;
var address="4440 fairfax drive cumming GA";
var schoolArray;  //all of the school data 
var districtArray;  //all of the district data
var searchArray; //the array that we get from the search
var searchTxt; //the var where the text that is being searched it placed
var districtList; //an array of the district names

$(document).ready(function(){
    initMap();
    codeAddress();
    arrayToObjects();
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

//retireves all of the school and district data and puts it in their var
function arrayToObjects(){
	$.ajax({
	  type: "GET",  
	  url: "school-19.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		schoolArray = $.csv.toObjects(response);
		console.log(schoolArray);
	  }   
	});
  $.ajax({
	  type: "GET",  
	  url: "district-19.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		districtArray = $.csv.toObjects(response);
		console.log(districtArray);
	  }   
	});
}
//takes all of the districts names and adds them to the options
function DistrictOptions(){

}
//basic search with no filters
function Search(){}
//search with district 
function districtSearch(){}
//search with grade level
function gradeSearch(){}
//search with private/charter
function privateSearch(){}
//search with district & grade level
function districtGradeSearch(){}
//search with district & private/charter
function districtPrivateSearch(){}
//search with private/charter & grade level
function privateGradeSearch(){}
//search with district & private/charter & grade level
function districtPrivateGradeSearch(){}
//This take the school selected and put all of the details onto the page.
function schoolDetails(){}


