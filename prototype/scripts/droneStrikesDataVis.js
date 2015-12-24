/**
* Drone strikes data vis app js -
* top level app view controller.
*/

// top UI comp. vars
var message;
var progressContainer;
var progressBar;
var statsBar;

var mapMenuItem;
var graphMenuItem;

// view containers
var mapView; 
var mapContainer;
var listView; 

// data graph/chart
var graphContainer;
var graphView;

// window vars
var windowWidth = 960;
var windowHeight = 640;
var marginTop = 120;

// main view data model
var droneStrikes = new DroneStrikes();


/**
* Creates leaflet map on document ready,
* gets and displays drone strikes data.
*/
$(function() {

	// initialize top level view comps
	message = $('#message');
	progressBar = $('#progressBar');
	statsBar = $('#statsBar');
	
	progressContainer = $('#progress');	
	mapContainer = $('#map');
	graphContainer = $('#graph');
	
	mapMenuItem = $('#mapMenuItem');
	listMenuItem = $('#listMenuItem');
	graphMenuItem = $('#graphMenuItem');
	
	
	// add window resize handler
	$(window).resize( function() {
		resizeView();
	});
	
	// create map view and graph
	mapView = new HitMap();
	graphView = new HitGraph();
	
	// show 50% view load progress
	progressBar.css('width', '50%');
	
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
		
		// reset view size
		resizeView();
	
		// show hits on map
		mapView.showHits(droneStrikes.hitList);

		// hide msg and show drone strikes stats
		message.addClass(Hide);
		statsBar.css('display', 'inline');
		droneStrikes.stats.showStats();
		//message.text(droneStrikes.stats.toString());
		
		// load hit list data
		listView = new HitList(droneStrikes.hitList);
		
		listView.loadHits(); 

		// init graph
		graphView.showHits(droneStrikes.hitList, windowWidth, windowHeight - marginTop);
		
		// hide data load progress bar
		progressContainer.addClass(Hide);
		
		console.log(droneStrikes.stats.logStats());		
	}
	
	
	/**
	* Logs and displays a message about failed data load.
	*/
	function dataLoadError(request, status, error) {
		console.log('data load error: ' + JSON.stringify(request) + status + error);
		// show data load error msg
		message.text('Failed to load drone strikes data. Check data source site.');
	}
	
}); // end of doc reday


/**
* Updates view containers on window resize,
* and/or mobile device switch between
* portrait and landscape view mode.
*/
function resizeView() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	mapContainer.height(windowHeight - marginTop);
	
	if (mapView !== null && mapView !== undefined && mapView.visible) {
		mapView.map.invalidateSize();
	}
	
	//listContainer.height(windowHeight - marginTop);
	if (listView !== null && listView !== undefined) {
		listView.resize(windowHeight - marginTop);
	}
	
	graphContainer.height(windowHeight - marginTop);	
	if (graphView !== null && graphView !== undefined) {
		graphView.showHits(droneStrikes.hitList, windowWidth, windowHeight - marginTop);
	}	
}

	
/**
* Zooms map to the specified hit location.
*/
function zoomToHit(hitNumber) {
	if (selectedListItem > 0) {
		// clear last clicked hit list highlight
		$('#dataList li').eq(selectedListItem).removeClass(Selected);
	}
	
	// update selected hit list item
	selectedListItem = droneStrikes.hitList.length - hitNumber - 1;
	$('#dataList li').eq(selectedListItem).addClass(Selected);

	// update menu links
	mapMenu.addClass(Active);
	dataMenu.removeClass(Active);	
	
	// show map
	toggleMapDisplay(true);
	
	// zoom to hit location
	mapView.zoomToHit(hitNumber);
}


/** 
* Displays map view.
*/
function showHitMap() {
	toggleMapDisplay(true); // show map
	
	// update menu links
	mapMenuItem.addClass(Active);
	dataMenuItem.removeClass(Active);	
	graphMenuItem.removeClass(Active);	
}
	

/**
* Hides map view and displays drone strikes list.
*/
function showData() {
	toggleMapDisplay(false); // hide map
	graphContainer.removeClass(Show).addClass(Hide);
	
	// update menu links
	mapMenuItem.removeClass(Active);
	
	graphMenuItem.removeClass(Active);		
}


/**
* Shows hits graph.
*/
function showGraph() {
	toggleMapDisplay(false); // hide map
	
	// show graph
	graphContainer.removeClass(Hide).addClass(Show);

	// hide hit list view
	listView.hide();
	
	// update menu links
	mapMenuItem.removeClass(Active);
	graphMenuItem.addClass(Active);	
}


/**
* Toggles map, list view, and menu links display.
*/
function toggleMapDisplay(showMap) {
	if (showMap) {		
		listView.hide();
		
		// show map
		mapContainer.removeClass(Hide).addClass(Show);
		mapView.visible = true;
		mapView.map.invalidateSize();
		
		// hide graph
		graphContainer.removeClass(Show).addClass(Hide);
		graphMenu.removeClass(Active);
	} else {
		
		// hide map
		mapContainer.removeClass(Show).addClass(Hide);
		mapView.visible = false;
		
		// show hit list
		listView.show();		
	}
}
