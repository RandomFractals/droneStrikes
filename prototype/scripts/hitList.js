/**
* Hit data list view component.
*/
function HitList(listContainer, hitList) {
	this.listView = listContainer;
	this.dataList = hitList;
	this.listItemCount = 0;
	this.maxHits = 20; // max hits to load for one page
}


/**
* Loads max hits for the hit list data display.
*/
HitList.prototype.showHits = function () {
	console.log('list length: ' + this.dataList.length);
	var hit;	
	var dataListLength = this.dataList.length;
	for (var i = dataListLength - 1; i >= dataListLength - this.maxHits ; i--) {
		hit = this.dataList[i];
		// create hit list item
		var li = $('<li/>').appendTo(this.listView);
		var header = $('<div/>')
			.addClass('list-item')
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
			
		var dateSpan = $('<span/>')
			.addClass('date')
			.text(hit.dateString() + ' ')
			.appendTo(header);
		
		var storyLink = $('<a/>')
			.addClass('list-group-item')
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
		this.listItemCount++;
	}	
}
