var blue = new Array(12);
var red = new Array(22);
var orange = new Array(19);
blue['Airport'] = [42.374262, -71.030395];
blue['Aquarium'] = [42.359784, -71.051652];
blue['Beachmont'] = [42.39754234, -70.99231944];
blue['Bowdoin'] = [42.361365, -71.062037];
blue['Government Center'] = [42.359705, -71.059215];
blue['Maverick'] = [42.36911856, -71.03952958];
blue['Orient Heights'] = [42.386867, -71.004736];
blue['Revere Beach'] = [42.40784254, -70.99253321];
blue['State Street'] = [42.358978, -71.057598];
blue['Suffolk Downs'] = [42.39050067, -70.99712259];
blue['Wonderland'] = [42.41342, -70.991648];
blue['Wood Island'] = [42.3796403, -71.02286539];
red['Alewife'] = [42.395428, -71.142483];
red['Andrew'] = [42.330154, -71.057655];
red['Ashmont'] = [42.284652, -71.064489];
red['Braintree'] = [42.2078543, -71.0011385];
red['Broadway'] = [42.342622, -71.056967];
red["Central Square"] = [42.365486, -71.103802];
red["Charles/MGH"] = [42.361166, -71.070628];
red['Davis'] = [42.39674, -71.121815];
red['Downtown Crossing'] = [42.355518, -71.060225];
red['Fields Corner'] = [42.300093, -71.061667];
red['Harvard Square'] = [42.373362, -71.118956];
red['JFK/UMass'] = [42.320685, -71.052391];
red['Kendall/MIT'] = [42.36249079, -71.08617653];
red['North Quincy'] = [42.275275, -71.029583];
red['Park Street'] = [42.35639457, -71.0624242];
red['Porter Square'] = [42.3884, -71.119149];
red['Quincy Adams'] = [42.233391, -71.007153];
red['Quincy Center'] = [42.251809, -71.005409];
red['Savin Hill'] = [42.31129, -71.053331];
red['Shawmut'] = [42.29312583, -71.06573796];
red['South Station'] = [42.352271, -71.055242];
red['Wollaston'] = [42.2665139, -71.0203369];
orange['Back Bay'] = [42.34735, -71.075727];
orange['Chinatown'] = [42.352547, -71.062752];
orange['Community College'] = [42.373622, -71.069533];
orange['Downtown Crossing'] = [42.355518, -71.060225];
orange['Forest Hills'] = [42.300523, -71.113686];
orange['Green Street'] = [42.310525, -71.107414];
orange['Haymarket'] = [42.363021, -71.05829];
orange['Jackson Square'] = [42.323132, -71.099592];
orange['Malden Center'] = [42.426632, -71.07411];
orange['Mass Ave'] = [42.341512, -71.083423];
orange['North Station'] = [42.365577, -71.06129];
orange['Oak Grove'] = [42.43668, -71.071097];
orange['Roxbury Crossing'] = [42.331397, -71.095451];
orange['Ruggles'] = [42.336377, -71.088961];
orange['State Street'] = [42.358978, -71.057598];
orange['Stony Brook'] = [42.317062,-71.104248];
orange['Sullivan'] = [42.383975, -71.076994];
orange['Tufts Medical'] = [42.349662, -71.063917];
orange['Wellington'] = [42.40237, -71.077082];


var mbta = {'blue': blue, 'red': red, 'orange': orange};

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
    	content: ""
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
		console.log(mbta);

		var line = scheduleData.line;
		console.log(scheduleData.schedule.length);

		for (i = 0; i < scheduleData.schedule.length; i++) {	
			var dest = scheduleData.schedule[i].Destination;
			var latlong = mbta[line][dest]
			console.log(latlong);
			var lat = latlong[0];
			var lng = latlong[1];
			for (j = 0; j < scheduleData.schedule.Predictions.length; j++) {
			var arrivalTime = scheduleData.schedule[i].Predictions[j].Seconds;

			var stopCoords = new google.maps.LatLng(lat, lng);
		   	var markerOptions = {
		   		position: stopCoords,
		   		map: map,
		       	title: dest
		   	}

		   	var marker = new google.maps.Marker(markerOptions);
		   	//var dist = distanceToStation(lat, lng);

		   	google.maps.event.addListener(marker, 'click', function() {
		    	infowindow.setContent(dest + ": " + secsToMins(arrivalTime, 0) + 
		    		" until train arrives." + "The train station is " +
		    		/*dist +*/ " miles away from you.");
		    	infowindow.open(map, this);
		    });

		   	marker.setMap(map);
		   	google.maps.event.addListener(marker, 'click', function() {
		    	infowindow.open(map, marker);
		  	});
		}
		}
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


