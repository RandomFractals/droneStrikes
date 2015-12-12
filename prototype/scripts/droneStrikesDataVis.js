var map;
var droneStrikes = new DroneStrikes();

$(function() {
	
	// create leaflet map
	map = L.map('map');
	//map.locate({setView: true, maxZoom: 4}); // for geo-loc based on ip later
	resetMapView();
	
	// create map tiles
	var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
	//var tiles = new L.StamenTileLayer('watercolor');
	map.addLayer(tiles);	
	
	// create markers
	var markers = new L.MarkerClusterGroup();
	var markerList = [];
	
	// get data
	var dataUrl = 'http://api.dronestre.am/data';
	$.get(dataUrl).done(loadData).fail(dataLoadError);
	
	function loadData(hitData) {
		droneStrikes.addHits(hitData.strike);		
		console.log(droneStrikes.logStats());
		
		// add map markers
		var marker;
		for (var i=0; i<droneStrikes.hitList.length; i++) {
			marker = L.marker([
				droneStrikes.hitList[i].latitude,
				droneStrikes.hitList[i].longitude
			]);
			markers.addLayer(marker);
		}		
		map.addLayer(markers);
		
		showStats();
	}
	
	function dataLoadError() {
		console.log('data load error');
		// show data load error msg
		$('#dataMessage').text('Failed to load drone strikes data. Check data source site.');
	}
	
});

function resetMapView() {
	map.setView([29.0, 41.0], 3); // middle east lat/long + zoom	
}

function showStats() {
	$('#dataMessage').text(
		droneStrikes.hitList.length + ' strikes since ' + 
		droneStrikes.startTime.getMonth() + '/' +
		droneStrikes.startTime.getDate() + '/' +
		droneStrikes.startTime.getFullYear() );	
}

function showHits() {
	showMap(true);
	$('#hitMapLink').addClass('selected');
	$('#heatMapLink').removeClass('selected');
	resetMapView();
}
	
function showHeatMap() {
	showMap(true);
	$('#hitMapLink').removeClass('selected');	
	$('#heatMapLink').addClass('selected');
	resetMapView();
	
	// todo: show heatmap instead of clustered hit markers
}
	
function showData() {
	showMap(false);
	
	// todo: show data table for the data feed
}

function showMap(display) {
	if (display) {
		// show map
		$('#map').removeClass('hide').addClass('show');	
		// hide data table
		$('#data').removeClass('show').addClass('hide');
		$('#dataLink').removeClass('selected');		
	} else {
		// hide map
		$('#map').removeClass('show').addClass('hide');
		$('#hitMapLink').removeClass('selected');
		$('#heatMapLink').removeClass('selected')
		// show data table
		$('#data').addClass('show');		
		$('#dataLink').addClass('selected');
	}
}
