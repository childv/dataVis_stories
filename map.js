/*
 * Map for Data Visualization Stories
 * Heavily Drawn from Eric's Lab Example
 * CS 314, Spring 2017
 * Veronica Child and Adam Klein
*/

var margin = 30;
var bottom_margin = 80;
var width = 960;
var height = 600;

var sp_width = 600;
var sp_height = 600;

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
var pov17All = 'PCT17POV_2015';


// Define projection and geoPath that will let us convert lat/long to pixel coordinates
var projection = d3.geo.albersUsa();
var geoPath = d3.geo.path()
        .projection(projection);

// Add svg and g elements to the webpage
var mapSVG = d3.select("body")
        .append("svg")
         .attr("width", width)
         .attr("height", height);
        // .append('g');
         //.attr('transform', 'translate(' + margin  + "," + margin + ")");

// Add tooltip
var div = d3.select('body').append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0);

// Add color scale gradient legend
// Drawn from Mike Bostock's Choropleth: https://bl.ocks.org/mbostock/4060606
var legend = mapSVG.append('g')
        .attr('class', 'key');

legend.append('text')
	.attr('class', 'caption')
	.attr('x', 500)
	.attr('y', 485)
    .attr('text-anchor', 'start')
	.text('Percent in Poverty');

var spSVG = d3.select("body")
    .append('svg')
     .attr('width', sp_width)
     .attr('height', sp_height)
    .append('g');

// Using the global variables that have been set for geoData, stateData, etc, build map
var buildMap = function() {
    // Create paths for each state
    state = mapSVG.selectAll('.state')
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
        .style('fill', function(d) {
        	// gets info from mapping by Name
        	// d = json data (which is bound to object)
        	// stateToDate = object form of CSV data
  			var count = Object.keys(d).length; // gets number of CSV attribute - could use to differentiate if county or state
            // i = (parseInt(stateToData[d.properties.name][pov17]) / 
            //      parseInt(stateToData[d.properties.name][povAll]));
            // return colorScale(i);
            i = parseInt(stateToData[d.properties.name][pov17All]);
            return colorScale(i);
   		})
        .on('click', function(d) {
            console.log(d.properties.name);
        })
        .on('mouseover', function(d) {
        	d3.select(this).style('fill-opacity', '.7');
        	div.transition()
        		.duration(500)
        		.style('opacity', .9);
        	div.style('display', 'inline');
        	div.text(d.properties.name + "\n" +
                d3.round(stateToData[d.properties.name][pov17All], 2) + "%")
                // Math.round((((parseInt(stateToData[d.properties.name][pov17])/parseInt(stateToData[d.properties.name][povAll])) * 10000))/100) + "%")
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

var buildSP = function() {
    // x-axis: total poverty
    var totalScale = d3.scale.linear()
        .domain([d3.min(stateData, function(d) { return parseInt(d[povAll]); }),
                d3.max(stateData, function(d) { return parseInt(d[povAll]); })])
        .range([margin, sp_width]); // be sure to change y axis transformation too

    var totalAxis = d3.svg.axis()
        .scale(totalScale)
        .orient("bottom")
        .ticks(5);

    // y-axis: young adults in poverty
    var youngScale = d3.scale.linear()
        .domain([d3.min(stateData, function(d) { return parseInt(d[pov17]); }),
                d3.max(stateData, function(d) { return parseInt(d[pov17]); })])
        .range([sp_height - bottom_margin, margin]);

    var youngAxis = d3.svg.axis()
        .scale(youngScale)
        .orient("left")
        .ticks(5);

    // Add X axis
    spSVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin + "," + (sp_height - bottom_margin) + ")")
        .call(totalAxis);

    //Add Y axis
    spSVG.append("g")
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (margin * 2) + ',0)')
        .call(youngAxis);

    var circle = spSVG.selectAll('circle')
        .data(stateData);

    circle.enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', function(d) { return totalScale(parseInt(d[povAll])); })
        .attr('cy', function(d) { return youngScale(parseInt(d[pov17])); })
        .attr('r', 5)
        .style('fill', 'lightgreen')

        .on('mouseover', function(d) {
            console.log(d.Area_Name)
            d3.select(this).style('fill', 'yellow');
        })
        .on('mouseout', function(d) {
             d3.select(this).style('fill', 'lightgreen');
        });
};

// First, let's load the geographical data (in JSON format)
d3.json('usCoords.json', function(error, jsonData) {
    geoData = jsonData;

    // Next, let's load a CSV with economic data
    d3.csv('povertyYoungAdults.csv', function(csvData) {
        // Filters data off the bat to just be states!!
        stateData = csvData.filter( function(d) {
            if ( (d.FIPStxt % 1000) == 0) { return d; }
        });

        // Create a mapping from state name to object representing row of CSV
        stateToData = {};
        for (var i = 0; i < stateData.length; i++) {
            stateToData[stateData[i]['Area_Name']] = stateData[i];
        }
        
        var minDataVal = d3.min(stateData, function(d) { 
            //return (parseInt(d[pov17])/parseInt(d[povAll])); });
            return (parseInt(d[pov17All])); });
        var maxDataVal = d3.max(stateData, function(d) {
            //return (parseInt(d[pov17])/parseInt(d[povAll])); });
            return (parseInt(d[pov17All])); });
        var minColor = 'steelblue';
        var maxColor = 'crimson';
        
        // Set up axis for gradient scale
        x = d3.scale.linear()
            .domain([minDataVal, maxDataVal])
            .range([width - 360, width - 60]);
        
        xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            .ticks(7)
            .tickFormat(function(d) { return d + "%"; });
        
        // Set up color mapping for gradient scale
        colorScale = d3.scale.linear()
        .domain([minDataVal, maxDataVal])
        .range([minColor, maxColor]);

        legend.selectAll('rect')
            .data(stateData)
            .enter()
            .append('rect')
            // position rectangle
            .attr('x', function(d) {
                m = parseInt(d[pov17All]);
                if (m >= 37) { 
                    return x(36.5);
                } else { 
                    return x(m); }
            })
            .attr('width', 40)
            .attr('height', 8)
            .style('fill', function(d) {
                // i = (parseInt(d[pov17]) / parseInt(d[povAll]));
                // console.log(colorScale(i));
                i = parseInt(d[pov17All]);
                return colorScale(i); 
            });
        
        // Call x axis; html hides it
        legend.attr('class', 'color axis')
            .call(xAxis)
            .attr('transform', 'translate(0,' + (height - 100) + ')');
        
        legend.append('text')
            .attr('class', 'caption')
            .attr('x', x.range()[0])
            .attr('y', -3)
            .text("% of Impoverish 17 and Under");

        // Build the vis!
        buildMap();
        buildSP();
    });
});