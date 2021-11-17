// Google Maps API key AIzaSyD__zNryK3aQH46g_4ArIrk4zYdhHr7pAo 
//https://schoolgrades.georgia.gov/api/action/datastore/search.json?resource_id=34a95003-f3fb-4dce-af6c-8f69b18617db&limit=5"
//geocoder texas A&M api key 	705790d78c0d4312a11fa01ee384f7db
//geolocation reference https://stackoverflow.com/questions/22603220/uncaught-invalidvalueerror-not-a-feature-or-featurecollection
//Working with google refernce https://developers.google.com/maps/documentation/javascript/combining-data#loading-the-state-boundary-polygons
//use https://api.jquery.com/jquery.grep/ to search the object arrays https://stackoverflow.com/questions/6930350/easiest-way-to-search-a-javascript-object-list-with-jquery
//https://upload.wikimedia.org/wikipedia/commons/9/99/USA_Georgia_relief_location_map.svg
var map; //google maps
var geocoder =new google.maps.Geocoder();
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
var schoolType =[];

//This is when the page is completelt loaded and has all of our listening events
$(document).ready(function(){
     let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    initMap();
    schoolArray = arrayToObjects("school-19.csv");
    districtArray=arrayToObjects("district-19.csv");
    districtOptions();
    $(".SearchResultBar").hide();
    $('.ClearButton').on('click', function(){
      document.getElementById('A').checked = false;
      document.getElementById('B').checked = false;
      document.getElementById('C').checked = false;
      document.getElementById('D').checked = false;
      document.getElementById('F').checked = false;
      document.getElementById('NotRated').checked = false;
      document.getElementById('typeHome').selected = true;
      document.getElementById('discHome').selected = true;
      
      schoolGradeVar = null;
      discValue =null;
      miscellaneousSearch =null;
      schoolRatingVar = null;
      searchTxt = null;
      searchArray =[];
      buttoncolor();
      nonDiscZoom();
      Search();
    });
    $('.selectOptions').on('change', function() {
      discValue=this.value;
      if(discValue==1){
       discValue=null;
      }
      Search();
    });
    $('.SchoolTypeOptions').on('change', function() {
      miscellaneousSearch=this.value;
      
      switch(parseInt(this.value)){
        case 1:
          miscellaneousSearch=null;
          break;
        case 2:
          schoolType=["magnet"]
          break;
        case 3:
          schoolType=["arts"]
          break;
        case 4:
          schoolType=["tech","stem","S.T.E.M."]
          break;
        case 5:
          schoolType=["Charter"]
          break;
        case 6:
          schoolType=["Blind","Deaf", "Special", "Intervention"]
          break;
        case 7:
          schoolType=["Online","Virtual"]
          break;
        case 8:
          schoolType=["International", "Language"]
          break;
        case 9:
          schoolType=["advance", "classical"]
          break;
      }

      Search();
    });
    $('.searchbutton').click(function(){
      
      searchTxt =$('.search-box').val();
      if(searchTxt == ''){
        searchTxt=null;
      }
      Search();
    });
    $(document).on("change", "input:text", function (e) {
      searchTxt = this.value;
      
      if(searchTxt == ''){
        searchTxt=null;
      }
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
    $('#A').on('click', function() {
      if(this.value == schoolRatingVar){
      schoolRatingVar=null;
      document.getElementById('A').checked = false;
      Search(); 
      }else{
        schoolRatingVar=this.value;
        Search();
      }
    });
    $('#B').on('click', function() {
      if(this.value == schoolRatingVar){
      schoolRatingVar=null;
      Search();
      document.getElementById('B').checked = false; 
      }else{
        schoolRatingVar=this.value;
        Search();
      }
    });
    $('#C').on('click', function() {
      if(this.value == schoolRatingVar){
      schoolRatingVar=null;
      document.getElementById('C').checked = false;
      Search(); 
      }else{
        schoolRatingVar=this.value;
        Search();
      }
      console.log(schoolRatingVar);
    });
    $('#D').on('click', function() {
      if(this.value == schoolRatingVar){
      schoolRatingVar=null;
      document.getElementById('D').checked = false; 
      Search();
      }else{
        schoolRatingVar=this.value;
        Search();
      }
    });
    $('#F').on('click', function() {
      if(this.value == schoolRatingVar){
      schoolRatingVar=null;
      document.getElementById('F').checked = false; 
      Search();
      }else{
        schoolRatingVar=this.value;
        Search();
      }
    });
    $('#NotRated').on('click', function() {
      if(this.value == schoolRatingVar){
      schoolRatingVar=null;
      document.getElementById('NotRated').checked = false; 
      Search();
      }else{
        schoolRatingVar=this.value;
        Search();
      }
    });
});


//This function takes in an address and creates a marker on the map of it, Look into adding details to the makers. It should bring up the school when you click it
function codeAddress(addy, sync, name,infowindow, icon, next) {
    
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
     
    var obj = jQuery.parseJSON( response );
    var one =obj.OutputGeocodes[0].OutputGeocode.Latitude;
    var two =obj.OutputGeocodes[0].OutputGeocode.Longitude;             //lmao this right here took so much longer than it should have. HOURS of work. At least I learned something. 
    var position={lat:  parseFloat(one), lng: parseFloat(two)};
    addMarker(position, name, Info, icon);
	  }  
	});
};
function showSelected(sync){
  HideSearchDetail();
    $(sync).show();
}
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
    $('.selectOptions').append('<option class="district" id='+districtArray[i].SystemId+' value='+districtArray[i].SystemId +'>'+ districtArray[i].SystemName +'</option>');
  };
  districtArray=[];
}
//Search function with if statements for each possible filter combination.
// t= textsearch d=discticts m=misc r=rating g=gradelevel
//t d m td tm dm tdm tg tr tgr dg dr dgr mg mr mgr tdg tdr tdgr tmg tmr tmgr dmg dmr dmgr tdmg tdmr tdmgr =28 different possible combinations
function Search(){
  searchArray=[];
  $(".SearchResultsTabs").show();
  removeSearch()
  $(".SearchResultBar").show();
 
  if(schoolGradeVar==null & searchTxt==null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ //discticts 1 d
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue;
  });
  console.log('d');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt != null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ //disc & text 2 dt 
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1 & search.SystemId == discValue ;
  });
  decideSearchAction()
  console.log('dt');
}else if(schoolGradeVar ==null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ // disc and rating 3 dr 
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Grade == schoolRatingVar;
  });
  console.log('dr ');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ // disc and grade 4 dg
  searchArray= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) > -1 ;
  });
  console.log('dg');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ // disc, grade level, and rating 5 dgr
    searchArray= $.grep(schoolArray, function(search){
      return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1 & search.Grade == schoolRatingVar;
    });
    console.log('dgr');
    decideSearchAction()
}else if(schoolGradeVar==null & searchTxt == null & discValue== null & schoolRatingVar == null & miscellaneousSearch !=null){ // miscellaneous 6  m
  var addString=[];
  for(var i= 0; i < schoolType.length; i++){
    addString = $.grep(schoolArray, function(search){
      
      return search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) > -1 ;
    });
    searchArray=searchArray.concat(addString);
    }
    console.log(searchArray)
    console.log('m');
    decideSearchAction()
}else if(schoolGradeVar!=null & searchTxt == null & discValue== null & schoolRatingVar == null & miscellaneousSearch !=null){ // misc grade 7 mg 
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
      return  search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) > -1  &  search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) > -1 ;
    });
    searchArray = searchArray.concat(addString);
    }
    console.log();
    console.log('mg ');
    decideSearchAction()
}else if(schoolGradeVar==null & searchTxt == null & discValue== null & schoolRatingVar != null & miscellaneousSearch !=null){ // misc rate 8 mr 
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
      return  search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) > -1  & search.Grade == schoolRatingVar ;
    });
    searchArray = searchArray.concat(addString);
    }
    console.log('mr');
    decideSearchAction()
  }else if(schoolGradeVar!=null & searchTxt == null & discValue== null & schoolRatingVar != null & miscellaneousSearch !=null){ // misc rate grade 9 mrg
    var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
      return  search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) > -1  & search.Grade == schoolRatingVar  &  search.Cluster.indexOf(schoolGradeVar) > -1  ;
    });
    searchArray = searchArray.concat(addString);
    }
    console.log('mrg');
    decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt == null & discValue !=null & schoolRatingVar == null & miscellaneousSearch !=null){ // disc and misc 10 dm
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
      return  search.SystemId == discValue &  search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) > -1 ;
    });
    searchArray = searchArray.concat(addString);
    }
    console.log('dm');
    decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch !=null){ // disc & misc and rating  11 dmr
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
   return  search.SystemId == discValue & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) > -1;
 });
 searchArray = searchArray.concat(addString);
}
 
 console.log('dmr');
 decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar == null & miscellaneousSearch !=null){ //  discs & misc  grade level 12  dmg
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1 &  search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) > -1;
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('dmg');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt == null & discValue !=null & schoolRatingVar != null & miscellaneousSearch !=null){ // disc misc, grade level, rating 13 dmgr 
  var addString=[];
  for(var i=0; i < schoolType.length; i++){ 
    addString= $.grep(schoolArray, function(search){
    return  search.SystemId == discValue & search.Cluster.indexOf(schoolGradeVar) >-1 & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1;
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('dmgr ');
  decideSearchAction()
} else if(schoolGradeVar==null & searchTxt != null & discValue== null & schoolRatingVar == null & miscellaneousSearch ==null){ //  text 14 t
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1 ;
  });
  console.log('t');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar == null & miscellaneousSearch ==null){ // text and school level 15 tg
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1;
  });
  console.log('tg');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null){ // text and rating 16 tr
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1  & search.Grade == schoolRatingVar;
  });
  console.log('tr');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null){ // text rating grade level 17  tgr
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1  & search.Grade == schoolRatingVar;
  });
  console.log('tgr');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt != null & discValue ==null & schoolRatingVar == null & miscellaneousSearch !=null){ // text  misc 18 tm
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1;
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tm');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar == null & miscellaneousSearch !=null){ // text misc  school level 19 tmg
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1  & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1;
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tmg');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch !=null){ // text misc rating  20 tmr
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) > -1  & search.Grade == schoolRatingVar  & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1;
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tmr');
  decideSearchAction()

}else if(schoolGradeVar !=null & searchTxt != null & discValue ==null & schoolRatingVar != null & miscellaneousSearch !=null){ // text misc rating grade level 21 tmgr
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.indexOf(schoolGradeVar) >-1  & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1;
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tmgr');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar == null & miscellaneousSearch ==null){ // text district  grade level 22  tdg
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue; 
  });
  console.log('tdg');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt != null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ // text district  rating 23 tdr
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Grade == schoolRatingVar & search.SystemId == discValue; 
  });
  console.log('tdr');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar != null & miscellaneousSearch ==null){ // text district& school level  & rating 24 tdrg
  searchArray= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue & search.Grade == schoolRatingVar; 
  });
  console.log('tdrg');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt != null & discValue !=null & schoolRatingVar == null & miscellaneousSearch !=null){ //text &  district & misc 25 tdm
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1  & search.SystemId == discValue & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1; 
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tdm');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar == null & miscellaneousSearch !=null){ //text district misc & school level 26 tdmg
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1; 
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tdmg');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt != null & discValue !=null & schoolRatingVar != null & miscellaneousSearch !=null){ // text misc district &   rating 27 tdmr
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 &  search.SystemId == discValue & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1; 
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tdmr');
  decideSearchAction()
}else if(schoolGradeVar !=null & searchTxt != null & discValue !=null & schoolRatingVar != null & miscellaneousSearch !=null){ // text misc district & school level  rating 28 tdmgr
  var addString=[];
  for(var i=0; i < schoolType.length; i++){
    addString= $.grep(schoolArray, function(search){
    return  search.SchoolName.toLowerCase().indexOf(searchTxt.toLowerCase()) >-1 & search.Cluster.toLowerCase().indexOf(schoolGradeVar.toLowerCase()) >-1 & search.SystemId == discValue & search.Grade == schoolRatingVar & search.SchoolName.toLowerCase().indexOf(schoolType[i].toLowerCase()) >-1; 
  });
  searchArray = searchArray.concat(addString);
  }
  console.log('tdmgr');
  decideSearchAction()
}else if(schoolGradeVar ==null & searchTxt == null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null) { 
  $(".SearchResultBar").hide();
  deleteMarkers();
}else if(schoolGradeVar !=null & searchTxt == null & discValue ==null & schoolRatingVar == null & miscellaneousSearch ==null) { 
  $(".SearchResultBar").hide();
  deleteMarkers();
}else if(schoolGradeVar !=null & searchTxt == null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null) { 
  $(".SearchResultBar").hide();
  deleteMarkers();
}else if(schoolGradeVar ==null & searchTxt == null & discValue ==null & schoolRatingVar == null & miscellaneousSearch ==null) { //we only allow a marker to pop up if either searchtxt, discValue, or misc are not null
  $(".SearchResultBar").hide();
  deleteMarkers();
}else{
  console.log('error, uncaught logic:' + schoolGradeVar +" "+ searchTxt +" "+ discValue +" "+ schoolRatingVar +" "+  miscellaneousSearch);
}
}
function renderSearch(searchArray){
  deleteMarkers();
  addresses=[];
  delay = 100;
  nextaddress=-1;
  infoArray =[];
  var template =$('#searchResultTemp').html();
  var text = Mustache.render(template, {arr:searchArray});
  $('.searchContainer').append(text);
 for(var i=0; i < searchArray.length; i++){
 var result = searchArray[i].SchoolName.replace(/ /g, "-");
 var template =$('#windowInfo').html();
 var infowindow = Mustache.render(template, {arr:searchArray[i]});
 var but ="<a href='https://schoolgrades.georgia.gov/"+result+"'> <button class='MoreInfo'>click here</button></a>";
 infowindow += but;
 addresses.push(searchArray[i].Street +" "+ searchArray[i].City + " GA");
 infoArray.push(infowindow);
 }
 $("#total").html(addresses.length);
 theNext();
}
function theNext(){
  if(nextaddress < addresses.length-1 ){
  timer = setTimeout( function(){
    codeAddress(addresses[nextaddress], searchArray[nextaddress].sys_sch , searchArray[nextaddress].SchoolName,
       infoArray[nextaddress],searchArray[nextaddress].Cluster + searchArray[nextaddress].Grade +".png",theNext);
  }, delay);
  nextaddress++;
  $("#count").html(nextaddress+1);
  } 
  else{
  clearTimeout(timer);
  }
  if( searchTxt == null & discValue ==null & miscellaneousSearch ==null){
    clearTimeout(timer);
    deleteMarkers();
  }
}
function decideSearchAction(){
  if(searchArray.length==0){
    $(".SearchResultBar").hide();
    deleteMarkers();
    alert("There are no schools that match your search");
    console.log('error, uncaught logic:' + schoolGradeVar +" "+ searchTxt +" "+ discValue +" "+ schoolRatingVar +" "+  miscellaneousSearch);
  }else if(discValue != null){
  renderSearch(searchArray);
  DiscZoom();
  }
  else{
    renderSearch(searchArray);
    nonDiscZoom();
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
  map.addListener("click", (event) => {
    geocoder.geocode( { 'location': event.latLng}, function(results, status) {
      var int =results[0].address_components.length;
      $("option[class*='district']").each(function (x, pj) {
        for(var i=0; i < int ; i++){
          var one = ""+$(pj).text();
          var two = "" +results[0].address_components[i].long_name;
         
          if(one == two){
            if(discValue != pj.value){
              pj.selected=true;
              $(pj).trigger("change");
            }
          }
        }
     });
    });
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
