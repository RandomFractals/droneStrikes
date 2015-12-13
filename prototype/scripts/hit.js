/**
* Drone strike/hit view data model class.
*/
function Hit(hitData) {

	// hit info
	this.hitId = hitData._id;
	this.hitNumber = hitData.number;
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
	this.minKills = hitData.deaths_min;
	this.maxKills = hitData.deaths_max;
	this.civilians = hitData.civilians;
	this.children = hitData.children;	
	this.injuries = hitData.injuries;
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
		'<a class="story-link" href="' + this.link + '" target="_blank">' +
			this.narrative +
		'</a><br /><br />' +
		'<span class="date">' + 
			this.dateString() + 
		'</span> ' +
			new HitBars(this).toHtml(false) + // don't break
		'<p>' + 
		this.summary + 
		'</p></div>';
	
	return html;
}