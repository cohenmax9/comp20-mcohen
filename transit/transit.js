var map;
var infowindow;
var userLat = 0;
var userLong = 0;

function userPosition(position) {
	userLat = position.coords.latitude;
	userLong = position.coords.longitude
   	var userLatLng = new google.maps.LatLng(userLat, userLong);
   	var markerOptions = {
   		position: userLatLng,
   		map: map,
       	title: 'Your Location'
   	}
   	var marker = new google.maps.Marker(markerOptions);

   	marker.setMap(map);
   	google.maps.event.addListener(marker, 'click', function() {
   		infowindow.setContent("You are here");
    	infowindow.open(map,marker);
  	});
}

function geoLocationError() {
	alert('Geolocation not supported');
}

function initialize() {
    var us = new google.maps.LatLng(42.3581, -71.0636);
    var myOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: us
    }
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    var infoOptions = {
    	content: "Hey"
    };

    navigator.geolocation.getCurrentPosition(userPosition, geoLocationError);
    infowindow = new google.maps.InfoWindow(infoOptions);

    getTrainData();   	
}


var xhr;

function getTrainData() {
	xhr = new XMLHttpRequest();
	xhr.open("get","http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
	xhr.onreadystatechange = createMarkers;
	xhr.send(null);
}

function createMarkers() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		scheduleData = JSON.parse(xhr.responseText);
		console.log(scheduleData);

		//for (var i = 0; i < scheduleData.length; i++) {
				//WHY DO SOME OBJECTS IN SCHEDULE NOT HAVE A POSITION OBJECT?
				//WHY ARE THE COORDS OF THE STOPS WRONG???
			dest = scheduleData.schedule[14].Destination;
			lat = scheduleData.schedule[14].Position.Lat;
			lng = scheduleData.schedule[14].Position.Long;
			arrivalTime = scheduleData.schedule[14].Predictions[0].Seconds;

			var stopCoords = new google.maps.LatLng(lat, lng);
		   	var markerOptions = {
		   		position: stopCoords,
		   		map: map,
		       	title: dest
		   	}

		   	var marker = new google.maps.Marker(markerOptions);
		   	var dist = distanceToStation(lat, lng);

		   	google.maps.event.addListener(marker, 'click', function() {
		    	infowindow.setContent(dest + ": " + secsToMins(arrivalTime, 0) + 
		    		" until train arrives." + "The train station is " +
		    		dist + " miles away from you.");
		    	infowindow.open(map, this);
		    });

		   	marker.setMap(map);
		   	google.maps.event.addListener(marker, 'click', function() {
		    	infowindow.open(map, marker);
		  	});
		//}
   }
   else if (xhr.readyState == 4 && xhr.status == 500) {
		scheduleDom = document.getElementById("map_canvas");
		scheduleDom.innerHTML = "<h1>Failure to load trains. Server Error</h1>";
	}
}

function secsToMins(secs, mins) {
	if (secs < 59) {
		if (secs <= 9) {
			return mins + ":" + "0" + secs;
		}
		else {
			return mins + ":" + secs;
		}
	}
	else {
		mins += 1;
		secs -= 60;
		return secsToMins(secs, mins);
	}
}

function toRadians(x) {
   return x * Math.PI / 180;
}

//messed up because the userPosition function doesn't set userLat and userLong
//until after distanceToStation is callled, so get numbers relative to (0,0)
/*function distanceToStation (stationLat, stationLong) {
	var earthRadius = 3959; // km 
	var latPos = userLat - stationLat;
	var latDist = toRadians(latPos);  
	var longPos = userLong - stationLong;
	var longDist = toRadians(longPos);
	console.log(latPos);
	console.log(latDist);
	console.log(longPos);
	console.log(longDist);

	var a = Math.sin(latDist / 2) * Math.sin(latDist / 2) + 
	                Math.cos(toRadians(stationLat)) * Math.cos(toRadians(userLat)) * 
	                Math.sin(longDist / 2) * Math.sin(longDist / 2);  
	alert(a);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	var d = earthRadius * c; 

	//alert(d);
	return d;
}*/


/*
// 	ZOOM TO FIT ALL MARKERS ON GOOGLE MAPS API V3

//  Make an array of the LatLng's of the markers you want to show
var LatLngList = new Array (new google.maps.LatLng (52.537,-2.061), new google.maps.LatLng (52.564,-2.017));
//  Create a new viewpoint bound
var bounds = new google.maps.LatLngBounds ();
//  Go through each...
for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
  //  And increase the bounds to take this point
  bounds.extend (LatLngList[i]);
}
//  Fit these bounds to the map
map.fitBounds (bounds);
*/
/*
	if (xhr.readyState == 4 && xhr.status == 200) {
		scheduleData = JSON.parse(xhr.responseText);
		scheduleDom = document.getElementById("map_canvas");
		//var marker = new google.maps.Marker({
		//			position: new google.maps.LatLng(scheduleData['Lat','Long'],
		//			title: scheduleData['Stop']
		//		});
		strings = JSON.stringify(scheduleData);
		console.log(scheduleData.schedule[0]);
	}
	else if (xhr.readyState == 4 && xhr.status == 500) {
		scheduleDom = document.getElementById("schedule");
		scheduleDom.innerHTML = "<p>Failure</p>";
	}
	
}

*/
google.maps.event.addDomListener(window, 'load', initialize);
