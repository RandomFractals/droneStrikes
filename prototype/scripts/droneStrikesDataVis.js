/**
* Drone strikes data vis app js -
* top level app view controller.
*/

// progress UI vars
var message;
var progressContainer;
var progressBar;
var statsBar;

// view comps
var mapView; 
var listView; 
var graphView;

// window/view vars
var windowWidth = 960;
var windowHeight = 640;
var marginTop = 120;
var viewWidth = windowWidth;
var viewHeight = windowHeight - marginTop;

// main view data model
var droneStrikes = new DroneStrikes();
var selectedListItem = -1;

/**
* Creates leaflet map on document ready,
* gets and displays drone strikes data.
*/
$(function() {

	// initialize top level view comps
	message = $('#message');
	progressContainer = $('#progress');		
	progressBar = $('#progressBar');
	statsBar = $('#statsBar');
	
	// add window resize handler
	$(window).resize( function() {
		resizeView();
	});
	
	// create map view and graph
	mapView = new HitMap(viewWidth, viewHeight);
	graphView = new HitGraph(viewWidth, viewHeight);
	
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
		droneStrikes.stats.updateYearFilter();
		//message.text(droneStrikes.stats.toString());
		
		// load hit list data
		listView = new HitList(droneStrikes.hitList, windowHeight - marginTop);		
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
	
}); // end of doc ready


/**
* Updates view containers on window resize,
* and/or mobile device switch between
* portrait and landscape view mode.
*/
function resizeView() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
	
	if (mapView !== null && mapView !== undefined && mapView.visible) {
		mapView.resize(windowHeight - marginTop);
	}
	
	if (listView !== null && listView !== undefined) {
		listView.resize(windowHeight - marginTop);
	}
	
	if (graphView !== null && graphView !== undefined) {
		graphView.resize(windowWidth, windowHeight - marginTop);
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

	showHitMap();
	
	// zoom to hit location
	mapView.zoomToHit(hitNumber);
}


/** 
* Displays map view.
*/
function showHitMap() {
	listView.hide();
	graphView.hide();
	mapView.show();
}
	

/**
* Hides map view and displays drone strikes list.
*/
function showData() {
	listView.show();
	mapView.hide();
	graphView.hide();
}


/**
* Shows hits graph.
*/
function showGraph() {
	listView.hide();
	mapView.hide();
	graphView.show();
}
