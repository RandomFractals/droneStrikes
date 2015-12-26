/**
* Drone strikes data model.
*/
function DroneStrikes() {
	
	// hits
	this.hitList = [];
	this.stats = new HitStats();
	this.filter = 'all';
		
	// hits date map for data vis
	var _hitDateMap;	
	
	// privileged :) hitDateMap
	this.hitDateMap = function () {
		
		if (_hitDateMap !== null && _hitDateMap !== undefined) {
			return _hitDateMap;
		}
		
		// create new hits date map
		_hitDateMap = {};

		var hit;
		var hitDateList;
		var dateKey;
		for (var i=0; i < this.hitList.length; i++) {	
			// get hit and date key
			hit = this.hitList[i];		
			dateKey = hit.date.getFullYear(); //hit.dateString();
		
			// get hit date list
			hitDateList = _hitDateMap[dateKey];
			if (hitDateList === null || hitDateList === undefined) {
				// create new hit date list
				_hitDateMap[dateKey] = [];
				hitDateList = _hitDateMap[dateKey];
			}

			// update hit date list
			hitDateList.push(hit);
		}
		
		// update unique hit days count
		this.stats.uniqueHitYears = Object.keys(_hitDateMap).length;
		
		return _hitDateMap;
	}
	
}	// end of DroneStrikes() constructor


/**
* Adds drone hits.
*/
DroneStrikes.prototype.addHits = function(strikesData) {
	
	var hit;
	for (var i=0; i < strikesData.length; i++) {
		// create new hit
		hit = new Hit(strikesData[i]);
		
		// update hit history start and end time
		if (this.stats.startTime > hit.date) {
			this.stats.startTime = hit.date;
		}
		else if (this.stats.endTime < hit.date) {
			this.stats.endTime = hit.date;
		}
		
		// add it to the hit list
		this.hitList.push(hit);		
		this.stats.updateStats(hit);
	
	}	// end of data parse for loop

	// sort by time
	this.hitList.sort(function (a, b) {return a.time - b.time});
	
	return this.hitDateMap();
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
* Strikes date metrics.
*/
DroneStrikes.prototype.totalHitDays = function() {
	var days = (this.endTime - this.startTime)/24/60/60/1000; // hours/mins/secs/millis
	return Math.round(days);
}

DroneStrikes.prototype.totalHitMonths = function() {
	return Math.round(this.totalSearchDays()/30); // close enough! :)
}

DroneStrikes.prototype.hitYears = function() {
	return Math.floor(this.totalHitDays()/364); // can account for leap years later
}

DroneStrikes.prototype.hitMonths = function() {
	return this.totalHitMonths() % 12;
}

DroneStrikes.prototype.hitDays = function() {
	return this.totalHitDays() % 30; // can be refined later
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


/**
* Hit date map logging for debug.
*/
DroneStrikes.prototype.hitDateMapString = function() {
	var dateMapString = '';
	var dateKeys = Object.keys(this.hitDateMap());
	var dateMapLength = dateKeys.length;
	var dateQueryList;
	var dateQueryListLength;
	for (var i=0; i < dateMapLength; i++) {
		dateMapString += dateKeys[i].toString() + 
			'\n_____________________________________________\n';
		// get date hit list
		dateHitList = this.queryDateMap()[dateKeys[i]];
		for (var j=0; j < dateHitList.length; j++) {
			dateMapString += dateHitList[j].toShortString() + '\n';
		}
		dateMapString += '\n';
	}
	return dateMapString;
}