/**
* Hit stats bars display view component.
*/
function HitBars(hitStats) {
	this.stats = hitStats;
}


/**
* Hit stats bars display html.
*/
HitBars.prototype.toHtml = function () {
	var hitBarsHtml = '<div class="hits">';
	
	hitBarsHtml += '<div class="bar orange" style="height: ' +
	 10 * this.stats.civilians + 'px">' + 
	 this.stats.civilians + ' civilians</div>';
	 
	hitBarsHtml += '<div class="bar red" style="height: ' +
	 10 * this.stats.schildren + 'px">' + 
	 this.stats.children + ' children</div>';
	 
	hitBarsHtml += '<div class="bar green" style="height: ' +
	 10 * this.stats.targets.length + 'px">' + 
	 this.stats.targets.length + ' bad guy(s)</div>';
	 
	return hitBarsHtml;
}