/**
* Drone strikes data vis app js,
* main app view contrroller
* for this simple single page data vis.
*/

// map view
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
	
	// create map view
	map = new HitMap();
	
	// get data
	var dataUrl = 'http://api.dronestre.am/data';
	$.get(dataUrl).done(loadData).fail(dataLoadError);
	
	
	/**
	* Data load event handler.
	*/
	function loadData(hitData) {
		
		// parse data
		droneStrikes.addHits(hitData.strike);

		// show drone strikes stats
		showStats();
		
		// show hits on map
		map.showHits(droneStrikes.hitList);		
		console.log(droneStrikes.stats.logStats());		
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
* Displays drone strikes stats
* in map view data message/title bar.
*/
function showStats() {
	$('#dataMessage').text(
		droneStrikes.hitList.length + ' strikes since ' + 
		Hit.dateString(droneStrikes.stats.startTime) );	
}


/** 
* Displays map view and resets it.
*/
function showHitMap() {
	toggleMapDisplay(true); // show map
	$('#mapLink').addClass('selected');
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
