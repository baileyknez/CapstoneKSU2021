// Google Maps API key AIzaSyD__zNryK3aQH46g_4ArIrk4zYdhHr7pAo 
//https://schoolgrades.georgia.gov/api/action/datastore/search.json?resource_id=34a95003-f3fb-4dce-af6c-8f69b18617db&limit=5"

var map;
$(document).ready(function(){
    $GetDistrictList();
});

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:  33.753746, lng: -84.9001},
    zoom: 8
    });
}
$GetDistrictList = function(){
    console.log("so far so good");
    $.getJSON("https://data.georgia.gov/api/action/datastore/search.json?resource_id=fb961222-b9dc-48d5-936f-2ecf86882b7d&limit=5", function(response){        
    console.log(response);
    }).catch(function(error){
        console.log('Request Failed', error)
    });
}
