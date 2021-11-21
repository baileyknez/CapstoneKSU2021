var nextadd= 2190;
var addresses2=[];
var sync2=[];
var delay2=100;
var file;
var data="";
var newdata;
var start='{';
var end='}';
var addressToLngLt;
$(document).ready(function(){
   
    download();
});
function download(){
    for(var i=0;i<schoolArray.length;i++){
       addresses2.push(schoolArray[i].Street +" "+ schoolArray[i].City + " GA" );
        sync2.push(schoolArray[i].sys_sch);
    }
    recursive();
}
function codeFile(addy, sync, back ) {
    geocoder.geocode( { 'address': addy}, function(results, status) {
      console.log(status)
      if (status+"" == "OK") {
        console.log(""+results[0].geometry.location);
        addressToLngLt =""+results[0].geometry.location;
        var floats = addressToLngLt.match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); });
        newdata ="'"+sync+"':{'lat':"+floats[0]+", 'lng':"+floats[1]+"},";
        data += newdata;
      }else{ 
        if (status+"" == 'OVER_QUERY_LIMIT') {
          nextadd--;
          delay2+=1;
          var msg = 'address="' + addy + '" error=' +status+ '(delay='+delay2+'ms) arrayNum:'+nextadd;
          console.log(msg);
        } else {
          var msg = 'address="' + addy + '" error=' +status+ '(delay='+delay2+'ms) arrayNum:' +nextadd;
          console.log(msg);
        }   
      }
    });
    back(); 
}

function recursive(){
    if(nextadd < addresses2.length-1 ){
      console.log(nextadd);
    timer = setTimeout( function(){
      codeFile(addresses2[nextadd], sync2[nextadd], recursive);
    }, delay2);
    
      
      console.log(data);
      nextadd++;
    } 
    else{
    clearTimeout(timer);
    console.log("done loading");
    file = start +data+ end;
    finish("findSchools.json", file);
    }
  }
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
  function finish(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }