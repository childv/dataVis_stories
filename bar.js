/* Code by Adam Klein and Veronica Child */

w = 800;
h = 2000;
//outer margin of the svg
margin = 60;
//space between the two bar graphs
buffer = 100;
//y-coord where the axes begin
axisOffset = margin + 50;
//space between bars
padding = 5;
barWidth = 15;

vals = ['FIPStxt', 'State', 'Area_Name', 'PCTPOVALL_2015', 'MEDHHINC_2015'];

d3.csv('povertyData.csv', function(csvData) {
    data = csvData;
    
    svg = d3.select('#barSVG').append('svg:svg')
        .attr('width', w)
        .attr('height', h);
    
    //scales poverty % data
    //note range is from right to left
    povScale = d3.scale.linear()
        /*
        .domain([d3.min(data, function(d) { return parseFloat(d[vals[3]]); })-1,
                 d3.max(data, function(d) { return parseFloat(d[vals[3]]); })+1])
        */
        .domain([0, d3.max(data, function(d) { return parseFloat(d[vals[3]]); })+1])
        .range([w/2 - (buffer/2), margin]);
    
    //scales median income data
    incScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return parseFloat(d[vals[4]]); })+1])
        .range([(w/2 + (buffer/2)), w-margin]);
    
    // Build axes!
    povAxis = d3.svg.axis()
        .scale(povScale) // scale to x range
        .orient('top')
        .ticks(5);

    // Create a group element for the axis called
    povAxisG = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + axisOffset + ')')
        .call(povAxis); // calls axis function
    
    // Build axes!
    incAxis = d3.svg.axis()
        .scale(incScale) // scale to x range
        .orient('top')
        .ticks(5);

    // Create a group element for the axis called
    incAxisG = svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + axisOffset + ')')
        .call(incAxis); // calls axis function
    
    //title
    svg.append("text")
        .attr('x', w/2)
        .attr('y', margin/2)
        .attr('text-anchor', 'middle')
        .text("Poverty to Median Income by State")
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("fill", "black");
    
    //state label
    svg.append("text")
        .attr('x', w/2)
        .attr('y', axisOffset-25)
        .attr('text-anchor', 'middle')
        .text("State")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "black");
    
    //poverty label
    svg.append("text")
        .attr('x', (margin + ((w - (margin*2)) - buffer)/4))
        .attr('y', axisOffset-25)
        .attr('text-anchor', 'middle')
        .text("% in Poverty")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "black");
    
    //income label
    svg.append("text")
        .attr('x', w - (margin + ((w - (margin*2)) - buffer)/4))
        .attr('y', axisOffset-25)
        .attr('text-anchor', 'middle')
        .text("Median Income ($)")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "black");
    
    drawBars();
});

//draws the bars
function drawBars() {
    //for interaction, might come back and make both
    //sides the same variable "bar"
    var povBar = svg.selectAll('.pov')
        .data(data);

    counter = axisOffset;
    
    povBar.enter()
        .append('svg:rect')
        .filter(function(d){
            if ( (d[vals[0]]%1000) == 0) {return d;}
        })
        .attr('class', '.pov')
        //.attr('class', '.pov')
        .attr('height', barWidth)
        .attr('y', function() {
            counter += padding + barWidth;
            return counter;
        })
        .attr('x', function(d) {
            //console.log(d);
            return povScale(d[vals[3]]);
        })
        .attr('width', function(d) {
            results = ((w/2) - (buffer/2)) - povScale(d[vals[3]]);
            return results;
        })
        .style('fill', 'green');
        
    var incBar = svg.selectAll('.inc')
        .data(data);
    
    counter = axisOffset;
    
    incBar.enter()
        .append('svg:rect')
        .filter(function(d){
            if ( (d[vals[0]]%1000) == 0) {return d;}
        })
        .attr('class', '.inc')
        .attr('height', barWidth)
        .attr('y', function() {
            counter += padding + barWidth;
            return counter;
        })
        .attr('x', function(d) {
            console.log(d['MEDHHINC_2015']);
            return w/2 + (buffer/2);
        })
        .attr('width', function(d) {
            results = (w - (margin)) - incScale(d[vals[4]]);
            console.log(d);
            console.log(d[vals[4]]);
            console.log(results);
            return results;
        /*
            if (results < 0) {
                console.log(d);
                return 0;}
        */
        })
        .style('fill', 'red');
    
    var barText = svg.selectAll('.names')
        .data(data);
        
    counter = axisOffset + barWidth;
    
    barText.enter()
        .append('svg:text')
        .filter(function(d){
            if ( (d[vals[0]]%1000) == 0) {return d;}
        })
        .attr('class', '.names')
        .attr('text-anchor', 'middle')
        .attr('x', (w/2))
        .attr('y', function() {
            counter += padding + barWidth;
            return counter;
        })
        .text(function(d){
            return d[vals[2]];
        });
}

//sorts the data by given index
//function sort(valIndex) {
    
//}