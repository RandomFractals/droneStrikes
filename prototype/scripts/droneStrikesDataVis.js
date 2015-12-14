/**
* Drone strikes data vis app js,
* main app view contrroller
* for this simple single page data vis.
*/

// map view
var map; 

// hit list view vars
var histList;
var listScrollPosition = 0;
var selectedListItem = -1;

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
		if (chart !== null && chart !== undefined) {
			chart.chart.width(windowWidth);
			chart.chart.height(windowHeight - marginTop);
			chart.chart.update();
		}
		if (map !== null && map !== undefined && map.visible) {
			map.map.invalidateSize();
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
		
		// load hit list data
		hitList = new HitList( 
			$('#dataList'), 
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
	if (selectedListItem > 0) {
		// clear last clicked hit list highlight
		$('#hitList li').eq(selectedListItem).removeClass('selected');
	}
	
	// update selected hit list item
	selectedListItem = droneStrikes.hitList.length - hitNumber;
	$('#hitList li').eq(selectedListItem).addClass('selected');

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
* Hides map view and displays drone strikes list.
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
* Toggles map, list view, and menu links display.
*/
function toggleMapDisplay(showMap) {
	if (showMap) {
		
		// save list scroll position
		listScrollPosition = $('#data').scrollTop();
		
		// show map
		$('#map').removeClass('hide').addClass('show');
		map.visible = true;
		
		// hide hit list and graph
		$('#data').removeClass('show').addClass('hide');
		$('#graph').removeClass('show').addClass('hide');		
	} else {
		
		// hide map
		$('#map').removeClass('show').addClass('hide');
		map.visible = false;
		
		// show hit list
		$('#data').addClass('show');		
		
		// scroll to last list view position
		$('#data').scrollTop(listScrollPosition);
	}
}
