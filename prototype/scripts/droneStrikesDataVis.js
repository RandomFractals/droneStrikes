/**
* Drone strikes data vis app js -
* top level app view controller.
*/

// top UI comp. vars
var mapMenu;
var dataMenu;
var graphMenu;

var message;
var progressContainer;
var progressBar;

// map view
var map; 
var mapContainer;

// hit list view vars
var listContainer;
var dataList; // ul
var histList; // list data view

// data list scroll/selection vars
var listScrollPosition = 0;
var selectedListItem = -1;

// data graph/chart
var graphContainer;
var graph;
var chart;

// window vars
var windowWidth = 960;
var windowHeight = 640;
var marginTop = 160;

// UI state vars
var Active = 'active';
var Selected = 'selected';
var Show = 'show';
var Hide = 'hide';

// main view data model
var droneStrikes = new DroneStrikes();


/**
* Creates leaflet map on document ready,
* gets and displays drone strikes data.
*/
$(function() {

	// initialize view comps
	mapMenu = $('#mapMenu');
	dataMenu = $('#dataMenu');
	graphMenu = $('#graphMenu');
	
	message = $('#message');
	progressBar = $('#progressBar');
	
	progressContainer = $('#progress');	
	mapContainer = $('#map');
	listContainer = $('#data');
	dataList = $('#dataList');
	graphContainer = $('#graph');
	
	// handle init window size & resize
	resizeView();
	$(window).resize( function() {
		resizeView();
	});

	// create map view
	map = new HitMap();
	
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
		
		// show hits on map
		map.showHits(droneStrikes.hitList);

		// show drone strikes stats
		message.text(droneStrikes.stats.toString());
		
		// load hit list data
		hitList = new HitList(dataList, droneStrikes.hitList); 

		// create hit graph
		//graph = new HitGraph(droneStrikes.hitList, windowWidth);
		chart = new HitChart(droneStrikes.hitList, 
			windowWidth, windowHeight - marginTop);
		
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
	listContainer.height(windowHeight - marginTop);
	graphContainer.height(windowHeight - marginTop);
	if (chart !== null && chart !== undefined) {
		chart.chart.width(windowWidth);
		chart.chart.height(windowHeight - marginTop);
		chart.chart.update();
	}
	if (map !== null && map !== undefined && map.visible) {
		map.map.invalidateSize();
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
	selectedListItem = droneStrikes.hitList.length - hitNumber;
	$('#dataList li').eq(selectedListItem).addClass(Selected);

	// update menu links
	mapMenu.addClass(Active);
	dataMenu.removeClass(Active);	
	
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
	mapMenu.addClass(Active);
	dataMenu.removeClass(Active);	
	graphMenu.removeClass(Active);	
}
	

/**
* Hides map view and displays drone strikes list.
*/
function showData() {
	toggleMapDisplay(false); // hide map
	graphContainer.removeClass(Show).addClass(Hide);
	
	// update menu links
	mapMenu.removeClass(Active);
	dataMenu.addClass(Active);	
	graphMenu.removeClass(Active);		
}


/**
* Shows hits graph.
*/
function showGraph() {
	toggleMapDisplay(false); // hide map
	
	// show graph
	graphContainer.removeClass(Hide).addClass(Show);

	// hide hit list view
	listContainer.removeClass(Show).addClass(Hide);
	
	// update menu links
	mapMenu.removeClass(Active);
	dataMenu.removeClass(Active);	
	graphMenu.addClass(Active);	
}


/**
* Toggles map, list view, and menu links display.
*/
function toggleMapDisplay(showMap) {
	if (showMap) {
		
		// save list scroll position
		listScrollPosition = listContainer.scrollTop();
		
		// show map
		mapContainer.removeClass(Hide).addClass(Show);
		map.visible = true;
		
		// hide hit list and graph
		listContainer.removeClass(Show).addClass(Hide);
		graphContainer.removeClass(Show).addClass(Hide);
	} else {
		
		// hide map
		mapContainer.removeClass(Show).addClass(Hide);
		map.visible = false;
		
		// show hit list
		listContainer.addClass(Show);		
		
		// scroll to last list view position
		listContainer.scrollTop(listScrollPosition);
	}
}
