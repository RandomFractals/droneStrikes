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
	this.longitude = hitData.lon;
	this.latitude = hitData.lat;
	this.longLat = {hitData.lon, hitData.lat};
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
