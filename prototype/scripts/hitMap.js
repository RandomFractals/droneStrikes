/**
* Hit map view component.
*/
function HitMap(width, height) {
	
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

	// create marker cluster group and list
	this.markers = new L.MarkerClusterGroup();
	this.markerList = [];
	
	// save width and height for resize
	this.width = width;
	this.height = height;
	this.visible = true;
	
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
	var heatMapLayer = L.heatLayer(heatPoints, {minOpacity: 0.3, radius: 30});
	this.map.addLayer(heatMapLayer);	
	
	// center on middle east
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



