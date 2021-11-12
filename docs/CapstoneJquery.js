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
var schoolGradeVar = null;
var discValue =null;
var searchTxt = null;//the var where the text that is being searched it placed
const infowindow = new google.maps.InfoWindow({
  maxWidth: 500,
});
var delay;
var nextaddress;
var addresses =[]; 
var infoArray =[];
var latestposition;
var schoolRatingVar = null;
var miscellaneousSearch =null;

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
function codeAddress(addy, sync, name,infowindow, icon, next) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': addy}, function(results, status) {
      if (status+"" == "OK") {
        addMarker(results[0].geometry.location,sync,name, infowindow, icon);
      }else{ 
        if (status+"" == 'OVER_QUERY_LIMIT') {
          nextaddress--;
          delay+=1;
          var msg = 'address="' + addy + '" error=' +status+ '(delay='+delay+'ms) arrayNum:'+nextaddress;
          console.log(msg);
        } else {
          var msg = 'address="' + addy + '" error=' +status+ '(delay='+delay+'ms) arrayNum:' +nextaddress;
          console.log(msg);
        }   
      }
      next();
    });
    
}


//This function does the same as the one above but uses TexasA&M API services instead of the Google API for Geocoding.
//Surpases the 10 at a time error but is very slow and not a good solution.
function geocodeTexas(street,city,zip, name, Info, icon){
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
    addMarker(position, name, Info, icon);
	  }  
	});
};

//These are all of the marker functions that we will need provided by the google API documentation 
function addMarker(position, sync,name, constent, URL) {
  const marker = new google.maps.Marker({
    position,
    title:sync,
    animation: google.maps.Animation.DROP,
    map,
    optimized: false,
    icon: {
      labelOrigin: new google.maps.Point(11, 50),
      url: URL,
    },
    label:{
      color: 'black',
      fontWeight: 'bold',
      text: name,
    }
  });
  
  latestposition=marker.getPosition();
  markers.push(marker);
  infoList.push(infowindow);
  marker.addListener("click", () => {
    var setZoom=12;
    var getZoom=map.getZoom();
    
    if(setZoom < getZoom ){
     setZoom = getZoom;
    }
    map.setZoom(setZoom);
    map.setCenter(marker.getPosition());
    infowindow.close();
    infowindow.setContent(constent);
    infowindow.open(marker.getMap(), marker);
    HideSearchDetail();
    $("#"+sync).show();
    
    document.getElementById("#"+sync).scrollIntoView();
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
	  }   
	});
  return results;
}

