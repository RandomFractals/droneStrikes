/**
* Hit data list view component.
*/
function HitList(listContainer, hitList) {
	// init list data display
	var listHtml = ''
	var hit;
	for (var i = hitList.length-1; i >= 0; i--) {
		hit = hitList[i];
		listHtml += '<li class="list-group-item"><div class="list-group-item-heading>' +
				'<button type="button" class="btn-link" href="#" onclick="zoomToHit(' + 
					(hit.hitNumber-1) + 
					')"><img src="images/map.png" width="32" height="32" /></button>' +
				hit.dateString() + ' ' +
				new HitBars(hit).toHtml(false) + // horizontal
				'</div><p><a class="link" href="' + hit.link + '" target="_blank">' +
					hit.narrative +
				'</a></p>';
		if ( hit.summary.length > 0 ) {
			listHtml += '<p class="list-group-item-text">' + hit.summary;
		}
		listHtml +=	'</p><br /></li>';
	}				
	
	listContainer.html(listHtml);	
}
