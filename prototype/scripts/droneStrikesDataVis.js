$(function() {

	var droneStrikes = new DroneStrikes();
	
	var map = L.map('map').setView([29.0, 41.0], 3); // middle east lat/long + zoom
	//map.locate({setView: true, maxZoom: 4}); // for geo-loc based on ip later
	var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
	//var tiles = new L.StamenTileLayer('watercolor');
	map.addLayer(tiles);	
	var markers = new L.MarkerClusterGroup();
	var markerList = [];
	
	// get data
	var dataUrl = 'http://api.dronestre.am/data';
	$.get(dataUrl).done(loadData).fail(dataLoadError);
	
	function loadData(hitData) {
		//console.log(hitData.strike);		
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
		
		// update strikes stats display
		$('#dataMessage').text(
			droneStrikes.hitList.length + ' strikes since ' + 
			droneStrikes.startTime.getMonth() + '/' +
			droneStrikes.startTime.getDate() + '/' +
			droneStrikes.startTime.getFullYear() );
	}
	
	function dataLoadError() {
		console.log('data load error');
		// show data load error msg
		$('#dataMessage').text('Failed to load drone strikes data. Check data source site.');
	}
});