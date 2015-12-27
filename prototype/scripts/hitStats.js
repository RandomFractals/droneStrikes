/**
* Hit stats summary data for display 
* of all kills and casualties.
*/
function HitStats() {
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
* Updates year filter for the strikes display.
*/
HitStats.prototype.updateYearFilter = function(hitDateMap) {
	var yearFilter = $('#yearFilter');
	var yearOption;
	var years = this.getYears();
	var year;
	var hitList;
	for (var i = 0; i < years.length; i++) {
		year = years[i];
		hitList = hitDateMap[year];
		if (hitList !== null && hitList !== undefined) {
			yearOption = $('<option/>')
				.attr('value', year)
				.text(year + ' (' + hitList.length + ')' )
				.appendTo(yearFilter);
		}
	}
}



/**
* Returns years array for hits year filter.
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
* Drone strikes stats logging.
*/
HitStats.prototype.logStats = function () {
	// log hit history stats
	console.log('first strike: ' + this.startTime.toString());
	console.log('last strike: ' + this.endTime.toString());
	console.log('min kills: ' + this.minKills);
	console.log('max kills: ' + this.maxKills);	
	console.log('civilians: ' + this.civilians);	
	console.log('children: ' + this.children);	
	console.log('injuries: ' + this.injuries);	
	console.log('targets: ' + this.targets.length);
	console.log('names: ' + this.names.length);
	console.log('years: ' + this.getYears());
}