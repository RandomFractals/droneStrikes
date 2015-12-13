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
	
	hitBarsHtml += '<div class="bar orange" style="height:' +
	 10 * this.hitData.civilians + 
	 'px"></div>' + 
	 '<span class="orange">' +	 
	 this.hitData.civilians + 
	 ' civilians</span>';
	 
	hitBarsHtml += '<div class="bar red" style="height:' +
	 10 * this.hitData.schildren + 
	 'px"></div>' + 
	 '<span class="red">' + 
	 this.hitData.children + 
	 ' children</span>';
	 
	hitBarsHtml += '<div class="bar green" style="height:' +
	 10 * this.hitData.targets.length + 
	 'px"></div>' + 
	 '<span class="green">' +	 
	 this.hitData.targets.length + 
	 ' bad guy(s)</span>';
	 
	hitBarsHtml += '</div>';
	
	return hitBarsHtml;
}