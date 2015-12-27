/**
* Drone strikes data model.
*/
function DroneStrikes() {
	this.hitList = [];
	this.hitDateMap  = {};	
	this.filter = 'all';	
	this.stats = new HitStats();
}	


/**
* Adds drone hits.
*/
DroneStrikes.prototype.addHits = function(strikesData) {
	var hit;
	var hitDateList;
	var dateKey;	
	for (var i=0; i < strikesData.length; i++) {
		// create new hit
		hit = new Hit(strikesData[i]);
		dateKey = hit.date.getFullYear(); //hit.dateString();
			
		// update hit history start and end time
		if (this.stats.startTime > hit.date) {
			this.stats.startTime = hit.date;
		}
		else if (this.stats.endTime < hit.date) {
			this.stats.endTime = hit.date;
		}
		
		// get hit date list
		hitDateList = this.hitDateMap[dateKey];
		if (hitDateList === null || hitDateList === undefined) {
			// create new hit date list
			this.hitDateMap[dateKey] = [];
			hitDateList = this.hitDateMap[dateKey];
		}

		// update hit date list
		hitDateList.push(hit);		
		
		// add it to the hit list
		this.hitList.push(hit);		
		this.stats.updateStats(hit);
	
	}	// end of data parse for loop

	// sort by time
	this.hitList.sort(function (a, b) {return a.time - b.time});
	
	return this.hitDateMap;
}


/**
* Gets drone hits for the specified year.
*/
DroneStrikes.prototype.getHits = function(year) {	
	// get hit list for the specified year
	var dataList = [];
	var hit;
	var count = 0;
	for (var i = 0; i < this.hitList.length; i++) {
		hit = this.hitList[i];
		if (hit.date.getFullYear() == year) {
			dataList.push(hit);
			hit.number = count++; // for bars
		} else if (year == 'all') { // for all years
			dataList.push(hit);
			hit.number = i; // reset index for lookup
		}
	}
	this.filter = year;
	return dataList;
}


/**
* Drone strikes data logging.
*/
DroneStrikes.prototype.toString = function() {
	var hitListString = '';
	for (var i=0; i < this.hitList.length; i++) {
		hitListString += this.hitList[i].toString() + '\n\n';
	}
	return hitListString;
}