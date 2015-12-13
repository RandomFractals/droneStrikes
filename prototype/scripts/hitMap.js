/**
* Hit map view component.
*/
function HitMap() {
	
	// create leaflet map
	this.map = L.map('map');
	//this.map.locate({setView: true, maxZoom: 4}); // for geo-loc based on ip later
	
	// create map tiles
	var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
	//var tiles = new L.StamenTileLayer('watercolor'); // experimental for later
	this.map.addLayer(tiles);	
	
	// create marker cluster group and list
	this.markers = new L.MarkerClusterGroup();
	this.markerList = [];
	
	/**
	* Resets map view centered on middle east.
	*/
	this.resetMapView = function () {
		this.map.setView([29.0, 41.0], 3); // middle east lat/long + zoom	
	};
}


/**
* Shows dronke strike hits on the map.
*/
HitMap.prototype.showHits = function (hitList) {
	// add data point map markers
	var marker;
	var hit;
	var points = [];
	for (var i=0; i < hitList.length; i++) {
		hit = hitList[i];
		marker = L.marker([hit.latitude, hit.longitude]);
		marker.bindPopup(hit.toHtml());
		this.markers.addLayer(marker);
		points.push([hit.latitude, hit.longitude]);
	}		
	this.map.addLayer(this.markers);
		
	// create heatmap strictly for visual effect
	var heatMap = L.heatLayer(points);
	this.map.addLayer(heatMap);	
	
	this.resetMapView();
}