/**
* Hit stats summary data for display 
* of all kills and casualties.
*/
function HitStats(year) {
	// some base date metrics
	this.startTime = new Date(); // now
	this.endTime = new Date(0);	// 01/01/1970	
	this.totalHits = 0;
	this.year = year;
	
	// hit stats init
	this.minKills = 0;
	this.maxKills = 0;
	this.civilians = 0;
	this.children = 0;
	this.injuries = 0;
	this.targets = [];
	this.names = [];
	this.hitYearMapList;
	this.hitYearStats = {};	
	this.statusBar = $('#statsBar');	
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
	this.hitYearMapList = hitDateMap;
	for (var i = 0; i < years.length; i++) {
		year = years[i];
		hitList = hitDateMap[year];
		if (hitList !== null && hitList !== undefined) {
			// add year option filter with hits count
			yearOption = $('<option/>')
				.attr('value', year)
				.text(year + ' (' + hitList.length + ')' )
				.appendTo(yearFilter);
				
			// add hit year stats
			this.hitYearStats[year] = new HitStats(year);
		}
	}
	
	// update stats bar display
	this.toHtml();
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
* Updates top level stats bar display.
*/
HitStats.prototype.showStats = function(year) {
	if (year === 'all') {
		this.toHtml();
	} else {
		// get selected year stats
		var stats = this.hitYearStats[year];
		if (stats.totalHits <= 0) {
			//update year stats
			var hitList = this.hitYearMapList[year];
			for (var i=0; i<hitList.length; i++) {
				stats.updateStats(hitList[i]);
			}
		}
		stats.toHtml(year);
	}
}


/**
* Displays stats hit bars and legends.
*/
HitStats.prototype.toHtml = function(year) {
	
	// clear old stats
	this.statusBar.empty();
	
	var hitBar = $('<div/>')
		.addClass('legend')
		.appendTo(this.statusBar);
	
	if (year !== 'all' && year !== undefined) {
		$('<span/>').text(year + ': ')
		.appendTo(hitBar);
	}
	
	$('<div/>')
		.addClass('legend-box green-box')
		.appendTo(hitBar);
		
	$('<span/>')
		.text(' ' + this.targets.length + ' strikes  ')
		.appendTo(hitBar);
			
	$('<div/>')
		.addClass('legend-box orange-box')
		.appendTo(hitBar);
		
	$('<span/>')
		.text(' ' + this.civilians + ' civilians  ')
		.appendTo(hitBar);

	$('<div/>')
		.addClass('legend-box red-box')
		.appendTo(hitBar);
		
	$('<span/>')
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