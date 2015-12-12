function HitStats() {

	this.startTime = new Date(); // now
	this.endTime = new Date(0);	// 01/01/1970	
	this.uniqueHitDays = 0;

	// hit stats
	this.minKills = 0;
	this.maxKills = 0;
	this.civilians = 0;
	this.children = 0;
	this.injuries = 0;
	this.target = 0;
	this.names = [];
}


/**
* Drone strikes stats logging.
*/
HitStats.prototype.logStats = function () {
	// log hit history stats
	console.log('first strike: ' + this.startTime.toString());
	console.log('last strike: ' + this.endTime.toString());
	console.log('unique hit days: ' + this.uniqueHitDays); 
}