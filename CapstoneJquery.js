// Google Maps API key AIzaSyD__zNryK3aQH46g_4ArIrk4zYdhHr7pAo 
//https://schoolgrades.georgia.gov/api/action/datastore/search.json?resource_id=34a95003-f3fb-4dce-af6c-8f69b18617db&limit=5"
//geocoder texas A&M api key 	705790d78c0d4312a11fa01ee384f7db
//geolocation reference https://stackoverflow.com/questions/22603220/uncaught-invalidvalueerror-not-a-feature-or-featurecollection
//Working with google refernce https://developers.google.com/maps/documentation/javascript/combining-data#loading-the-state-boundary-polygons
//use https://api.jquery.com/jquery.grep/ to search the object arrays https://stackoverflow.com/questions/6930350/easiest-way-to-search-a-javascript-object-list-with-jquery
//https://upload.wikimedia.org/wikipedia/commons/9/99/USA_Georgia_relief_location_map.svg
var map; //google maps
var geocoder;
var schoolArray =[];//all of the school data 
var districtArray =[];  //all of the district data
var searchArray =[]; //the array that we get from a search
var districtList =[]; //an array of the district names
var markers = [];
var infoList =[];
var schoolSelect =[];
var schoolGradeVar = null;
var discValue =null;
var searchTxt = null;//the var where the text that is being searched it placed
var schoolSelect =[];

//This is when the page is completelt loaded and has all of our listening events
$(document).ready(function(){
    initMap();
    schoolArray = arrayToObjects("school-19.csv");
    districtArray=arrayToObjects("district-19.csv");
    districtOptions();
    $(".SearchResultBar").hide();
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
    $('.searchContainer').on('click','.searchResultTab',function(){
      var id = this.id;
     showSelected(id);
     title = id.substring(1,id.length);
     $("div[title|="+title+"]").trigger("click");
     console.log("clicked id: "+ id);
     console.log("div title: "+title);
     
    });
    $('.SearchResultBar').on('click','.MoreInfo',function(){
     schoolDetails(this.value);
    });
    $('.BackToMap').click(function(){
      $('#mapPage').show();
      $('.SchoolDescriptionPage').hide();
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


//This function takes in an address and creates a marker on the map of it, Look into adding details to the makers. It should bring up the school when you click it
function codeAddress(addy, name, infowindow) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': addy}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        addMarker(results[0].geometry.location,name, infowindow);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
}
//This function does the same as the one above but uses TexasA&M API services instead of the Google API for Geocoding.
//Surpases the 10 at a time error but is very slow and not a good solution.
function geocodeTexas(street,city,zip, name, Info){
  $.ajax({
	  type: "GET",  
	  url: "https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?streetAddress="+street+"&city="+city+"&state=ga&zip="+zip+"&apikey=705790d78c0d4312a11fa01ee384f7db&format=json&census=true&censusYear=2000|2010&notStore=false&version=4.01",
	  dataType: "text", 
    async: false,     
	  success: function(response)  
	  {
      console.log(response);  
    var obj = jQuery.parseJSON( response );
    var one =obj.OutputGeocodes[0].OutputGeocode.Latitude;
    var two =obj.OutputGeocodes[0].OutputGeocode.Longitude;             //lmao this right here took so much longer than it should have. HOURS of work. At least I learned something. 
    var position={lat:  parseFloat(one), lng: parseFloat(two)};
    console.log(position);
    addMarker(position, name, Info);
	  }  
   
	});
};

function showSelected(id){
  HideSearchDetail();
  $(id).show();
};
//These are all of the marker functions that we will need provided by the google API documentation 
function addMarker(position, name, constent) {
  
  const infowindow = new google.maps.InfoWindow({
    content: constent,
  });
  const marker = new google.maps.Marker({
    position,
    title:name,
    map,
  });
  map.setCenter(position);
  markers.push(marker);
  infoList.push(infowindow);
  marker.addListener("click", () => {
    map.setZoom(9);
    map.setCenter(marker.getPosition());
    infowindow.open({
      anchor:marker,
      map,
      shouldFocus:false,
    });
    showSelected("#"+name);
    document.getElementById("#"+name).scrollIntoView();
    console.log("marker title: "+name);
  });
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
//This function loops through all of the searchResultTab divs and removes them from the HTML
function removeSearch(){
  $("div[class*='searchResultTab']").each(function (x, pj) {
    $(pj).remove();
 });
}
function removeSchoolDetail(){
  $("div[class*='SchoolInfoResult']").each(function (x, pj) {
    $(pj).remove();
 });
}
function HideSearchDetail(){
  $("div[class*='searchResultDetail']").each(function (x, pj) {
    $(pj).hide();
 });
}

//Takes any CSV files and stores the information as a JS object. 
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
//Search function with if statements for each filter combination. 
function Search(){
  $(".SearchResultsTabs").show();
  removeSearch()
  $(".SearchResultBar").show();
  if(discValue==1){
    discValue=null;
  }
  if(schoolGradeVar==null & searchTxt==null & discValue !=null){ 
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue;
  });
  renderSearch(searchArray);
  console.log("one");
} else if(schoolGradeVar==null & searchTxt != null & discValue== null){       
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1 ;
  });
  renderSearch(searchArray);
  console.log('two');
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null){
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1;
  });
  renderSearch(searchArray);
  console.log('three');
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null){
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1;
  });
  renderSearch(searchArray);
  console.log(searchArray);
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null){
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue; 
  });
  renderSearch(searchArray);
  console.log("four");
}else { 
  $(".SearchResultBar").hide();
  deleteMarkers();
  console.log("hide");
}
}
function renderSearch(searchArray){
  deleteMarkers();
  var template =$('#searchResultTemp').html();
  var text = Mustache.render(template, {arr:searchArray});
  $('.searchContainer').append(text);
 	   //This is two seperate attempts to try to fix the 10 at once error. The current solution works but is extremely slow. 
	  //I want to create a seperate file with all of the long and lat of each school but I do not have time at the moment
  for(var i=0; i < searchArray.length; i++){
    var result = searchArray[i].SchoolName.replace(/ /g, "-");
    var template =$('#windowInfo').html();
    var infowindow = Mustache.render(template, {arr:searchArray[i]});
    var but ="<a href='https://schoolgrades.georgia.gov/"+result+"'> <button class='MoreInfo'>click here</button></a>";
    infowindow += but;
    //geocodeTexas(searchArray[i].Street, searchArray[i].City,searchArray[i].Zip_Code, searchArray[i].sys_sch, infowindow);
    codeAddress(searchArray[i].Street +" "+ searchArray[i].City + " GA", searchArray[i].sys_sch, infowindow);  
  };
  
  showMarkers();
}

