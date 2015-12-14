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
	var heatPoints = [];
	for (var i=0; i < hitList.length; i++) {
		hit = hitList[i];
		marker = L.marker([hit.latitude, hit.longitude]);
		marker.bindPopup(hit.toHtml());
		this.markers.addLayer(marker);
		this.markerList.push(marker);
		heatPoints.push([hit.latitude, hit.longitude, 1.0]); // intensity
	}		
	this.map.addLayer(this.markers);
		
	// create heatmap strictly for visual effect
	//var heatMap = L.heatLayer(heatPoints, {minOpacity: 0.3, radius: 30});
	//this.map.addLayer(heatMap);	
	
	this.resetMapView();
}


/**
* Zooms map to the specified hit marker.
*/
HitMap.prototype.zoomToHit = function(hitNumber) {
	console.log('zoom to hit #: ' + hitNumber);
	
	// get hit marker
	var marker = this.markerList[hitNumber];
	console.log('hit location: ' + marker.getLatLng());
	
	// zoom to hit location
	this.markers.zoomToShowLayer(marker, function (){} ); // on zoom
	
	// show popup
	marker.openPopup();
}