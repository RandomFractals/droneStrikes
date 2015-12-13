/**
* Hit stats bars display view component.
*/
function HitBars(hit) {
	this.hitData = hit;
}


/**
* Hit stats bars display html.
*/
HitBars.prototype.toHtml = function (vertical) {
	var hitBarsHtml = '<div class="hits">';
	
	if (this.hitData.civilians.length > 0) {
		hitBarsHtml += /*
			'<div class="bar orange" style="height:' +
			10 * this.hitData.civilians + 
			'px"></div>' + */
			' <span class="orange">' +	 
			this.hitData.civilians + 
			' civilians</span>';
	}
	 
	if (this.hitData.children.length > 0) {
		if (vertical) { 
			hitBarsHtml += '<br />';
		}
		hitBarsHtml += /*
			'<div class="bar red" style="height:' +
			10 * this.hitData.schildren + 
			'px"></div>' + */
			' <span class="red">' + 
			this.hitData.children + 
			' child(ren)</span>';
	}
	
	if (this.hitData.targets.length > 0) {
		if (vertical) { 
			hitBarsHtml += '<br />';
		}
		hitBarsHtml += /*
			'<div class="bar green" style="height:' +
			10 * this.hitData.targets.length + 
			'px"></div>' + */
			' <span class="green">' +	 
			this.hitData.targets.length + 
			' bad guy(s)</span>';
	}
	 
	hitBarsHtml += '</div>';
	
	return hitBarsHtml;
}