/**
* Hit chart view component based on nv.d3 js lib.
*/
function HitChart(hitList, windowWidth) {
	
	var barWidth = 10;
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = windowWidth - margin.left - margin.right - 120, // page margin
    height = 160 - margin.top - margin.bottom;

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

	var chart = nv.models.stackedAreaChart()
    .margin({right: 40, bottom: 30})
    .x(function(d) { return d[0] })
    .y(function(d) { return d[1] })
    .useInteractiveGuideline(true)  
    //.rightAlignYAxis(true)    
    .duration(300);
		//.showControls(true) 
    //.clipEdge(true);

  chart.xAxis
    .tickFormat(function(d) { 
      return d3.time.format('%x')(new Date(d)) 
  });

  d3.select('#chart')
    .datum(data)
    .call(chart);

  nv.utils.windowResize(chart.update);	
}