//takes all of the districts names and adds them to the options
function districtOptions(){
  for(var i=0; i < districtArray.length; i++){
    $('.selectOptions').append('<option value='+districtArray[i].SystemId +'>'+ districtArray[i].SystemName +'</option>');
  };
  districtArray=[];
}
//Search function with if statements for each filter combination. 
function Search(){
  console.log(schoolGradeVar +" "+ searchTxt +" "+ discValue +" "+ schoolRatingVar +" "+  miscellaneousSearch);
  $(".SearchResultsTabs").show();
  removeSearch()
  $(".SearchResultBar").show();
  if(discValue==1){
    discValue=null;
  }
  if(schoolGradeVar==null & searchTxt==null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ // discticts
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue;
  });
  renderSearch(searchArray);
  DiscZoom();
} else if(schoolGradeVar==null & searchTxt != null & discValue== null & schoolRatingVar == null & miscellaneousSearch ==null){       // school text
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1 ;
  });
  renderSearch(searchArray);
  nonDiscZoom();
}else if(schoolGradeVar==null & searchTxt == null & discValue== null & schoolRatingVar == null & miscellaneousSearch !=null){ // miscellaneous
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) > -1 ;
  });
  renderSearch(searchArray);
  nonDiscZoom();
}else if(schoolGradeVar ==null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ //school disc and rating
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Grade == schoolRatingVar;
  });
  renderSearch(searchArray);
  DiscZoom();
}else if(schoolGradeVar ==null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch !=null){ //school disc and rating and misc
   searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) > -1;
  });
  renderSearch(searchArray);
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ // school discs and grade level
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1;
  });
  renderSearch(searchArray);
  console.log('three');
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar == null & miscellaneousSearch !=null){ // school discs and grade level and misc
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1 &  search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) > -1;
  });
  renderSearch(searchArray);
  console.log('three');
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ //school disc, grade level, and rating
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1 & search.Grade == schoolRatingVar;
  });
  renderSearch(searchArray);
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ //school disc, grade level, and rating and misc
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1 & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) >-1;
  });
  renderSearch(searchArray);
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar == null & miscellaneousSearch ==null){ // text and school level
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1;
  });
  renderSearch(searchArray);
  nonDiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar == null & miscellaneousSearch ==null){ // text and school level and misc
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1  & search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) >-1;
  });
  renderSearch(searchArray);
  nonDiscZoom();
}else if(schoolGradeVar ==null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null){ //text and rating
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1  & search.Grade == schoolRatingVar;
  });
  renderSearch(searchArray);
  console.log('two');
  nonDiscZoom();
}else if(schoolGradeVar ==null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null){ //text and rating and misc
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1  & search.Grade == schoolRatingVar  & search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) >-1;
  });
  renderSearch(searchArray);
  console.log('two');
  nonDiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null){ // text rating grade level
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1  & search.Grade == schoolRatingVar;
  });
  renderSearch(searchArray);
  nonDiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null){ // text rating grade level & misc
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1  & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) >-1;
  });
  renderSearch(searchArray);
  nonDiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ //text & school level & district
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue; 
  });
  renderSearch(searchArray);
  console.log("four");
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ //text & school level & district & misc
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue & search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) >-1; 
  });
  renderSearch(searchArray);
  console.log("four");
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ // text & school level & district & rating
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue & search.Grade == schoolRatingVar; 
  });
  renderSearch(searchArray);
  DiscZoom();
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar != null & miscellaneousSearch !=null){ // text & school level & district & rating & misc
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(miscellaneousSearch.toLowerCase()) >-1; 
  });
  renderSearch(searchArray);
  DiscZoom();
}else { 
  $(".SearchResultBar").hide();
  deleteMarkers();
  console.log("hide");
}
}
function renderSearch(searchArray){
  deleteMarkers();
  addresses=[];
  delay = 100;
  nextaddress=-1;
  sync =[];
  infoArray =[];
  iconArray = [];
  nameArray = [];
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
 var icon = "MapIcon/"+searchArray[i].Cluster + searchArray[i].Grade +".png";
 //geocodeTexas(searchArray[i].Street, searchArray[i].City,searchArray[i].Zip_Code, searchArray[i].sys_sch, infowindow);
 addresses.push(searchArray[i].Street +" "+ searchArray[i].City + " GA");
 infoArray.push(infowindow);
 }
 theNext();
}
function theNext(){
  if(nextaddress < addresses.length-1 ){
  timer = setTimeout( function(){
    codeAddress(addresses[nextaddress], searchArray[nextaddress].sys_sch , searchArray[nextaddress].SchoolName,
       infoArray[nextaddress],searchArray[nextaddress].Cluster + searchArray[nextaddress].Grade +".png",theNext);
  }, delay);
  nextaddress++;
  } 
  else{
  clearTimeout(timer);
  map.setCenter(latestposition);
  }
}
function DiscZoom(){
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': addresses[addresses.length -1]}, function(results, status) {
    map.setCenter(results[0].geometry.location);
    map.setZoom(10);
  });
}
function nonDiscZoom(){
  var one =32.744164;
  var two =-83.498423;
  map.setCenter({lat:  parseFloat(one), lng: parseFloat(two)});
  map.setZoom(7);
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
    mapTypeId: "satellite",
  });
  var swBound = new google.maps.LatLng(30.2, -85.8);
  var neBound = new google.maps.LatLng(35.2, -80.6);
  const bounds = new google.maps.LatLngBounds(swBound, neBound);
  // The photograph is courtesy of the U.S. Geological Survey.
  let image = 'USA_Georgia_relief_location_map.png'
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

  toggleDOMButton.textContent = "Map Of Georgia On/Off";
  toggleDOMButton.classList.add("custom-map-control-button");
  toggleButton.addEventListener("click", () => {
    overlay.toggle();
  });
  toggleDOMButton.addEventListener("click", () => {
    overlay.toggleDOM(map);
  });
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
}
