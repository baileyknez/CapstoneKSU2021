// Google Maps API key AIzaSyD__zNryK3aQH46g_4ArIrk4zYdhHr7pAo 
//https://schoolgrades.georgia.gov/api/action/datastore/search.json?resource_id=34a95003-f3fb-4dce-af6c-8f69b18617db&limit=5"

//geolocation reference https://stackoverflow.com/questions/22603220/uncaught-invalidvalueerror-not-a-feature-or-featurecollection
//Working with google refernce https://developers.google.com/maps/documentation/javascript/combining-data#loading-the-state-boundary-polygons
//use https://api.jquery.com/jquery.grep/ to search the object arrays https://stackoverflow.com/questions/6930350/easiest-way-to-search-a-javascript-object-list-with-jquery
var map; //google maps
var geocoder;
var schoolArray =[];//all of the school data 
var districtArray =[];  //all of the district data
var searchArray =[]; //the array that we get from a search
var districtList =[]; //an array of the district names
var markers = [];
var schoolGradeVar = null;
var discValue =null;
var searchTxt = null;//the var where the text that is being searched it placed

//This is when the page is completelt loaded and has all of our listening events
$(document).ready(function(){
    initMap();
    schoolArray = arrayToObjects("school-19.csv");
    districtArray=arrayToObjects("district-19.csv");
    districtOptions();

    $('.selectOptions').on('change', function() {
      discValue=this.value;
      Search();
    });
    $('.searchbutton').click(function(){
      console.log('search');
      searchTxt =$('.search-box').val();
      if(searchTxt == ''){
        searchTxt=null;
      }
      Search();
    });

    $('.h').click(function(){
      buttoncolor();
      if (schoolGradeVar =='H'){
        schoolGradeVar=null;
        Search();
      }
      else{
      $('.h').css('color','blue');
      schoolGradeVar='H';
      Search();
      }
    });
    $('.m').click(function(){
      buttoncolor();
      if (schoolGradeVar =='M'){
        schoolGradeVar=null;
        Search();
      }
      else{
      $('.m').css('color','blue');
      schoolGradeVar='M';
      Search();
      }
    });
    $('.e').click(function(){
      buttoncolor();
      if (schoolGradeVar =='E'){
        schoolGradeVar=null;
        Search();
      }
      else{
      $('.e').css('color','blue');
      schoolGradeVar='E';
      Search();
      }
    });
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
function codeAddress(addy, name) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': addy}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        addMarker(results[0].geometry.location);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
}
function addMarker(position, name) {
  const marker = new google.maps.Marker({
    position,
    name,
    map,
  });

  markers.push(marker);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
function hideMarkers() {
  setMapOnAll(null);
}
function showMarkers() {
  setMapOnAll(map);
}
function deleteMarkers() {
  hideMarkers();
  markers = [];
}
// load US state outline polygons from a GeoJSON file
function loadMapShapes() {
        map.data.loadGeoJson("shape.geojson");
}
//turns an object into json
function objectToJson(obj){
  return JSON.stringify(obj);
}
function removeSearch(){
  $("div[class*='searchResultTab']").each(function (x, pj) {
    $(pj).remove();
 });
}
//retireves all of the school and district data and puts it in their var
function arrayToObjects(TheUrl){
  var results = null;
  $.ajax({
	  type: "GET",  
	  url: TheUrl,
	  dataType: "text", 
    async: false,     
	  success: function(response)  
	  {
		results = $.csv.toObjects(response);
		console.log(results);
	  }   
	});
  return results;
}
//takes all of the districts names and adds them to the options
function districtOptions(){
  for(var i=0; i < districtArray.length; i++){
    $('.selectOptions').append('<option value='+districtArray[i].SystemId +'>'+ districtArray[i].SystemName +'</option>');
  };
}
//basic search with no filters
function Search(){
  removeSearch()
  $(".SearchResultBar").show();
  console.log(searchTxt+" "+schoolGradeVar+" "+discValue);
  if(schoolGradeVar==null & searchTxt==null & discValue !=null){ 
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue;
  });
} else if(schoolGradeVar==null & searchTxt != null & discValue== null){
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1 ;
  });
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null){
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster == schoolGradeVar;
  });
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null){
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster == schoolGradeVar;
  });
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null){
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster == schoolGradeVar & search.SystemId == discValue; 
  });
}else{
  return null;
}
  console.log(searchArray);
  deleteMarkers();
  var template =$('#searchResultTemp').html();
  var text = Mustache.render(template, {arr:searchArray});
  $('.resultContainer').append(text);
  for(var i=0; i < searchArray.length; i++){
    var count=0;
    if(count = 10){
    count=0;
    
    }
    codeAddress(searchArray[i].Street +" "+ searchArray[i].City + " GA", searchArray[i].SchoolName);
    count++;
  };
  showMarkers();
}

function schoolDetails(){}
function buttoncolor(){
  $('.h').css('color','black');
  $('.m').css('color','black');
  $('.e').css('color','black');
}
