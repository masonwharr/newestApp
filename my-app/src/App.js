import React, { Component } from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
import './App.css';
import {poi} from './points.js'
/*global google*/
/*global i*/
/*global n*/
/*global $*/

//Sets up map interface.
ReactDOM.render(
  <div id="nameMain">
    <h1>Neighborhood map</h1>
    <span className="listView" tabIndex="8">List View</span>
  </div>,
  document.getElementById("nameContainer")
);

const element = <div className="menu"><h1 className="resetfilters" tabIndex="2" role="button">Reset Filters</h1><h1 className="places" tabIndex="3" role="button" id="Food">UDF</h1><h1 className="places" tabIndex="4" role="button" id="Food">My first job at Richie's</h1><h1 className="places" tabIndex="5" role="button" id="Nature">The Scioto River</h1><h1 className="places" tabIndex="6" role="button" id="Events">Pumpkin Show</h1><h1 className="places" tabIndex="7" role="button" id="Food">Circleville's Juice Bar</h1></div>;
ReactDOM.render(
 element,
  document.getElementById("menu")
);

const btns = <div><div onClick={toggleMenu} className="typeMenuBtn" tabIndex="1"><span >Type</span></div><p className="menuType hide" tabIndex="9">Food</p><p className="menuType hide" tabIndex="10">Nature</p><p className="menuType hide" tabIndex="11">Events</p></div>;
ReactDOM.render(
  btns,
  document.getElementById("typeBox")
);


// Map element.
class Choice extends React.Component {
  render() {
    return <div id="map" />;
  }
}

var markers = [];
var i = 0;
var n = 0;
var removedMarkers = [];

ReactDOM.render(<Choice />, document.getElementById("mapArea"));

function toggleMenu(){
  if ($('.menuType').hasClass('hide')){
   $('.menuType').fadeIn(1000, function() { 
  $('.menuType').removeClass('hide');
});
  }

else{
   $('.menuType').fadeOut(1000, function() { 
  $('.menuType').addClass('hide');
});
}

}

function openingImageLinks(imgUrl, divWindow, lat, lng){
  console.log(imgUrl)
  //All in one function the Url is made from the API's instructions using the url to the web site. Then the API brings back
  // an image after the fetch api makes request and checks it is working.
  var url = "";
  url = 'https://api.onwater.io/api/v1/results/' + lat + ',' + lng +'?access_token=JsC9DrxPETHrLB_ETKyu';

  console.log(url)

// //Fetch api 
fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonResponse) {

    console.log(jsonResponse.water)
    var isOnWater = "";
    if(jsonResponse.water === true){
    var isOnWater = `<p>This location is on water according to <a href="https://onwater.io/" target="_blank">https://onwater.io/</a></p>`;
    }
    else if (jsonResponse.water === false){
    var isOnWater = `<p>This location is not on water according to <a href="https://onwater.io/" target="_blank">https://onwater.io/</a></p>`;
    }
    else{
      alert('Error. Retry or try again later.')
    }

                       $('.infoWindow').each(function() {

if($(this)["0"].id === imgUrl){

$(this).append(isOnWater);
}

});
  })
    .catch(function(error) {
    console.log('Request failed', error)
    alert('Error. Retry or try again later.')
  });
 
}


//Initializing map for google maps API
function initMap() {

  
  var cville = {lat: 39.6006, lng:-82.9460};
  var richies = {lat: 39.600571,lng: -82.945586};
  var map = new google.maps.Map(
      document.getElementById('map'), {
          zoom: 16,
          gestureHandling: 'none',
          zoomControl: false,
          center: cville});


  // The marker, positioned at Uluru
  var locationMarker = new google.maps.Marker({position: cville, map: map});


  
console.log(poi);
  
        // Create markers.
      for (i=0; i < poi.length; i++){
       
      var point = poi[i];
        
      var location = new google.maps.LatLng(point['lat'], point['lng']);
        
      var marker = new google.maps.Marker({
          position: location,
          map: map,
          desc:point['desc'],
          title: point['name'],
          key:point['key'],
          mapLocation:point['mapLocation'],
          url:point['url'],
          lat:point.lat,
          lng:point.lng,
          urlId:point['urlId']
      });
         markers.push(marker);
        console.log(markers);

$('.menuType').off().on().click(function(){
  console.log($(this)["0"].textContent)
  markersCheck($(this)["0"].textContent);
});   
        
        function returningMarkers() {
         for (n=0; n < removedMarkers.length; n++){
           console.log(removedMarkers)
     removedMarkers[n].setMap(map);
     $('.places').removeClass('hideListItems');
  }
     }

     $('.resetfilters').off().on().click(function(){
returningMarkers();
     });
        $('.places').off().on().click(function(){
          returningMarkers();
          var placeText = $(this)["0"].innerText;
          $('.places').addClass('hideListItems');
          $(this).removeClass('hideListItems');
          for (i=0; i < markers.length; i++){
  if (markers[i].title === placeText){
    console.log("MATCH")
    markers[i].setAnimation(google.maps.Animation.BOUNCE);
    markers[i].setAnimation(null);
    openingImageLinks(markers[i].url, $(markers[i]), markers[i].lat, markers[i].lng)
    
    var filterPoint =
         `<div class="infoWindow" id="${markers[i].url}">
          <h1>${markers[i].title}</h1>
           <p>${markers[i].desc}</p>
           <p>${markers[i].mapLocation}</p>
                 </div>`;
    
              
                     var filterInfowindow = new google.maps.InfoWindow({
          content: filterPoint
        });
    filterInfowindow.open(map, markers[i]);
  }
  else{
    removedMarkers.push(markers[i]);
    markers[i].setMap(null);
    console.log(removedMarkers);
  }
          }
          
          
        });
        
// Checks all markers if they match the type selected, if not, it's pushed to an array.
function markersCheck(type) {
  
  returningMarkers();

  $('.places').each(function() {
if($(this)["0"].id === type){

}
else{
  console.log('no match', $(this))
  $(this).addClass('hideListItems');
  }
  });

  
for (i=0; i < markers.length; i++){
  if (markers[i].key === type){
  }
  else{
    removedMarkers.push(markers[i]);
    markers[i].setMap(null);
  
    console.log(removedMarkers);
  }
  
}
}  


        // Info window functionality
            window.google.maps.event.addListener(marker, 'click', function () {
              openingImageLinks(this.url, $(this), this.lat, this.lng)
              console.log(this, $(this))
              
               var point =
         `<div class="infoWindow" id="${this.url}">
          <h1>${this.title}</h1>
           <p>${this.desc}</p>
           <p>${this.mapLocation}</p>
                 </div>`;




              
                     var infowindow = new google.maps.InfoWindow({
          content: point
        });
              var thisForAnimation = this;
              
              infowindow.open(map, this);
              
              
                  thisForAnimation.setAnimation(google.maps.Animation.BOUNCE);
              setTimeout(function(){ thisForAnimation.setAnimation(null); }, 450);
              
    });
      }


  locationMarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')

}
setTimeout(function(){
  initMap();
//Checks if map is defined
  if(typeof map === 'undefined'){
  alert('Refresh page or try again later. Loading maps failed.')
}
else{
}

  console.log('It Ran');
},700);

$('.listView').click(function(){
    $('html,body').animate({
        scrollTop: $(".typeMenuBtn").offset().top},
        'slow');
});






  export default Choice;