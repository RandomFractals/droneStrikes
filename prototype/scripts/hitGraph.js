/**
* Hit graph view component.
*/
function HitGraph() {	
	this.margin = {left: 40, top: 20, right: 20, bottom: 60};
  this.width = 0;
  this.height = 0;
}


/**
* Redraws hit graph on init and window resize.
*/
HitGraph.prototype.showHits = function(dataList, windowWidth, windowHeight) {

	// update graph width and height
  this.width = windowWidth - this.margin.left - this.margin.right;
  this.height = windowHeight - this.margin.top - this.margin.bottom;
	
	var barWidth = 11;	
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
	
	// create min kills line
	var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.minKills); });

	var minKillsArea = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(this.height)
    .y1(function(d) { return y(d.minKills); });

	var maxKillsArea = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(this.height)
    .y1(function(d) { return y(d.maxKills); });
	
	// remove and create svg for win resize, etc.
	d3.select("#graph").selectAll("svg").remove();	
	var svg = d3.select("#graph").append("svg")
    .attr("width", maxWidth) //this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
		.append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	// map hit dates
	x.domain( dataList.map( function(d){ return d.date; }));
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
      .text("Kills");

	// create y grid lines
	svg.append("g")         
      .attr("class", "grid")
      .call(yAxis
            .tickSize(-maxWidth, 0, 0)
            .tickFormat("")
        );
	
	/*
	svg.append("path")
      .datum(dataList)
      .attr("class", "area")
      .attr("d", maxKillsArea);
	*/

	// create tooltip div
	var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")
		.attr('id', 'tooltip')
    .style("opacity", 0);
		
	// draw max kills bars
	var formatTime = d3.time.format("%b %e %Y");
	svg.selectAll(".bar")
    .data(dataList)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return d.hitNumber * barWidth; }) //x(d.date); })
      .attr("width", barWidth-1) 
      .attr("y", function(d) { return y(d.maxKills); })
      .attr("height", function(d) { return maxHeight - y(d.maxKills); })
			.on("mouseover", function(d) {      
				HitGraph.showTooltip(d3.event.pageX, d3.event.pageY, d);
      })                  
      .on("mouseout", function(d) {
				HitGraph.hideTooltip();
      });
				
	// line 
	/*
  svg.append("path")
      .datum(dataList)
      .attr("class", "line")
      .attr("d", line);	*/
}


// create bar chart tooltip
HitGraph.tooltip = d3.select("body").append("div")   
  .attr("class", "tooltip")
	.attr('id', 'tooltip')
  .style("opacity", 0);	

	
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
          .style('top', (d3.event.pageY - 20) + 'px');
	
}


/**
* Hides bar tooltip.
*/
HitGraph.hideTooltip = function() {
	HitGraph.tooltip.transition()
					.duration(100)
					.style('opacity', 0);
}