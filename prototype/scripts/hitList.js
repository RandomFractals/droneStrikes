/**
* Hit data list view component.
*/
function HitList(listContainer, hitList) {
	// init list data display
	var listHtml = ''
	var hit;
	var hitListData = [];
	for (var i = hitList.length-1; i >= 0; i--) {
		hit = hitList[i];		
		
		var li = $('<li/>').appendTo(listContainer);
		var header = $('<div/>')
			.addClass('list-group-item-heading')
			.appendTo(li);
			
		var mapLink = $('<button/>')
			.addClass('btn-link')
			.attr('onclick', 'zoomToHit(' + (hit.hitNumber-1) + ')')
			.appendTo(header);
			
		var mapImage = $('<img/>')
			.attr('src', 'images/map.png')
			.attr('width', 32)
			.attr('height', 32)
			.appendTo(mapLink);
			
		mapLink.after(	hit.dateString() );
		
		var storyLink = $('<a/>')
			.addClass('link')
			.attr('href', hit.link)
			.attr('target', '_blank')
			.text(hit.narrative)
			.appendTo(header);
			
		if ( hit.summary.length > 0 ) {		
			var story = $('<p/>')
			.addClass('list-group-item-text')
			.text(hit.summary)
			.appendTo(li);
			story.after('<br />');
		}
	}				
}
