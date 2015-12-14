/**
* Hit data list view component.
*/
function HitList(listContainer, hitList) {
	// init list data display
	var listHtml = ''
	var hit;
	for (var i = hitList.length-1; i >= 0; i--) {
		hit = hitList[i];
		listHtml += '<li>' +
				'<a href="#" onclick="zoomToHit(' + 
					(hit.hitNumber-1) + ')">' + hit.hitNumber + 
				'</a>' +
				hit.dateString() + ' ' +
				new HitBars(hit).toHtml(false) + // horizontal
			'<br />' + 
				'<a href="' + hit.link + '" target="_blank">' +
					hit.narrative +
				'</a>';
		if ( hit.summary.length > 0 ) {
			listHtml += '<br />' + hit.summary;
		}
		listHtml +=	'</li>';
	}				
	
	listContainer.html(listHtml);	
}
