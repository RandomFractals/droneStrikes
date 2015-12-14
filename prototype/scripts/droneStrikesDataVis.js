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
var windowHeight = 640;
var marginTop = 140;

/**
* Creates leaflet map on document ready,
* gets and displays drone strikes data.
*/
$(function() {

	// window sizing
	resizeView();
	$(window).resize( function() {
		resizeView();
	});

	function resizeView() {
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		$('#map').height(windowHeight - marginTop);
		$('#data').height(windowHeight - marginTop);
		$('#graph').height(windowHeight - marginTop);
		if (chart != null || chart != undefined) {
			chart.chart.width(windowWidth);
			chart.chart.height(windowHeight - marginTop);
			chart.chart.update();
		}
	}
	
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
		$('#message').text(droneStrikes.stats.toString());
		
		// show hits on map
		map.showHits(droneStrikes.hitList);		
		
		// load table data
		dataTable = new HitDataTable( 
			$('#dataTableBody'), // table body
			droneStrikes.hitList); 

		// create hit graph
		//graph = new HitGraph(droneStrikes.hitList, windowWidth);
		chart = new HitChart(droneStrikes.hitList, 
			windowWidth, windowHeight - marginTop);
			
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

	// update menu links
	$('#mapLink').addClass('selected');
	$('#dataLink').removeClass('selected');	
	
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
	
	// update menu links
	$('#mapLink').addClass('selected');
	$('#dataLink').removeClass('selected');	
	$('#graphLink').removeClass('selected');	
}
	

/**
* Hides map view and display drone strikes data table.
*/
function showData() {
	toggleMapDisplay(false); // hide map
	$('#graph').removeClass('show').addClass('hide');		
	
	// update menu links
	$('#mapLink').removeClass('selected');
	$('#dataLink').addClass('selected');	
	$('#graphLink').removeClass('selected');		
}


/**
* Show hits graph.
*/
function showGraph() {
	toggleMapDisplay(false); // hide map
	
	// show graph
	$('#graph').removeClass('hide').addClass('show');		

	// hide data
	$('#data').removeClass('show').addClass('hide');
	
	// update menu links
	$('#mapLink').removeClass('selected');
	$('#dataLink').removeClass('selected');	
	$('#graphLink').addClass('selected');	
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
		
		// hide data table and graph
		$('#data').removeClass('show').addClass('hide');
		$('#graph').removeClass('show').addClass('hide');		
	} else {
		
		// hide map
		$('#map').removeClass('show').addClass('hide');
		
		// show data table
		$('#data').addClass('show');		
		
		// scroll to last table view position
		$('#data').scrollTop(dataScrollPosition);
	}
}
