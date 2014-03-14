var blue = new Array(12);
var red = new Array(22);
var orange = new Array(19);

blue['Wonderland'] = [42.41342, -70.991648];
blue['Revere Beach'] = [42.40784254, -70.99253321];
blue['Beachmont'] = [42.39754234, -70.99231944];
blue['Suffolk Downs'] = [42.39050067, -70.99712259];
blue['Orient Heights'] = [42.386867, -71.004736];
blue['Wood Island'] = [42.3796403, -71.02286539];
blue['Airport'] = [42.374262, -71.030395];
blue['Maverick'] = [42.36911856, -71.03952958];
blue['Aquarium'] = [42.359784, -71.051652];
blue['State Street'] = [42.358978, -71.057598];
blue['Government Center'] = [42.359705, -71.059215];
blue['Bowdoin'] = [42.361365, -71.062037];
red['Alewife'] = [42.395428, -71.142483];
red['Davis'] = [42.39674, -71.121815];
red['Porter Square'] = [42.3884, -71.119149];
red['Harvard Square'] = [42.373362, -71.118956];
red["Central Square"] = [42.365486, -71.103802];
red['Kendall/MIT'] = [42.36249079, -71.08617653];
red["Charles/MGH"] = [42.361166, -71.070628];
red['Park Street'] = [42.35639457, -71.0624242];
red['Downtown Crossing'] = [42.355518, -71.060225];
red['South Station'] = [42.352271, -71.055242];
red['Broadway'] = [42.342622, -71.056967];
red['Andrew'] = [42.330154, -71.057655];
red['JFK/UMass'] = [42.320685, -71.052391];
red['North Quincy'] = [42.275275, -71.029583];
red['Wollaston'] = [42.2665139, -71.0203369];
red['Quincy Center'] = [42.251809, -71.005409];
red['Quincy Adams'] = [42.233391, -71.007153];
red['Braintree'] = [42.2078543, -71.0011385];
red['Savin Hill'] = [42.31129, -71.053331];
red['Fields Corner'] = [42.300093, -71.061667];
red['Shawmut'] = [42.29312583, -71.06573796];
red['Ashmont'] = [42.284652, -71.064489];
orange['Oak Grove'] = [42.43668, -71.071097];
orange['Malden Center'] = [42.426632, -71.07411];
orange['Wellington'] = [42.40237, -71.077082];
orange['Sullivan'] = [42.383975, -71.076994];
orange['Community College'] = [42.373622, -71.069533];
orange['North Station'] = [42.365577, -71.06129];
orange['Haymarket'] = [42.363021, -71.05829];
orange['State Street'] = [42.358978, -71.057598];
orange['Downtown Crossing'] = [42.355518, -71.060225];
orange['Chinatown'] = [42.352547, -71.062752];
orange['Tufts Medical'] = [42.349662, -71.063917];
orange['Back Bay'] = [42.34735, -71.075727];
orange['Mass Ave'] = [42.341512, -71.083423];
orange['Ruggles'] = [42.336377, -71.088961];
orange['Roxbury Crossing'] = [42.331397, -71.095451];
orange['Jackson Square'] = [42.323132, -71.099592];
orange['Stony Brook'] = [42.317062,-71.104248];
orange['Green Street'] = [42.310525, -71.107414];
orange['Forest Hills'] = [42.300523, -71.113686];


var mbta = {'blue': blue, 'red': red, 'orange': orange};

var map;
var infowindow;
var xhr;
var scheduleData;
var line;
var userLat = 0;
var userLong = 0;

function userPosition(position) {
	userLat = position.coords.latitude;
	userLong = position.coords.longitude;
	var content = findClosestStation();

   	var userLatLng = new google.maps.LatLng(userLat, userLong);
   	var markerIcon = new google.maps.MarkerImage("direction_down.png");
   	var markerOptions = {
   		position: userLatLng,
   		map: map,
       	title: 'Your Location',
       	icon: markerIcon
   	};

   	var marker = new google.maps.Marker(markerOptions);

   	marker.setMap(map);
   	map.panTo(userLatLng);

   	infowindow.setContent(content);
   	infowindow.open(map, marker);

   	google.maps.event.addListener(marker, 'click', function() {
   		infowindow.setContent(content);
    	infowindow.open(map, marker);
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
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    getTrainData();

    infowindow = new google.maps.InfoWindow();
}



function getTrainData() {
	xhr = new XMLHttpRequest();
	xhr.open("get","http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
	xhr.onreadystatechange = insertDataIntoInfoWindow;
	xhr.send(null);
}

function insertDataIntoInfoWindow() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		scheduleData = JSON.parse(xhr.responseText);
		line = scheduleData.line;
    	navigator.geolocation.getCurrentPosition(userPosition, geoLocationError, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});

		createMarkers(line);
		drawLines(line);
    }
    else if (xhr.readyState == 4 && xhr.status == 500) {
		scheduleDom = document.getElementById("map_canvas");
		scheduleDom.innerHTML = "<h1>Failure to load trains. Server Error</h1>";
	}	    
}

