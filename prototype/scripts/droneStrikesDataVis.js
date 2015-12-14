/**
* Drone strikes data vis app js,
* main app view contrroller
* for this simple single page data vis.
*/

// map view
var map; 

// data table view vars
var dataTable;
var dataScrollPosition = 0;
var selectedHitRow = -1;

// data graph/chart
var graph;
var chart;

// main view data model
var droneStrikes = new DroneStrikes();

var windowWidth = 960;

/**
* Creates leaflet map on document ready,
* gets and displays drone strikes data.
*/
$(function() {

	// get window width 
	windowWidth = $(window).width();
	$(window).resize( function() {
		windowWidth = $(window).width();
	});

	// create map view
	map = new HitMap();
	
	// get data
	var dataUrl = 'http://api.dronestre.am/data';
	$.ajax({
		url: dataUrl, 
		dataType: 'jsonp',
		success: loadData,
		error: dataLoadError
	});
	
	
	/**
	* Data load event handler.
	*/
	function loadData(hitData) {
		
		// parse data
		droneStrikes.addHits(hitData.strike);

		// show drone strikes stats
		$('#dataMessage').text(droneStrikes.stats.toString());
		
		// show hits on map
		map.showHits(droneStrikes.hitList);		

		// create hit graph
		//graph = new HitGraph(droneStrikes.hitList, windowWidth);
		chart = new HitChart(droneStrikes.hitList, windowWidth);
		
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
* Zooms map to the specified hit location.
*/
function zoomToHit(hitNumber) {
	if (selectedHitRow > 0) {
		// clear last hit row click highlight
		$('#dataTable tr').eq(selectedHitRow).removeClass('selectedRow');
	}
	
	// update selected hit row
	selectedHitRow = droneStrikes.hitList.length - hitNumber;
	$('#dataTable tr').eq(selectedHitRow).addClass('selectedRow');
	
	// show map
	toggleMapDisplay(true);
	
	// zoom to hit location
	map.zoomToHit(hitNumber);
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
