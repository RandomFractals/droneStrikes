/**
* Hit stats summary data for display 
* of all kills and casualties.
*/
function HitStats(hitData) {

	// some base date metrics
	this.statsBar = $('#statsBar');
	this.startTime = new Date(); // now
	this.endTime = new Date(0);	// 01/01/1970	
	this.totalHits = 0;
	this.uniqueHitYears = 0;
	
	// hit stats init
	this.minKills = 0;
	this.maxKills = 0;
	this.civilians = 0;
	this.children = 0;
	this.injuries = 0;
	this.targets = [];
	this.names = [];
	
	if (hitData !== null && hitData !== undefined) {
		this.updateStats(hitData);
	}
}


/**
* Updates hit stats summary data for every hit.
*/
HitStats.prototype.updateStats = function(hit) {
	this.minKills += hit.minKills;
	this.maxKills += hit.maxKills;
	this.injuries += hit.injuries;	
	this.civilians += hit.civilians;
	this.children += hit.children;
	this.targets.push(hit.target);
	this.names.push(hit.names);	
	this.totalHits++;
}


/**
* Returns the years for hits year filter.
*/
HitStats.prototype.getYears = function() {
	var years = [];
	var startYear = this.startTime.getFullYear();
	var endYear = this.endTime.getFullYear();
	for (var year = startYear; year <= endYear; year++) {
		years.push(year);
	}
	return years;
}


/**
* Updates year filter for the strikes display.
*/
HitStats.prototype.updateYearFilter = function() {
	var yearFilter = $('#yearFilter');
	var yearOption;
	var years = this.getYears();
	for (var i = 0; i < years.length; i++) {
		yearOption = $('<option/>')
			.attr('value', years[i])
			.text(years[i])
			.appendTo(yearFilter);
	}
}


/**
* Displays hits stats and legends.
*/
HitStats.prototype.showStats = function() {
	$('#hitCount').text(this.targets.length);
	$('#civiliansCount').text(this.civilians);
	$('#childrenCount').text(this.children);
}


/**
* Displays stats hit bars and legends.
*/
HitStats.prototype.toHtml = function() {
	
	var hitBar = $('<div/>')
		.addClass('legend')
		.appendTo(this.statsBar);
	
	var hitLegend = $('<div/>')
		.addClass('legend-box green-box')
		.appendTo(hitBar);
		
	var hitCount = $('<span/>')
			.text(' ' + this.targets.length + ' strikes  ')
			.appendTo(hitBar);
			
	var civiliansLegend = $('<div/>')
		.addClass('legend-box orange-box')
		.appendTo(hitBar);
		
	var civiliansCount = $('<span/>')
			.text(' ' + this.civilians + ' civilians  ')
			.appendTo(hitBar);

	var childrenLegend = $('<div/>')
		.addClass('legend-box red-box')
		.appendTo(hitBar);
		
	var childrenCount = $('<span/>')
			.text(' ' + this.children + ' children  ')
			.appendTo(hitBar);	
}


/**
* Hit stats to string for display.
*/
HitStats.prototype.toString = function() {
	return this.totalHits + ' hits. ' + // since ' + 
		//Hit.dateString(this.startTime) + 
		//'. Confirmed casualties: ' +
		this.civilians + ' civilians, ' +
		this.children + ' children. ';// +
		//this.names.length + ' bad guys.';
}


/**
* Drone strikes stats logging.
*/
HitStats.prototype.logStats = function () {
	// log hit history stats
	console.log('first strike: ' + this.startTime.toString());
	console.log('last strike: ' + this.endTime.toString());
	console.log('unique hit years: ' + this.getYears()); 
	console.log('min kills: ' + this.minKills);
	console.log('max kills: ' + this.maxKills);	
	console.log('civilians: ' + this.civilians);	
	console.log('children: ' + this.children);	
	console.log('injuries: ' + this.injuries);	
	console.log('targets: ' + this.targets.length);
	console.log('names: ' + this.names.length);
	console.log('years: ' + this.getYears());
}