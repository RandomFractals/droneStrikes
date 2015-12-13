/**
* Drone strikes data vis app js,
* main app view contrroller
* for this simple single page data vis.
*/

// leaflet map container
var map; 

// main view data model
var droneStrikes = new DroneStrikes();

// table data load flag
var loadTableData = true;


/**
* Creates leaflet map on document ready,
* gets and displays drone strikes data.
*/
$(function() {
	
	// create leaflet map
	map = L.map('map');
	//map.locate({setView: true, maxZoom: 4}); // for geo-loc based on ip later
	resetMapView();
	
	// create map tiles
	var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
	//var tiles = new L.StamenTileLayer('watercolor'); // experimental for later
	map.addLayer(tiles);	
	
	// create marker cluster group and list
	var markers = new L.MarkerClusterGroup();
	var markerList = [];
	
	// get data
	var dataUrl = 'http://api.dronestre.am/data';
	$.get(dataUrl).done(loadData).fail(dataLoadError);
	
	
	/**
	* Data load event handler.
	*/
	function loadData(hitData) {
		droneStrikes.addHits(hitData.strike);		
		console.log(droneStrikes.stats.logStats());
		
		// add data point map markers
		var marker;
		var hit;
		var points = [];
		for (var i=0; i<droneStrikes.hitList.length; i++) {
			hit = droneStrikes.hitList[i];
			marker = L.marker([hit.latitude, hit.longitude]);
			marker.bindPopup(hit.toHtml());
			markers.addLayer(marker);
			points.push([hit.latitude, hit.longitude]);
		}		
		map.addLayer(markers);
		
		// create heatmap strictly for visual effect
		var heatMap = L.heatLayer(points);
		map.addLayer(heatMap);
		
		// show drone strikes stats
		showStats();
	}
	
	
	/**
	* Logs and displays a message about failed data load.
	*/
	function dataLoadError() {
		console.log('data load error');
		// show data load error msg
		$('#dataMessage').text('Failed to load drone strikes data. Check data source site.');
	}
	
});


/**
* Resets map view centered on middle east.
*/
function resetMapView() {
	map.setView([29.0, 41.0], 3); // middle east lat/long + zoom	
}


/**
* Displays drone strikes stats
* in map view data message/title bar.
*/
function showStats() {
	$('#dataMessage').text(
		droneStrikes.hitList.length + ' strikes since ' + 
		droneStrikes.stats.startTime.getMonth() + '/' +
		droneStrikes.stats.startTime.getDate() + '/' +
		droneStrikes.stats.startTime.getFullYear() );	
}


/** 
* Displays map view and resets it.
*/
function showHitMap() {
	toggleMapDisplay(true); // show map
	$('#mapLink').addClass('selected');
	resetMapView();
}
	

/**
* Hides map view and display tabular drone strikes data.
*/
function showData() {
	toggleMapDisplay(false); // hide map
	
	if (loadTableData) {
		// init data table display
		var dataHtml = ''
		for (var i=droneStrikes.hitList.length-1; i>= 0; i--) {
			hit = droneStrikes.hitList[i];
			dataHtml += '<tr><td>' +	hit.dateString() + '<br />' +
				new HitBars(hit).toHtml(true) + // vertical
				'</td><td><a href="' + hit.link + '" target="_blank">' +
					hit.narrative +
				'</a>';
			if ( hit.summary.length > 0 ) {
				dataHtml += '<br /><br />' + hit.summary;
			}
			dataHtml +=	'</td></tr>';
		}				
		console.log(dataHtml);
		$('#dataTableBody').html(dataHtml);
	}
	loadTableData = false;
}


/**
* Toggles map and data view and menu links display.
*/
function toggleMapDisplay(display) {
	if (display) {
		// show map
		$('#map').removeClass('hide').addClass('show');	
		// hide data table
		$('#data').removeClass('show').addClass('hide');
		$('#dataLink').removeClass('selected');		
	} else {
		// hide map
		$('#map').removeClass('show').addClass('hide');
		$('#mapLink').removeClass('selected');
		// show data table
		$('#data').addClass('show');		
		$('#dataLink').addClass('selected');
	}
}
