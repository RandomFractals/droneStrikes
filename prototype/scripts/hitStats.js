/**
* Hit stats summary data for display 
* of all kills and casualties.
*/
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
	this.targets = [];
	this.names = [];
}


/**
* Updates hit stats summary day for every hit.
*/
HitStats.prototype.updateStats = function(hit) {
	this.minKills += hit.minKills;
	this.maxKills += hit.maxKills;
	this.civilians += hit.civilians;
	this.children += hit.children;
	this.injuries += hit.injuries;
	this.targets.push(hit.target);
	this.names.push(hit.names);	
}


/**
* Drone strikes stats logging.
*/
HitStats.prototype.logStats = function () {
	// log hit history stats
	console.log('first strike: ' + this.startTime.toString());
	console.log('last strike: ' + this.endTime.toString());
	console.log('unique hit days: ' + this.uniqueHitDays); 
	console.log('min kills: ' + this.minKills);
	console.log('max kills: ' + this.maxKills);	
	console.log('civilians: ' + this.civilians);	
	console.log('children: ' + this.children);	
	console.log('injuries: ' + this.injuries);	
	console.log('targets: ' + this.targets.length);
	console.log('names: ' + this.names);
}