$(function() {

	var map = L.map('map').setView([29.0, 41.0], 3); // middle east lat/long + zoom
	//map.locate({setView: true, maxZoom: 4}); // for geo-loc based on ip later
	
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
});