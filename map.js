/*
 * Map for Data Visualization Stories
 * Heavily Drawn from Eric's Lab Example
 * CS 314, Spring 2017
 * Veronica Child and Adam Klein
*/

var width = 960;
var height = 500;

// These may be useful to refer back to the data after its loaded
var geoData;        // Geographic data of state shapes loaded from JSON file
var stateData;      // State-by-state data loaded from CSV file
var stateToData;    // Object mapping state name to stateData object
var dataAttributes; // Columns to be found in stateData CSV
var colorScale;     // d3 scale mapping data to color
var state;          // d3 selection containing the .state elements

//var colorVar = 'PCTPOV017_2015'; // Populate by percent in poverty overall
var povAll = 'POVALL_2015';
var pov17 = 'POV017_2015';


// Define projection and geoPath that will let us convert lat/long to pixel coordinates
var projection = d3.geo.albersUsa();
var geoPath = d3.geo.path()
        .projection(projection);

// Add svg and g elements to the webpage
var svg = d3.select("#mapDiv").append("svg")
        .attr("width", width)
        .attr("height", height);

// Add tooltip
var div = d3.select('#mapDiv').append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0);

// Add color scale gradient legen
// From tutorial: https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
var defs = svg.append('defs')
			.attr('class', 'key');
var linearGradient = svg.append('linearGradient')
	.attr('id', 'linear-gradient');

// Set gradient legen from min to max
linearGradient
	.attr('x1', '0%')
	.attr('y1', '0%')
	.attr('x2', '100%')
	.attr('y2', '0%');

svg.append('text')
	.attr('class', 'caption')
	.attr('x', 500)
	.attr('y', 485)
	.text('Percent in Poverty');

// Using the global variables that have been set for geoData, stateData, etc, build map
var buildMap = function() {
	// data = geoData.features.filter( function(d) {
 //        if ( (d[vals[0]]%1000) == 0) {return d;}
 //    });


    // Create paths for each state
    state = svg.selectAll('.state')
        // gets state coords from JSON
        //.data(geoData.features);
        .data(geoData.features);


    // Append paths to the enter selection
    // Creates one path per GeoJSON feature
    state
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', geoPath) // bind SVG path
        // outlines states
        .style('stroke', 'white')
        // colors in state
        .style('fill', 
        	// 'grey'
        	function(d){
        	//console.log(d)
        	// gets info from mapping by Name
        	// d = json data (which is bound to object)
        	// stateToDate = object form of CSV data

  			var count = Object.keys(d).length; // gets number of CSV attribute - could use to differentiate if county or state
  			//console.log(count);

            i = (parseInt(stateToData[d.properties.name][pov17]) / 
                 parseInt(stateToData[d.properties.name][povAll]));
            console.log(stateToData[d.properties.name][pov17])
            console.log(stateToData[d.properties.name][povAll])
            console.log(i);
            return colorScale(i);
   		}
    	)
        .on('click', function(d) {
            console.log(d.properties.name);
        })
        .on('mouseover', function(d) {
        	d3.select(this).style('fill-opacity', '.7');
        	div.transition()
        		.duration(500)
        		.style('opacity', .9);
        	div.style('display', 'inline');
        	div.text(d.properties.name + "\n" + Math.round(((parseInt(stateToData[d.properties.name][pov17])/parseInt(stateToData[d.properties.name][povAll])) * 10000))/100 + "%")
        		.style('left', (d3.event.pageX) + "px")     
           		.style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mousemove', function(d) {
        	div.style('left', (d3.event.pageX) + "px")
           		.style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mouseout', function(d) {
        	div.style('opacity', 0);
        	d3.select(this).style('fill-opacity', '1');
        });

    // use for built-in title
    // state
    //     .append('svg:title')
    //     .text(function(d){ return d.properties.name; });   
};

// First, let's load the geographical data (in JSON format)
d3.json('usCoords.json', function(error, jsonData) {
    geoData = jsonData;

    // Next, let's load a CSV with economic data
    d3.csv('povertyYoungAdults.csv', function(csvData) {
        stateData = csvData;

        // Store data attributes in array
        dataAttributes = Object.keys(stateData[0]);

        // Create a mapping from state name to object representing row of CSV
        stateToData = {};
        for (var i = 0; i < stateData.length; i++) {
            stateToData[stateData[i]['Area_Name']] = stateData[i];
            //console.log(stateData[i])
        }
        //console.log(stateToData);
        
        var minDataVal = d3.min(stateData, function(d) { return parseInt(d[pov17])/parseInt(d[povAll]); });
        var maxDataVal = d3.max(stateData, function(d) { return parseInt(d[pov17])/parseInt(d[povAll]); });
        var minColor = 'steelblue';
        var maxColor = 'crimson';
        
        colorScale = d3.scale.linear()
        .domain([minDataVal, maxDataVal])
        .range([minColor, maxColor]);

        // Set color for gradient
        linearGradient.selectAll('stop')
        	.data( colorScale.range() )
        	.enter().append('stop')
        	.attr('offset', function(d,i) { return i/(colorScale.range().length-1); })
        	.attr('stop-color', function(d) { return d; });

        //Draw the rectangle and fill with gradient
		svg.append("rect")
			// position rectangle
			.attr('x', 500)
			.attr('y', 490)
			.attr("width", 300)
			.attr("height", 20)
			.style("fill", "url(#linear-gradient"); // fill with gradient id

        
        // Build the vis!
        buildMap();
    });
});