//This is the function to take all of the school details and put them on a page. Still needs to be flushed out. 
function schoolDetails(value){
  removeSchoolDetail();
  $("#mapPage").hide();
  $("#SchoolDescriptionPage").show();
  console.log("Page select: "+value);
  schoolSelect =[];
  schoolSelect= $.grep(searchArray, function(search){
    return  search.sys_sch == value;
  });
  console.log(schoolSelect);
  var template =$('#SchoolDetails').html();
  var text = Mustache.render(template, {arr:schoolSelect});
  $('#SchoolDescriptionPage').append(text);
}
//This just changes the button color for the Grades Filter
function buttoncolor(){
  $('.h').css('color','black');
  $('.m').css('color','black');
  $('.e').css('color','black');
}


//google map overlay information
/**
 * The custom USGSOverlay object contains the USGS image,
 * the bounds of the image, and a reference to the map.
 */

 function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 32.744164, lng: -83.498423 },
    mapTypeId: "9ce7866f52bea9c7",
  });
  var swBound = new google.maps.LatLng(30.2, -85.8);
  var neBound = new google.maps.LatLng(35.2, -80.6);
  const bounds = new google.maps.LatLngBounds(swBound, neBound);
  // The photograph is courtesy of the U.S. Geological Survey.
  let image = 'https://upload.wikimedia.org/wikipedia/commons/9/99/USA_Georgia_relief_location_map.svg'
  /**
   * The custom USGSOverlay object contains the USGS image,
   * the bounds of the image, and a reference to the map.
   */
  class USGSOverlay extends google.maps.OverlayView {
    bounds;
    image;
    div;
    constructor(bounds, image) {
      super();
      this.bounds = bounds;
      this.image = image;
    }
    /**
     * onAdd is called when the map's panes are ready and the overlay has been
     * added to the map.
     */
    onAdd() {
      this.div = document.createElement("div");
      this.div.style.borderStyle = "none";
      this.div.style.borderWidth = "0px";
      this.div.style.position = "absolute";

      // Create the img element and attach it to the div.
      const img = document.createElement("img");

      img.src = this.image;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.position = "absolute";
      this.div.appendChild(img);

      // Add the element to the "overlayLayer" pane.
      const panes = this.getPanes();

      panes.overlayLayer.appendChild(this.div);
    }
    draw() {
      // We use the south-west and north-east
      // coordinates of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      const overlayProjection = this.getProjection();
      // Retrieve the south-west and north-east coordinates of this overlay
      // in LatLngs and convert them to pixel coordinates.
      // We'll use these coordinates to resize the div.
      const sw = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getSouthWest()
      );
      const ne = overlayProjection.fromLatLngToDivPixel(
        this.bounds.getNorthEast()
      );

      // Resize the image's div to fit the indicated dimensions.
      if (this.div) {
        this.div.style.left = sw.x + "px";
        this.div.style.top = ne.y + "px";
        this.div.style.width = ne.x - sw.x + "px";
        this.div.style.height = sw.y - ne.y + "px";
      }
    }
    /**
     * The onRemove() method will be called automatically from the API if
     * we ever set the overlay's map property to 'null'.
     */
    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        delete this.div;
      }
    }
    /**
     *  Set the visibility to 'hidden' or 'visible'.
     */
    hide() {
      if (this.div) {
        this.div.style.visibility = "hidden";
      }
    }
    show() {
      if (this.div) {
        this.div.style.visibility = "visible";
      }
    }
    toggle() {
      if (this.div) {
        if (this.div.style.visibility === "hidden") {
          this.show();
        } else {
          this.hide();
        }
      }
    }
    toggleDOM(map) {
      if (this.getMap()) {
        this.setMap(null);
      } else {
        this.setMap(map);
      }
    }
  }

  const overlay = new USGSOverlay(bounds, image);

  overlay.setMap(map);

  const toggleButton = document.createElement("button");

  toggleButton.textContent = "Toggle";
  toggleButton.classList.add("custom-map-control-button");

  const toggleDOMButton = document.createElement("button");

  toggleDOMButton.textContent = "Toggle DOM Attachment";
  toggleDOMButton.classList.add("custom-map-control-button");
  toggleButton.addEventListener("click", () => {
    overlay.toggle();
  });
  toggleDOMButton.addEventListener("click", () => {
    overlay.toggleDOM(map);
  });
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleButton);
}


