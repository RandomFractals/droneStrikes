/**
* Hit chart view component based on nv.d3 js lib.
*/
function HitChart(hitList, viewWidth, viewHeight) {
	
	// must be a better way to do this		
	var data = [
		{"key": "max", "values": []},
		{"key": "min", "values": []},
		{"key": "civilians", "values": []},		
		{"key": "children", "values": []}		
	];
	var hit;
	for (var i=0; i<hitList.length; i++) {
		hit = hitList[i];
		data[0].values.push( [ hit.date, hit.maxKills ] );
		data[1].values.push( [ hit.date, hit.minKills ] );
		data[2].values.push( [ hit.date, hit.civilians ] );
		data[3].values.push( [ hit.date, hit.children ] );
	}

	this.chart = nv.models.stackedAreaChart()
    .margin({left: 40, right: 110, bottom: 30})
    .x(function(d) { return d[0] })
    .y(function(d) { return d[1] })
    .useInteractiveGuideline(true)  
		.clipEdge(true)
    .duration(300);
		//.showControls(true) 

	this.chart.width(viewWidth);
	this.chart.height(viewHeight);
	
  this.chart.xAxis
    .tickFormat(function(d) { 
      return d3.time.format('%x')(new Date(d)) 
  });

  d3.select('#chart')
    .datum(data)
    .call(this.chart);

	this.chart.update();		
  nv.utils.windowResize(this.chart.update);	
}
