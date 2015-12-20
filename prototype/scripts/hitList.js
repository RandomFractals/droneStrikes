/**
* Hit data list view component.
*/
function HitList(listContainer, hitList) {
	this.listView = listContainer;
	this.dataList = hitList;
	this.listItemCount = 0;
	this.maxHits = 40; // max hits to load for one page	
	HitList.instance = this; // quick and dirty for scroll
	
	// scroll handler for loading more data
	$('#data').scroll( function () {
		if (this.scrollHeight - $(this).scrollTop() - $(this).offset().top - $(this).height() <= 0) {
			// load more data
			HitList.instance.loadHits();
		}		
	});
	
}


/**
* Loads max hits for the hit list data display.
*/
HitList.prototype.loadHits = function () {
	//console.log('list length: ' + this.listItemCount);
	var hit;	
	for (var i = 0; (i < this.maxHits && this.listItemCount <= this.dataList.length-1); i++) {
			
		hit = this.dataList[this.dataList.length - this.listItemCount - 1];
		// create hit list item
		var li = $('<li/>').appendTo(this.listView);
		var header = $('<div/>')
			.addClass('list-item')
			.appendTo(li);
			
		var mapLink = $('<a/>')
			.addClass('map-link')
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
			.addClass('list-item-link')
			.attr('href', hit.link)
			.attr('target', '_blank')
			.text(hit.narrative)
			.appendTo(header);
			
		if ( hit.summary.length > 0 ) {		
			var story = $('<p/>')
			.addClass('list-item-text')
			.text(hit.summary)
			.appendTo(li);
			//story.after('<br />');
		}
		this.listItemCount++;
	}	
}
