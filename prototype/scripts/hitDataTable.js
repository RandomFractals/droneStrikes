/**
* Hit data table view component.
*/
function HitDataTable(dataTableContainer, hitList) {
	// init data table display
	var dataHtml = ''
	var hit;
	for (var i = hitList.length-1; i >= 0; i--) {
		hit = hitList[i];
		dataHtml += '<tr><td>' +
				'<a href="#" onclick="zoomToHit(' + 
					(hit.hitNumber-1) + ')">' + hit.hitNumber + 
				'</a>' +
			'</td>' + 
			'<td>' +	
				hit.dateString() + '<br />' +
				new HitBars(hit).toHtml(true) + // vertical
			'</td>' + 
			'<td>' +
				'<a href="' + hit.link + '" target="_blank">' +
					hit.narrative +
				'</a>';
		if ( hit.summary.length > 0 ) {
			dataHtml += '<br />' + hit.summary;
		}
		dataHtml +=	'</td></tr>';
	}				
	
	dataTableContainer.html(dataHtml);	
	//console.log(dataHtml);
}
