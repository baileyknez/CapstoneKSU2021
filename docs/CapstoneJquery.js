// Google Maps API key AIzaSyD__zNryK3aQH46g_4ArIrk4zYdhHr7pAo 
//https://schoolgrades.georgia.gov/api/action/datastore/search.json?resource_id=34a95003-f3fb-4dce-af6c-8f69b18617db&limit=5"
//geocoder texas A&M api key 	705790d78c0d4312a11fa01ee384f7db
//geolocation reference https://stackoverflow.com/questions/22603220/uncaught-invalidvalueerror-not-a-feature-or-featurecollection
//Working with google refernce https://developers.google.com/maps/documentation/javascript/combining-data#loading-the-state-boundary-polygons
//use https://api.jquery.com/jquery.grep/ to search the object arrays https://stackoverflow.com/questions/6930350/easiest-way-to-search-a-javascript-object-list-with-jquery
//https://upload.wikimedia.org/wikipedia/commons/9/99/USA_Georgia_relief_location_map.svg
//https://github.com/deldersveld/topojson/blob/master/countries/us-states/GA-13-georgia-counties.json
var map; //google maps
var geocoder =new google.maps.Geocoder();
var schoolArray =[];//all of the school data 
var districtArray =[];  //all of the district data
var searchArray =[]; //the array that we get from a search
var districtList =[]; //an array of the district names
var getLocation =[];
var markers = [];
var infoList =[];
var schoolGradeVar = null;
var discValue =null;
var searchTxt = null;//the var where the text that is being searched it placed
var sync=[];
const infowindow = new google.maps.InfoWindow({
  maxWidth: 500,
});
var delay; //decides how long to wwait in the next function
var nextaddress; //decides which address to attempt to mark in the next function and allows to puch back to an address
var addresses =[]; //list of addresses to add markers to 
var infoArray =[]; //this is the list of templates 
var latestposition; //
var schoolRatingVar = null;
var miscellaneousSearch =null;
var schoolType =[];
var timer;
var SearchResultToggle;
var markerZscoreToggle=null;
var colorMeaningToggle=0;
//This is when the page is completelt loaded and has all of our listening events
$(document).ready(function(){
                                                                  
    initMap();
    resize();
    schoolArray = arrayToObjects("school-19.csv");
    districtArray=arrayToObjects("district-19.csv");
    getLocation =arrayToObjects("getSchool.csv");
    districtOptions();
    
    //detects when resize happens
    $(window).resize(function(){
      resize();
    });
    //reset search
    $(".SearchResultBar").hide();
    SearchResultToggle=false;
    $('.ClearButton').on('click', function(){
      document.getElementById('A').checked = false;
      document.getElementById('B').checked = false;
      document.getElementById('C').checked = false;
      document.getElementById('D').checked = false;
      document.getElementById('F').checked = false;
      document.getElementById('h').checked = false;
      document.getElementById('m').checked = false;
      document.getElementById('e').checked = false;
      document.getElementById('NotRated').checked = false;
      document.getElementById('typeHome').selected = true;
      document.getElementById('discHome').selected = true;
      SearchResultToggle=false;
      resize();
      schoolGradeVar = null;
      discValue =null;
      miscellaneousSearch =null;
      schoolRatingVar = null;
      searchTxt = null;
      searchArray =[];
      buttoncolor();
      nonDiscZoom();
      $(".SearchResultBar").hide();
      SearchResultToggle=false;
      deleteMarkers();
    });
    //select disc
    $('.selectOptions').on('change', function() {
      discValue=this.value;
      if(discValue==1){
       discValue=null;
      }
      Search();
    });

    $(".colorMeaningLink").on('click', function(){
      if(colorMeaningToggle==0){
      $(".colorContainer").show();
      colorMeaningToggle=1;
      }else{
        $(".colorContainer").hide();
        colorMeaningToggle=0;  
      }
    });
    
    //how we select school type
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
          schoolType=stemSchools;
          break;
        case 5:
          schoolType=["Charter"]
          break;
        case 6:
          schoolType=["Blind","Deaf", "Special", "Intervention","Alternative"]
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
    //how we search text or name of school... should we search districts?
    $('.searchbutton').click(function(){
      searchTxt =$('.search-box').val();
      if(searchTxt == ''){
        searchTxt=null;
      }
      Search();
    });
    //detects when text change
    $(document).on("change", "input:text", function (e) {
      searchTxt = this.value;
      
      if(searchTxt == ''){
        searchTxt=null;
      }
    });
    //when you click on a search result and it goes to the marker
    $('.searchContainer').on('click','.searchResultTab',function(){
    var id = this.id;
     HideSearchDetail();
     $(id).show();
     
     title = id.substring(1,id.length);
     $("div[title|="+title+"]").trigger("click");
    });

    $('.searchContainer').on('mouseover','.searchResultTab',function(){
      var id = this.id;
       
       title = id.substring(1,id.length);
       for(var i=0; i< markers.length; i++){
       if(title == markers[i].title){
         markers[i].setAnimation(google.maps.Animation.BOUNCE);
         markers[i].setZIndex(100);
       }
       }
      
      });
      $('.searchContainer').on('mouseout','.searchResultTab',function(){
        var id = this.id;
         
         title = id.substring(1,id.length);
         for(var i=0; i< markers.length; i++){
         if(title == markers[i].title){
           markers[i].setAnimation(null);
           if(markerZscoreToggle != markers[i].title){
           markers[i].setZIndex(0);
           }
         }
         }
        
        });
    //School grade filter options
    $('#h').click(function(){
      buttoncolor();
      if (schoolGradeVar =='H'){
        document.getElementById('h').checked = false; 
        schoolGradeVar=null;
        Search();
      }
      else{
      schoolGradeVar='H';
      Search();
      }
    });
    $('#m').click(function(){
      buttoncolor();
      if (schoolGradeVar =='M'){
        document.getElementById('m').checked = false; 
        schoolGradeVar=null;
        Search();
      }
      else{
      schoolGradeVar='M';
      Search();
      }
    });
    $('#e').click(function(){
      buttoncolor();
      if (schoolGradeVar =='E'){
        document.getElementById('e').checked = false; 
        schoolGradeVar=null;
        Search();
      }
      else{
      schoolGradeVar='E';
      Search();
      }
    });
    //school rating filter options
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
    for(var i=0;i<schoolArray.length;i++){
      sync.push(schoolArray[i].sys_sch);
    }
    
});
function resize(){
  if(window.innerWidth<1050 & SearchResultToggle){
    $("#container-fluid").css("height","70vh");
    $(".filter-bar").css("height","70vh");
  } 
  else{
    $("#container-fluid").css("height","90vh");
    $(".filter-bar").css("height","90vh");
  }                          
}
//These are all of the marker functions that we will need provided by the google API documentation 
function addMarker(position, sync,name, constent, URL, next) {
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
   
  });
  
  latestposition=marker.getPosition();
  markers.push(marker);
  infoList.push(infowindow);

  marker.addListener("mouseover", () => {
  marker.setLabel(name);
  marker.setAnimation(google.maps.Animation.BOUNCE);
  marker.setZIndex(100);
  });
  marker.addListener("mouseout", () => {
   marker.setLabel(null);
   marker.setAnimation(null);
   if(markerZscoreToggle != marker.title){
    marker.setZIndex(0);
    }
    });
  //this is our listener that selects which search result matches the marker that was just clicked 
  //and then zoom in on it, centers the map, and scrolls to the item in our search results
  marker.addListener("click", () => {
    var setZoom=12;
    var getZoom=map.getZoom();
    for (let i = 0; i < markers.length; i++) {
      markers[i].setZIndex(0);
    }
    markerZscoreToggle=sync;
    marker.setZIndex(90);
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
  next();
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
//Search function with if statements for each possible filter combination.
// t= textsearch d=discticts m=misc r=rating g=gradelevel
//t d m td tm dm tdm tg tr tgr dg dr dgr mg mr mgr tdg tdr tdgr tmg tmr tmgr dmg dmr dmgr tdmg tdmr tdmgr =28 different possible combinations minus the ones without m d t because we do not allow search without them 
function Search(){
  searchArray=[];
  $(".SearchResultsTabs").show();
  removeSearch()
  $(".SearchResultBar").show();
  SearchResultToggle=true;
 
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
  SearchResultToggle=false;
  deleteMarkers();
  resize();
}else if(schoolGradeVar !=null & searchTxt == null & discValue ==null & schoolRatingVar == null & miscellaneousSearch ==null) { 
  $(".SearchResultBar").hide();
  SearchResultToggle=false;
  deleteMarkers();
  resize();
}else if(schoolGradeVar !=null & searchTxt == null & discValue ==null & schoolRatingVar != null & miscellaneousSearch ==null) { //just to catch without m t d
  $(".SearchResultBar").hide();
  SearchResultToggle=false;
  deleteMarkers();
  resize();
}else if(schoolGradeVar ==null & searchTxt == null & discValue ==null & schoolRatingVar == null & miscellaneousSearch ==null) { //we only allow a marker to pop up if either searchtxt, discValue, or misc are not null
  $(".SearchResultBar").hide();
  SearchResultToggle=false;
  deleteMarkers();
  resize();
}else{
  console.log('error, uncaught logic:' + schoolGradeVar +" "+ searchTxt +" "+ discValue +" "+ schoolRatingVar +" "+  miscellaneousSearch);
  $(".SearchResultBar").hide();
  SearchResultToggle=false;
  deleteMarkers();
  resize();
}
}

//this makes the search results page and processes the search result information and then sends it out 
function renderSearch(searchArray){
  deleteMarkers();
  addresses=[];
  nextaddress=-1;
  infoArray =[];
 
  
  var bool=false;
  var template =$('#searchResultTemp').html();
  var text = Mustache.render(template, {arr:searchArray});
  $('.searchContainer').append(text);
  if(searchArray.length > 200){
    delay=0;
  } else if(searchArray.length > 50){
    delay=20;
  }else{
    delay=50;
  }
 for(var i=0; i < searchArray.length; i++){     //loops through the search array to get the URL, template, and everything else

 var result = searchArray[i].SchoolName.replace(/\b(The|the|of|Of|for|For|at|At|A)\b/g, " "); //uses regex to get rid of the/of/for/punctuation/and replace any spaces with -
 result=result.replace(/^\W+/g, "");          //this makes sure that the names do not begin with a blank space
 result=result.replace(/\d*\.\d*/g, "");      //this deletes periods for names like S.T.E.M or D.R.
 result=result.replace(/\d*\/\d*/g, ""); 
 result=result.replace(/\W+/g, " ");          //this makes sure that there are no double spaces or other punctuation 
 result = result.replace(/ /g, "-");        //replaces all spaces with - in order to make a valid link
 var but ="<a href='https://schoolgrades.georgia.gov/"+result+"'> <button class='MoreInfo'>click here</button></a>";

 var template =$('#windowInfo').html();
 var infowindow = Mustache.render(template, {arr:searchArray[i]});
 infowindow += but;
 
 for(var x=0; x < getLocation.length; x++){
   if(searchArray[i].sys_sch==getLocation[x]._key){
    addresses.push({ lat: parseFloat(getLocation[x].lat), lng: parseFloat(getLocation[x].lng)});
    bool=true;
   }
   }
   if(bool==false){
     console.log(searchArray[i].sys_sch);
     var addy= searchArray[i].Street +" "+ searchArray[i].City + " GA";
     geocoder.geocode( { 'address': addy }, function(results, status) {
     console.log(results[0].geometry.location);
     addresses.push(results[0].geometry.location);
     });
   }
 infoArray.push(infowindow);
 }
 $("#total").html(addresses.length)
 theNext();//scary
}

//this uses recursion and a timeout function to code all of the addresses and get around the 10 a second rule that google geocoding has
function theNext(){
  if(nextaddress < addresses.length-1 ){
  timer = setTimeout( function(){
    addMarker(addresses[nextaddress], searchArray[nextaddress].sys_sch , searchArray[nextaddress].SchoolName,
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
//this function decides what to do based on if your search has any results and how to control the zoom function 
function decideSearchAction(){
  if(searchArray.length> 1000){
    $(".SearchResultBar").hide();
    SearchResultToggle=false;
    deleteMarkers();
    resize();
    alert("Search Results Too Large");
  }else if(searchArray.length==0){
    $(".SearchResultBar").hide();
    SearchResultToggle=false;
    deleteMarkers();
    resize();
    alert("There are no schools that match your search");
  }else if(discValue != null){
  renderSearch(searchArray);
  DiscZoom();
  resize();
  }
  else{
    renderSearch(searchArray);
    nonDiscZoom();
    resize();
  }
}

//zooms in on the disctrict being searched
function DiscZoom(){
    map.setCenter(addresses[addresses.length-1]);
    map.setZoom(10);
}
//shows the whole map
function nonDiscZoom(){
  var one =32.744164;
  var two =-83.498423;
  map.setCenter({lat:  parseFloat(one), lng: parseFloat(two)});
  map.setZoom(7);
}
//takes all of the districts names and adds them to the options
function districtOptions(){
  for(var i=0; i < districtArray.length; i++){
    $('.selectOptions').append('<option class="district" id='+districtArray[i].SystemId+' value='+districtArray[i].SystemId +'>'+ districtArray[i].SystemName +'</option>');
  };
  districtArray=[];
}

//This just changes the button color for the Grades Filter
function buttoncolor(){
  $('.h').css('background-color','white');
  $('.m').css('background-color','white');
  $('.e').css('background-color','white');
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
  //this is our listener that listens when you click on the map and then searches whatever county it is in
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

  toggleDOMButton.textContent = "Map On/Off";
  toggleDOMButton.classList.add("custom-map-control-button");
  toggleButton.addEventListener("click", () => {
    overlay.toggle();
  });
  toggleDOMButton.addEventListener("click", () => {
    overlay.toggleDOM(map);
  });
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
}
