/**
* Hit graph view component.
*/
function HitGraph(viewWidth, viewHeight, hitList) {	
	// graph menu and view vars
	this.graphMenuItem = $('#graphMenuItem');
	this.graphView = $('#graphView');
	this.margin = {left: 40, top: 20, right: 180, bottom: 40};
  this.width = viewWidth;
  this.height = viewHeight;
	this.visible = false;
}


/**
* Redraws hit graph on init and window resize.
*/
HitGraph.prototype.showHits = function(dataList, windowWidth, windowHeight) {
	
	// update graph width and height
  this.width = windowWidth - this.margin.left - this.margin.right;
  this.height = windowHeight - this.margin.top - this.margin.bottom;
	
	// bar vars
	var barWidth = 24;	
	var maxWidth = dataList.length * barWidth;
  var maxHeight = this.height;
	
	// create x/y scale ranges
	//var x = d3.time.scale().range([0, maxWidth]); //this.width]); //.rangeRound([0, width]);
	var x = d3.scale.ordinal().range([0, maxWidth]);
	var y = d3.scale.linear().range([this.height, 0]);
	
	// create x/y axis and ticks
	var xAxis = d3.svg.axis().scale(x).orient("bottom")
		.ticks(2).tickFormat( d3.time.format("%m/%d/%Y") );
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
	
	// remove and create svg for win resize, etc.
	d3.select("#graphView").selectAll("svg").remove();	
	var svg = d3.select("#graphView").append("svg")
    .attr("width", maxWidth + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
		.append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	// map hit dates
	x.domain(dataList.map( function(d){ return d.date; }));
  //x.domain(d3.extent(dataList, function(d) { return d.date; }));
	
	// map max kills
	y.domain([0, d3.max(dataList, function(d) { return d.maxKills; })]);

	// create x axis group
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

	// create y axis group
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("killed");

	// create y grid lines
	svg.append("g")         
      .attr("class", "grid")
      .call(yAxis
            .tickSize(-maxWidth, 0, 0)
            .tickFormat("")
        );

	// create stacked bars
	var bars = svg.selectAll(".bar-group")
    .data(dataList)
    .enter().append("g")
			.attr("class", "bar-group")
			.on("dblclick", function(d) {      
				zoomToHit(d.number);
			})
			.on("click", function(d) {      
				HitGraph.showTooltip(d3.event.pageX, d3.event.pageY, d);
				zoomToHit(d.number);
      })			
			.on("mouseover", function(d) {      
				HitGraph.showTooltip(d3.event.pageX, d3.event.pageY, d);
      })
      .on("mouseout", function(d) {
				HitGraph.hideTooltip();
      });

		// injuries bar
		bars.append("rect")
      .attr("class", "bar yellow")
      .attr("x", function(d) { return d.number * barWidth; }) //x(d.date); })
      .attr("width", barWidth-4) 
      .attr("y", function(d) { return y(d.injuries); })
      .attr("height", function(d) { return maxHeight - y(d.injuries); });
			
		// max kills bar
		bars.append("rect")
      .attr("class", "bar blue")
      .attr("x", function(d) { return d.number * barWidth; }) //x(d.date); })
      .attr("width", barWidth-4) 
      .attr("y", function(d) { return y(d.maxKills); })
      .attr("height", function(d) { return maxHeight - y(d.maxKills); });

		// civilians bar
		bars.append("rect")
      .attr("class", "bar orange")
      .attr("x", function(d) { return d.number * barWidth; }) //x(d.date); })
      .attr("width", barWidth-4) 
      .attr("y", function(d) { return y(d.civilians); })
      .attr("height", function(d) { return maxHeight - y(d.civilians); });

		// children bar
		bars.append("rect")
      .attr("class", "bar red")
      .attr("x", function(d) { return d.number * barWidth; }) //x(d.date); })
      .attr("width", barWidth-4) 
      .attr("y", function(d) { return y(d.children); })
      .attr("height", function(d) { return maxHeight - y(d.children); });
}


// create bar chart tooltip
HitGraph.tooltip = d3.select("#tooltip");

	
/**
* Show bar tooltip.
*/
HitGraph.showTooltip = function(x, y, hitData) {
  HitGraph.tooltip.transition()        
          .duration(100)      
          .style('opacity', .9);
  HitGraph.tooltip.html(
					hitData.tooltip() )
          .style('left', (d3.event.pageX + 20) + 'px')
          .style('top', (d3.event.pageY - 80) + 'px');
	
}


/**
* Hides bar tooltip.
*/
HitGraph.hideTooltip = function() {
	HitGraph.tooltip.transition()
					.duration(100)
					.style('opacity', 0);
}


/**
* Resets graph display on window resize.
*/
HitGraph.prototype.resize = function (width, height) {
	this.graphView.height(height);
	if (this.visible) {
		this.showHits(this.dataList, width, height);
	}
}

/**
* Resets hit graph display for show.
*/
HitGraph.prototype.show = function () {
	this.graphMenuItem.addClass(Active);	
	this.graphView.removeClass(Hide).addClass(Show);	
	this.visible = true;
}


/**
* Hides graph display.
*/
HitGraph.prototype.hide = function () {
	this.graphMenuItem.removeClass(Active);			
	this.graphView.removeClass(Show).addClass(Hide);
	this.visible = false;
	HitGraph.hideTooltip();
}

	
	