function createMarkers(line) {
	var markerIcon;
	var stations = Object.keys(mbta[line]);

	if (line == "red") {
		markerIcon = new google.maps.MarkerImage("red.png");
	}
	else if (line == "blue") {
		markerIcon = new google.maps.MarkerImage("blue.png");
	}
	else {
		markerIcon = new google.maps.MarkerImage("orange.png");
	}

	for (i = 0; i < mbta[line].length; i++) {
		var lat = mbta[line][stations[i]][0];
		var lng = mbta[line][stations[i]][1];
		var stopCoords = new google.maps.LatLng(lat, lng);
	   	var markerOptions = {
	   		position: stopCoords,
	   		map: map,
	       	title: stations[i],
	       	icon: markerIcon
	   	};

	   	var marker = new google.maps.Marker(markerOptions);
	   	marker.setMap(map);

	   	addInfoWindowToMarker(stations[i], marker);
	}
}

function addInfoWindowToMarker(station, marker) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(displaySchedule(station));
		infowindow.open(map, this);
	});
}

function drawLines(line) {
	var stations = Object.keys(mbta[line]);
	var tlines;
	var curStation;

	if (line == 'red') {
		lineColor = '#FF0000';
	}
	else if (line == 'blue') {
		lineColor = '#0000FF';
	}
	else {
		lineColor = '#FFA500';
	}

	if (line == 'red') {
		tlines = new Array(17);
		for (i = 0; i <= 17; i++) {
			curStation = stations[i];
			tlines[i] = mbta[line][curStation]; 
		}

		var splitRedLine = new Array(stations.length - 17);
		splitRedLine[0] = mbta[line]['JFK/UMass'];
		for (i = 1; i < stations.length - 17; i++) {
			curStation = stations[i + 17];
			splitRedLine[i] = mbta[line][curStation];
		}

		var splitRedLinePath = new Array(splitRedLine.length);
		for (i = 0; i < splitRedLinePath.length; i++) {
			var lat = splitRedLine[i][0];
			var lng = splitRedLine[i][1];
			splitRedLinePath[i] = new google.maps.LatLng(lat, lng);
		}

		var splitRedLineStationsPath = new google.maps.Polyline({
			path: splitRedLinePath,
			geodesic: true,
			strokeColor: lineColor,
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		splitRedLineStationsPath.setMap(map);
	}
	else {
		tlines = new Array(stations.length);
		for (i = 0; i < stations.length; i++) {
			curStation = stations[i];
			tlines[i] = mbta[line][curStation]; 
		}
	}
	
	var linePath = new Array(tlines.length);
	for (i = 0; i < tlines.length; i++) {
		var lat = tlines[i][0];
		var lng = tlines[i][1];
		linePath[i] = new google.maps.LatLng(lat, lng);
	}

	var stationPath = new google.maps.Polyline({
		path: linePath,
		geodesic: true,
		strokeColor: lineColor,
		strokeOpacity: 1.0,
		strokeWeight: 2
	});

	stationPath.setMap(map);
}

function displaySchedule(station) {
	var content = "<b>" + station + "</b>";
	content += "<table><tr><th>Line</th><th>Trip #</th><th>Station</th><th>Time</th></tr>"; 
	for (var i = 0; i < scheduleData.schedule.length; i++) {
		for (var j = 0; j < scheduleData.schedule[i].Predictions.length; j++) {
			if (scheduleData.schedule[i].Predictions[j].Stop == station) { 
				content += "<tr><td>" + scheduleData.line + "</td><td>" + scheduleData.schedule[i].TripID + 
					   	   "</td><td>" + scheduleData.schedule[i].Destination + "</td><td>" + secsToMins(scheduleData.schedule[i].Predictions[j].Seconds, 0) + "</td></tr>";
			}
		}
	}
	
	content += "</table>";
	return content;
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

function findClosestStation() {
	var stations = Object.keys(mbta[line]);
	var closestDist = Number.POSITIVE_INFINITY;
	var closestStation = "";

	for (var i = 0; i < stations.length; i++) {
		var curDist = distanceToStation(mbta[line][stations[i]][0], mbta[line][stations[i]][1]);
		if (curDist < closestDist) {
			closestDist = curDist;
			closestStation = stations[i];
		}
	}

	return "You are here, which is " + closestDist + " from the closest " + line + " line station, " + closestStation + ".";
}

function distanceToStation (stationLat, stationLong) {
	var earthRadius = 6371; // miles 
	var latPos = stationLat - userLat;
	var latDist = toRadians(latPos);  
	var longPos = stationLong - userLong;
	var longDist = toRadians(longPos);

	var a = Math.sin(latDist / 2) * Math.sin(latDist / 2) + 
	                Math.cos(toRadians(userLat)) * Math.cos(toRadians(stationLat)) * 
	                Math.sin(longDist / 2) * Math.sin(longDist / 2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	var d = earthRadius * c; 

	d *= 0.621371; //convert from km to miles
	d = (Math.round(d * 100) / 100);
	return d;
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


