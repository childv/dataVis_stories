/*
 * Map for Data Visualization Stories
 * Heavily Drawn from Eric's Lab Example
 * CS 314, Spring 2017
 * Veronica Child and Adam Klein
*/

var margin = 10;    // Margin around vis
var xOffset = 60;   // Space for x-axis labels
var yOffset = 80;   // Space for y-axis labels
var width = 960;    // Width of map    
var height = 600;   // Height of map

var sp_size = 300;  // Width + height of scatter plot

var t_width = width + sp_size;
var t_height = 600; //Total width and height

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
var projection = d3.geo.albersUsa()
    .translate([width/2 - 100 - margin, height/2])  // translates to center of screen
    .scale([1000]); // scale down US map
var geoPath = d3.geo.path()
    .projection(projection);

// Map SVG
var mapSVG = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

// Title
mapSVG.append("text")
    .attr('x', margin)
    .attr('y', yOffset/2)
    .attr('text-anchor', 'start')
    .text("Young Adult Poverty by State")
    .attr("font-family", "sans-serif")
    .attr("font-size", "30px")
    .attr("font-weight", "bold")
    .attr("fill", "black");

// Add tooltip
var div = d3.select('body').append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0);

// Add color scale gradient legend
// Drawn from Mike Bostock's Choropleth: https://bl.ocks.org/mbostock/4060606
var legend = mapSVG.append('g')
        .attr('class', 'key');

// Scatterplot SVG
var spSVG = d3.select("body")
    .append('svg')
     .attr('width', sp_size)
     .attr('height', sp_size)
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
            i = parseInt(stateToData[d.properties.name][pov17All]);
            return colorScale(i);
   		})
        .on('click', function(d) {
            console.log(d.properties.name);
        })
        .on('mouseover', function(d) {
        	d3.select(this).style('fill-opacity', '.7'); // lighten state
        	// Tooltip
            div.transition()
        		.duration(500)
        		.style('opacity', .9)
                .style('background', 'white');
            // Tooltip text
        	div.text(d.properties.name + "\n" +
                d3.round(stateToData[d.properties.name][pov17All], 2) + "%")
                // Math.round((((parseInt(stateToData[d.properties.name][pov17])/parseInt(stateToData[d.properties.name][povAll])) * 10000))/100) + "%")
        		.style('left', (d3.event.pageX) + "px")     
           		.style("top", (d3.event.pageY - 28) + "px");
        })
        .on('mousemove', function(d) {
        	div.style('left', (d3.event.pageX) + "px")
           		.style("top", (d3.event.pageY - 28) + "px");
            // Toggle corresponding point
            spSVG.selectAll('circle')
                .filter(function(d2) {
                    if (d.properties.name == d2.Area_Name) {
                        return d2; }})
                .style('fill', 'yellow')
                .attr('z-index', '100');
        })
        .on('mouseout', function(d) {
        	div.style('opacity', 0);
        	d3.select(this).style('fill-opacity', '1');

            spSVG.selectAll('circle')
                .filter(function(d2) {
                    if (d.properties.name == d2.Area_Name) {
                        return d2;
                    }})
                .style('fill', 'lightgreen');
        });  
};

var buildSP = function() {
    // Formatting axis numbers
    var kformat = d3.format("s");

    // x-axis: total poverty
    var totalScale = d3.scale.linear()
        .domain([d3.min(stateData, function(d) { return parseFloat(d[povAll]); }),
                d3.max(stateData, function(d) { return parseFloat(d[povAll]); })])
        .range([yOffset + margin, sp_size - margin]); // be sure to change y axis transformation too

    var totalAxis = d3.svg.axis()
        .scale(totalScale)
        .orient("bottom")
        .ticks(5)
        .tickFormat(function(d) { return d3.format(".3s")(d); });

    // y-axis: young adults in poverty
    var youngScale = d3.scale.linear()
        .domain([d3.min(stateData, function(d) { return parseFloat(d[pov17]); }),
                d3.max(stateData, function(d) { return parseFloat(d[pov17]); })])
        .range([sp_size - xOffset - margin, margin]);
    
    var youngAxis = d3.svg.axis()
        .scale(youngScale)
        .orient("left")
        .ticks(5)
        // Formats into "millions"
        .tickFormat(function(d) { return d3.format(".3s")(d); });

    // Add X axis
    spSVG.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (sp_size - xOffset) + ")")
        .call(totalAxis)
        // rotate x ticks
        .selectAll('text')
            .style('text-anchor', 'end')
            .attr('transform', 'rotate(-60)')
            .attr("font-family", "sans-serif");

    // Add X Label
    spSVG.append('text')
        .attr('class','label')
        .attr('x', sp_size/2 - xOffset)
        .attr('y', sp_size - margin)
        .style('text-align', 'center')
        .text("Poverty Overall (Thousands)")
        .attr("font-family", "sans-serif");

    //Add Y axis
    spSVG.append("g")
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + yOffset + ',0)')
        .call(youngAxis)
        .selectAll('text')
        .attr('font-family', 'sans-serif');

    // Load points
    var circle = spSVG.selectAll('circle')
        .data(stateData);

    circle.enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', function(d) { return totalScale(parseFloat(d[povAll])); })
        .attr('cy', function(d) { return youngScale(parseFloat(d[pov17])); })
        .attr('r', 5)
        .style('fill', 'lightgreen')
        .style('opacity', .3)
        .style('stroke', 'black')
        .style('stroke-width', 2)

        // Mouse actions
        .on('mouseover', function(d) {
            d3.select(this).style('fill', 'yellow')
            .style('z-index', '100');
            // Select state
            mapSVG.selectAll('.state')
                .filter(function(d2) {
                    if (d2.properties.name == d.Area_Name) { 
                    return d; }})
                .style('opacity', .7);
            // Tooltip
            div.transition()
                .duration(500)
                .style('opacity', .9);
            div.style('display', 'inline')
                .style('background', 'lightgrey');
            // Tooltip text
            div.text(d.Area_Name + "\n" +
                d3.round(stateToData[d.Area_Name][pov17All], 2) + "%")
                .style('left', (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");
        })

        .on('mouseout', function(d) {
            d3.select(this).style('fill', 'lightgreen');
            mapSVG.selectAll('.state')
                .filter(function(d2) {
                    if (d2.properties.name == d.Area_Name) { return d; }})
                .style('opacity', 1);
            div.transition()
                .duration(50)
                .style('opacity', 0);
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
            // Keep length of 300
            .range([width - 560, width - 260]); // positions on x
        
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
            // positions color bars
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
                i = parseInt(d[pov17All]);
                return colorScale(i); 
            });
        
        // Call x axis; css in html hides it
        legend.attr('class', 'color axis')
            // positions scale on y axis
            .attr('transform', 'translate(0,' + (height - 50) + ')')
            .call(xAxis)
            .selectAll('text')
            .style('font-family', 'sans-serif');
        
        // Adds legend caption
        legend.append('text')
            .attr('class', 'caption')
            .attr('x', x.range()[0])
            .attr('y', -3)
            .text("% of Impoverished 17 and Under")
            .attr("font-family", "sans-serif");

        // Build the vis!
        buildMap();
        buildSP();
    });
});