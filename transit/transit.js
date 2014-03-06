var map;

function userPosition(position) {
   	var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
   	var markerOptions = {
   		position: userLatLng,
   		map: map,
       	title: 'Your Location'
   	}
   	var marker = new google.maps.Marker(markerOptions);
   	var infowindow = new google.maps.InfoWindow({
    	content: "I am here"
  	});

   	marker.setMap(map);
   	google.maps.event.addListener(marker, 'click', function() {
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

    navigator.geolocation.getCurrentPosition(userPosition, geoLocationError);

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
			var stopCoords = new google.maps.LatLng(lat, lng);
		   	var markerOptions = {
		   		position: stopCoords,
		   		map: map,
		       	title: dest
		   	}

		   	var marker = new google.maps.Marker(markerOptions);
		   	var infowindow = new google.maps.InfoWindow({
		    	content: dest
		    });

		   	marker.setMap(map);
		   	google.maps.event.addListener(marker, 'click', function() {
		    	infowindow.open(map, marker);
		  	});
		//}
   }
   else if (xhr.readyState == 4 && xhr.status == 500) {
		scheduleDom = document.getElementById("schedule");
		scheduleDom.innerHTML = "<p>Failure</p>";
	}
}


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
