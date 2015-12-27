/**
* Drone strikes data vis app js -
* top level app view controller.
*/

// window/view vars
var windowWidth = 960;
var windowHeight = 640;
var marginTop = 120;
var viewWidth = windowWidth;
var viewHeight = windowHeight - marginTop;

// progress/filter UI vars
var message;
var progressContainer;
var progressBar;
var statsBar;
var yearFilter;
var selectedYear = 'all';

// view comps
var mapView; 
var listView; 
var graphView;

// main view data model vars
var hitStats = new HitStats(selectedYear);
var droneStrikes = new DroneStrikes(hitStats);
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
	yearFilter = $('#yearFilter');
	
	// add window resize handler
	$(window).resize( function() {
		resizeView();
	});
	
	// create view comps
	mapView = new HitMap(viewWidth, viewHeight);
	graphView = new HitGraph(viewWidth, viewHeight);
	listView = new HitList(viewWidth, viewHeight);
	
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
		var hitYearsDataMap = droneStrikes.addHits(hitData.strike);
		console.log('hit years: ' + Object.keys(hitYearsDataMap) );
		
		// reset view size
		resizeView();
	
		// hide msg and show drone strikes stats
		message.addClass(Hide);
		statsBar.css('display', 'inline');
		hitStats.updateYearFilter(hitYearsDataMap);

		// add year filter handler
		yearFilter.change(function() {
			selectedYear = yearFilter.val();
			console.log('selected year: ' + selectedYear);
			var hitList = droneStrikes.getHits(selectedYear);
			reloadData(hitList);
			console.log('selected year hit list: ' + hitList.length);
		});

		// reload all data views
		reloadData(droneStrikes.hitList, selectedYear);
		
		// hide data load progress bar
		progressContainer.addClass(Hide);
		
		console.log(droneStrikes.stats.logStats());		
	}
	
	
	/**
	* Resets all views with new hit list to display.
	*/
	function reloadData(hitList, year) {
		hitStats.showStats(year);		
		mapView.reset(hitList);
		listView.reset(hitList);		
		graphView.showHits(hitList, viewWidth, viewHeight);
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
	viewWidth = windowWidth;
	viewHeight = windowHeight - marginTop;
	
	if (mapView !== null && mapView !== undefined && mapView.visible) {
		mapView.resize(viewHeight);
	}
	
	if (listView !== null && listView !== undefined) {
		listView.resize(viewHeight);
	}
	
	if (graphView !== null && graphView !== undefined) {
		graphView.resize(viewWidth, viewHeight);
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
