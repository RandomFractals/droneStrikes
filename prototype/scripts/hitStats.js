/**
* Hit stats summary data for display 
* of all kills and casualties.
*/
function HitStats(hitData) {

	// some base date metrics
	this.startTime = new Date(); // now
	this.endTime = new Date(0);	// 01/01/1970	
	this.uniqueHitDays = 0;
	this.totalHits = 0;

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
	
	/** 
	* Quick and dirty data cleansing.
	*/
	this.toNumber = function(dirtyData) {
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
}


/**
* Updates hit stats summary data for every hit.
*/
HitStats.prototype.updateStats = function(hit) {
	this.minKills += hit.minKills;
	this.maxKills += hit.maxKills;
	this.civilians += this.toNumber(hit.civilians);
	this.children += this.toNumber(hit.children);
	this.injuries += hit.injuries;
	this.targets.push(hit.target);
	this.names.push(hit.names);	
	this.totalHits++;
}


/**
* Hit stats to string for display.
*/
HitStats.prototype.toString = function() {
	return this.totalHits + ' strikes since ' + 
		Hit.dateString(this.startTime) + 
		'. Confirmed casualties: ' +
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
	console.log('unique hit days: ' + this.uniqueHitDays); 
	console.log('min kills: ' + this.minKills);
	console.log('max kills: ' + this.maxKills);	
	console.log('civilians: ' + this.civilians);	
	console.log('children: ' + this.children);	
	console.log('injuries: ' + this.injuries);	
	console.log('targets: ' + this.targets.length);
	console.log('names: ' + this.names.length);
}