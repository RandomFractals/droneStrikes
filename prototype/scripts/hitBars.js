/**
* Hit stats bars display view component.
*/
function HitBars(hit) {
	this.hitData = hit;
}


/**
* Hit stats bars display html.
*/
HitBars.prototype.toHtml = function () {
	var hitBarsHtml = '<div class="hits">';
	
	hitBarsHtml += '<div class="bar orange" style="height: ' +
	 10 * this.hitData.civilians + 'px">' + 
	 this.hitData.civilians + ' civilians</div>';
	 
	hitBarsHtml += '<div class="bar red" style="height: ' +
	 10 * this.hitData.schildren + 'px">' + 
	 this.hitData.children + ' children</div>';
	 
	hitBarsHtml += '<div class="bar green" style="height: ' +
	 10 * this.hitData.targets.length + 'px">' + 
	 this.hitData.targets.length + ' bad guy(s)</div>';
	 
	hitBarsHtml += '</div>';
	
	return hitBarsHtml;
}