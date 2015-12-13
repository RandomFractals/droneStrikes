/**
* Drone strikes data vis app js,
* main app view contrroller
* for this simple single page data vis.
*/

// map view
var map; 

// data table view
var dataTable;
var dataScrollPosition = 0;

// main view data model
var droneStrikes = new DroneStrikes();


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
		
		// load table data
		dataTable = new HitDataTable( 
			$('#dataTableBody'), // table body
			droneStrikes.hitList); 

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
* Displays map view.
*/
function showHitMap() {
	toggleMapDisplay(true); // show map
	$('#mapLink').addClass('selected');
}
	

/**
* Hides map view and display drone strikes data table.
*/
function showData() {
	toggleMapDisplay(false); // hide map
}


/**
* Toggles map and data view and menu links display.
*/
function toggleMapDisplay(showMap) {
	if (showMap) {
		
		// save data table scroll position
		dataScrollPosition = $('#data').scrollTop();
		
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
		
		// scroll to last table view position
		$('#data').scrollTop(dataScrollPosition);
	}
}
