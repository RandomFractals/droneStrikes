$(function() {

	var droneStrikes = new DroneStrikes();
	
	var map = L.map('map').setView([29.0, 41.0], 3); // middle east lat/long + zoom
	//map.locate({setView: true, maxZoom: 4}); // for geo-loc based on ip later
	
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	// get data
	var dataUrl = 'http://api.dronestre.am/data';
	$.get(dataUrl).done(loadData).fail(dataLoadError);
	
	function loadData(hitData) {
		//console.log(hitData.strike);		
		droneStrikes.addHits(hitData.strike);
		
		console.log(droneStrikes.logStats());
		
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