/**
* Hit data list view component.
*/
function HitList(listContainer, hitList) {
	// init list data display
	var listHtml = ''
	var hit;
	for (var i = hitList.length-1; i >= 0; i--) {
		hit = hitList[i];
		listHtml += '<li class="list-group-item"><span>' +
				'<a href="#" onclick="zoomToHit(' + 
					(hit.hitNumber-1) + ')"><img src="images/map.png" width="32" height="32" /></a>' +
				hit.dateString() + '' +
				new HitBars(hit).toHtml(false) + // horizontal
			'</span><br />' + 
				'<a href="' + hit.link + '" target="_blank">' +
					hit.narrative +
				'</a>';
		if ( hit.summary.length > 0 ) {
			listHtml += '<p class="list-group-item-text">' + hit.summary;
		}
		listHtml +=	'</p></li>';
	}				
	
	listContainer.html(listHtml);	
}
