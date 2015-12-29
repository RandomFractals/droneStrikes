/**
* Hit map view component.
*/
function HitMap(width, height) {
	
	// init map menu item and view
	this.mapMenuItem = $('#mapMenuItem');
	this.mapView = $('#mapView');
	
	// create leaflet map
	this.map = L.map('mapView');
	//this.map.locate({setView: true, maxZoom: 4}); // for geo-loc based on ip later
	
	// create map tiles
	var mapTilesLayer = MQ.mapLayer(); // map quest
	/*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { // OSM
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
	});*/
	this.map.addLayer(mapTilesLayer);	
	
	// create MQ map view controls
	L.control.layers({
		'Map': mapTilesLayer,
		'Dark': MQ.darkLayer(),
		'Light': MQ.lightLayer(),
		'Satellite': MQ.satelliteLayer()
	}).addTo(this.map);

	// create new marker cluster group and list
	this.markers = new L.MarkerClusterGroup();
	this.markerList = [];
	this.heatMapLayer = null;
	this.dataList = [];
	
	// save width and height for resize
	this.width = width;
	this.height = height;
	this.visible = true;
	
	/**
	* Resets map view centered on middle east.
	*/
	this.resetMapView = function () {
		this.map.setView([29.0, 41.0], 2); // middle east lat/long + zoom	
	};
}


/**
* Resets map view for new hit list display.
*/
HitMap.prototype.reset = function(hitList) {
	
	// save new data list
	this.dataList = hitList;
	
	// remove stale map layers
	if (this.heatMapLayer !== null && this.heatMapLayer !== undefined) {
		this.map.removeLayer(this.heatMapLayer);
		this.map.removeLayer(this.markers);
		this.markers = new L.MarkerClusterGroup();
		this.markerList = [];
	}
	
	// show new hit list on map
	this.showHits();
}


/**
* Shows dronke strike hits on the map.
*/
HitMap.prototype.showHits = function () {	
	// add data point map markers
	var marker;
	var hit;
	var heatPoints = [];
	var bounds = new L.LatLngBounds();
	for (var i=0; i < this.dataList.length; i++) {
		hit = this.dataList[i];
		marker = L.marker([hit.latitude, hit.longitude]);
		marker.bindPopup(hit.toHtml());
		this.markers.addLayer(marker);
		this.markerList.push(marker);
		heatPoints.push([hit.latitude, hit.longitude, 1.0]); // intensity
		bounds.extend(marker.getLatLng());
	}		
	
	// add map markers
	this.map.addLayer(this.markers);
		
	// create heatmap strictly for visual effect
	this.heatMapLayer = L.heatLayer(heatPoints, {minOpacity: 0.3, radius: 30});
	this.map.addLayer(this.heatMapLayer);	
	
	// center on middle east
	//this.resetMapView();	
	this.map.fitBounds(bounds);
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


/**
* Resets map display on window resize.
*/
HitMap.prototype.resize = function (height) {
	this.mapView.height(height);
	this.map.invalidateSize();
}


/**
* Resets hit graph display for show.
*/
HitMap.prototype.show = function () {
	this.mapMenuItem.addClass(Active);	
	this.mapView.removeClass(Hide).addClass(Show);	
	this.map.invalidateSize();	
	this.visible = true;
}


/**
* Hides map display.
*/
HitMap.prototype.hide = function () {
	this.mapMenuItem.removeClass(Active);			
	this.mapView.removeClass(Show).addClass(Hide);
	this.visible = false;
}



