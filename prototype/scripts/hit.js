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
	this.target = hitData.target;
	this.names = hitData.names;
}

Hit.prototype.dateString = function() {
	return Hit.months[this.date.getMonth()] + ' ' +
		('0' + this.date.getDate()).slice(-2) + ' ' + //'/' + 
		this.date.getFullYear();
}

Hit.dateTimeString = function(date) {
	return Hit.months[date.getMonth()] + ' ' +
		('0' + date.getDate()).slice(-2) + ' ' + //'/' + 
		//('0' + (date.getMonth() + 1)).slice(-2) + //'/' + 
		date.getFullYear() + ' ' + 
		('0' + date.getHours()).slice(-2) + ':' + 
		('0' + date.getMinutes()).slice(-2);
}


Hit.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
