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

var colorVar = 'PCTPOV017_2015'; // Populate by percent in poverty overall

// Define projection and geoPath that will let us convert lat/long to pixel coordinates
var projection = d3.geo.albersUsa();
var geoPath = d3.geo.path()
        .projection(projection);

// Add svg and g elements to the webpage
var svg = d3.select("#mapDiv").append("svg")
        .attr("width", width)
        .attr("height", height);

// Using the global variables that have been set for geoData, stateData, etc, build map
var buildMap = function() {
    // Create paths for each state
    state = svg.selectAll('.state')
        .data(geoData.features);

    // Append paths to the enter selection
    state
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', geoPath)
        .style('fill', function(d){
        	//console.log(d)
            i = stateToData[d.properties.name][colorVar];
            return colorScale(i);
    })
        .on('click', function(d) {
            console.log(d.properties.name);
        });

    
    state
        .append('svg:title')
        .text(function(d){ return d.properties.name; });   
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
        }
        //console.log(stateToData);
        
        var minDataVal = d3.min(stateData, function(d) { return parseInt(d[colorVar]); });
        var maxDataVal = d3.max(stateData, function(d) { return parseInt(d[colorVar]); });
        var minColor = 'crimson';
        var maxColor = 'steelblue';
        
        colorScale = d3.scale.linear()
        .domain([minDataVal, maxDataVal])
        .range([minColor, maxColor]);

        
        // Build the vis!
        buildMap();
    });
});