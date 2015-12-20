/**
* Hit graph view component.
*/
function HitGraph() {	
	this.barWidth = 10;
	this.margin = {left: 40, top: 20, right: 20, bottom: 40};
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

	var x = d3.time.scale().range([0, this.width]); //.rangeRound([0, width]);
	var y = d3.scale.linear().range([this.height, 0]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
	
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
		
	d3.select("#graph").selectAll("svg").remove();
	var svg = d3.select("#graph").append("svg")
    .attr("width", this.width + this.margin.left + this.margin.right)
    .attr("height", this.height + this.margin.top + this.margin.bottom)
		.append("g")
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  x.domain(d3.extent(dataList, function(d) { return d.date; }));
  //y.domain(d3.extent(hitList, function(d) { return d.minKills; }));
	y.domain([0, d3.max(dataList, function(d) { return d.maxKills; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Kills");

	svg.append("g")         
      .attr("class", "grid")
      .call(yAxis
            .tickSize(-this.width, 0, 0)
            .tickFormat("")
        );
	
	svg.append("path")
      .datum(dataList)
      .attr("class", "area")
      .attr("d", maxKillsArea);
			
	/*
	svg.selectAll(".bar")
    .data(dataList)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", '10') 
      .attr("y", function(d) { return y(d.minKills); })
      .attr("height", function(d) { return height - y(d.minKills); });
	*/
	
	// line 
  svg.append("path")
      .datum(dataList)
      .attr("class", "line")
      .attr("d", line);	
}