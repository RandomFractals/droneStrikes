/**
* Drone strike/hit view data model class.
*/
function Hit(hitData) {

	// hit info
	this.hitId = hitData._id;
	this.hitNumber = hitData.number;
	this.number = hitData.number;
	this.date = new Date(hitData.date);
	this.tweetId = hitData.tweet_id;
	this.bureauId = hitData.bureau_id;
	this.summary = hitData.bij_summary_short;
	this.link = hitData.bij_link;
	this.narrative = hitData.narrative;	
	this.articles = hitData.articles;

	// hit location
	this.latitude = hitData.lat;	
	this.longitude = hitData.lon;
	this.town = hitData.town;
	this.location = hitData.location;
	
	// hit stats
	this.killsRange = hitData.deaths;
	this.minKills = Hit.toNumber(hitData.deaths_min);
	this.maxKills = Hit.toNumber(hitData.deaths_max);
	this.injuries = Hit.toNumber(hitData.injuries);	
	this.civilians = Hit.toNumber(hitData.civilians);
	this.children = Hit.toNumber(hitData.children);
	this.targets = hitData.target;
	this.names = hitData.names;
	
}	// end of Hit() constructor


/**
* Static date string utility method.
*/
Hit.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
Hit.dateString = function(date) {
	return Hit.months[date.getMonth()] + ' ' +
		('0' + date.getDate()).slice(-2) + ' ' + //'/' + 
		//('0' + (date.getMonth() + 1)).slice(-2) + //'/' + 
		date.getFullYear();
}


/**
* Returns formatted hit date string for display.
*/
Hit.prototype.dateString = function() {
	return Hit.dateString(this.date);
}


/**
* Returns formatted hit date+time string for display.
*/
Hit.dateTimeString = function(date) {
	return this.dateString() + ' ' + 
		('0' + date.getHours()).slice(-2) + ':' + 
		('0' + date.getMinutes()).slice(-2);
}


/**
* Generates hit html for display in map marker popup.
*/
Hit.prototype.toHtml = function() {
	var html = '<div class="popup-content">' +
		'<a class="link" href="' + this.link + '" target="_blank">' +
			this.narrative +
		'</a><br />' +
		'<span class="date">' + 
			this.dateString() + 
		'</span> ' +
			new HitBars(this).toHtml(false) + // don't break
		//'<p>' + 
		//this.summary + 
		//'</p>
		'</div>';
	
	return html;
}


/**
* Generates hit html tooltip for the bar graph.
*/
Hit.prototype.tooltip = function() {
	var html = this.dateString() + '<br/><br/>' +
		'<div class="legend"><div class="legend-box blue-box"></div><span> ' +
		this.minKills + '-' + this.maxKills + ' killed</span></div><br/>' +
		'<div class="legend"><div class="legend-box orange-box"></div><span> ' +		
		this.civilians + ' civilians</span></div><br/>' +
		'<div class="legend"><div class="legend-box red-box"></div><span> ' +		
		this.children + ' children</span></div><br/>';
	
	return html;
}

	
/** 
* Quick and dirty data cleansing.
*/
Hit.toNumber = function(dirtyData) {
		var number = 0; 
		
		// could be done better, 
		// but ideally data feed should have only nubmer data
		dirtyData = dirtyData.replace('Possibly', '')
			.replace("'Many' (", '')
			.replace('named)', '')
			.replace('Unknown', '')
			.replace('Yes, according to one source.')
			.replace('At least', '')
			.replace('Possible', '')
			.replace('Yes', '')
			.replace('-Mar', '')
			.replace("Some'", '')
			.replace('Some', '')
			.replace('Dozens', '')
			.replace('Several', '')
			.replace('undefined', '')
			.replace('?', '');
			
		dirtyData = dirtyData.trim();
		if (dirtyData.length <= 0) {
			return 0;
		}
			
		//console.log(dirtyData);
		var minMax = dirtyData.split('-');
		//console.log(minMax);
		
		number = parseInt(minMax[0]); // use min known for all stats
		if ( isNaN(number) ) {
			// log and reset
			console.log('NaN: "' + dirtyData + '"');
			number = 0;			
		}
		return number;
}
