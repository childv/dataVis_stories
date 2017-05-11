/* Code by Adam Klein and Veronica Child */

w = 800;
h = 1300;
//outer margin of the svg
margin = 60;
//space between the two bar graphs
buffer = 100;
//y-coord where the axes begin
axisOffset = margin + 50;
//space between bars
padding = 10;
barWidth = 15;

vals = ['FIPStxt', 'State', 'Area_Name', 'PCTPOVALL_2015', 'MEDHHINC_2015'];

d3.csv('povertyData.csv', function(csvData) {
    // Filters data off the bat to just be states!!
    data = csvData.filter( function(d) {
            if ( (d[vals[0]]%1000) == 0) {return d;}
        });
    
    svg = d3.select('#barSVG').append('svg:svg')
        .attr('width', w)
        .attr('height', h);
    
    //scales poverty % data
    //note range is from right to left
    povScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return parseFloat(d[vals[3]]); })])
        .range([w/2 - (buffer/2), margin]);
    
    //scales median income data
    incScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return parseFloat(d[vals[4]]); })])
        .range([(w/2 + (buffer/2)), w-margin]);
    
    // y scale for entire graph
    // yScale = d3.scale.linear()
    //     .domain([0, 50])
    //     .range([axisOffset + padding, h-margin]);

    // Working ordinal yScale! Just change bar binding to return yScale(d.Area_Name)
    yScale = d3.scale.ordinal()
        .domain( data.map(function(d) {
            return d[vals[2]];
        }))
        .rangePoints([axisOffset + padding, h-margin]);
    
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("right");

    yAxisG = svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);


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
        .attr('class', '.axislabel')
        .attr('x', w/2)
        .attr('y', axisOffset-25)
        .attr('text-anchor', 'middle')
        .text("State")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("cursor", "pointer")
        .on('click', function() {
            change(2)
            d3.selectAll("text")
                .filter(function(){
                    return (this.classList.contains('.axislabel'));})
                .attr("fill", function(){
                return "grey";
            });
            d3.select(this).transition()
                .duration(200)
                .attr("fill", "black");
        });
    
    
    //poverty label
    svg.append("text")
        .attr('class', '.axislabel')
        .attr('x', (margin + ((w - (margin*2)) - buffer)/4))
        .attr('y', axisOffset-25)
        .attr('text-anchor', 'middle')
        .text("% in Poverty")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "gray")
        .attr("cursor", "pointer")
        .on('click', function() {
            change(3)
            d3.selectAll("text")
                .filter(function(){
                    return (this.classList.contains('.axislabel'));})
                .attr("fill", function(){
                return "grey";
            });
            d3.select(this).transition()
                .duration(200)
                .attr("fill", "black");
        });
    
    //income label
    svg.append("text")
        .attr('class', '.axislabel')
        .attr('x', w - (margin + ((w - (margin*2)) - buffer)/4))
        .attr('y', axisOffset-25)
        .attr('text-anchor', 'middle')
        .text("Median Income ($)")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .attr("fill", "gray")
        .attr("cursor", "pointer")
        .on('click', function() {
            change(4)
            d3.selectAll("text")
                .filter(function(){
                    return (this.classList.contains('.axislabel'));})
                .attr("fill", function(){
                return "grey";
            });
            d3.select(this).transition()
                .duration(200)
                .attr("fill", "black");
        });
    
    change(2);
    drawBars();
});

//draws the bars
function drawBars() {
    /* Keeping track of order
    // - global variable "povOrder" : if you sort it, clicking on label would change global,
    // which would then change y position of all of our bars.
        **could give us a state id; ex. if it's the 3rd state
        1. sort pov order then 2. call new y
    /
    d3.selectAll('.pov')
    .transition()
    .duration(1000)
    .attr('y', function(d) {
        povOrder.indexof(3) = use to determine new order within y scale
    
    })
    */

    var povBar = svg.selectAll('.pov')
        .data(data);
    
    format = d3.format("0,000");

    povBar.enter()
        .append('g')
        //.append('svg:rect')
        .attr('class', '.pov')
        .append('rect')
        .attr('height', barWidth)
        .attr('y', function(d) {
            // order according to area name
            return yScale(d[vals[2]]);
        })
        .attr('x', function(d) { return povScale(d[vals[3]]); })
        .attr('width', function(d) {
            results = ((w/2) - (buffer/2)) - povScale(d[vals[3]]);
            return results;
        })
        .style('fill', '#68935B');

    // Adds numbers to bars
    povBar
        //.append('svg:text')
        .append('text')
        .attr('class', '.bartext')
        .attr('text-anchor', 'start')
        .attr('x', function(d) {
                return (povScale(d[vals[3]]) + 5);
            //}
        })
        .attr('y', function(d) { return yScale(d[vals[2]]); })
        .attr('dy', barWidth/2 + 4)
        .text(function(d) { return d[vals[3]]; })
        .style('fill', 'white')
        .style('z-index', '100');
        
    var incBar = svg.selectAll('.inc')
        .data(data);
    
    counter = axisOffset;
    
    incBar.enter()
        .append('g')
        .append('svg:rect')
        .attr('class', '.inc')
        .attr('height', barWidth)
        .attr('y', function(d, i) {
            // order according to area name
            return yScale(d[vals[2]]);
        })
        .attr('x', function(d) {
            return w/2 + (buffer/2);
        })
        .attr('width', function(d) {
            results = incScale(d[vals[4]]) - (w/2 + (buffer/2));
            return results;
        })
        .style('fill', '#66789A');
    
    incBar
        .append('text')
        .attr('class', '.bartext')
        .attr('text-anchor', 'end')
        .attr('x', function(d) {
            return (incScale(d[vals[4]]) - 5);
        })
        .attr('y', function(d) { return yScale(d[vals[2]]); })
        .attr('dy', barWidth/2 + 4)
        .text(function(d) { return format(d[vals[4]]); })
        .style('fill', 'white')
        .style('z-index', '100');
    
    var barText = svg.selectAll(".names")
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
        .attr('y', function(d) { return yScale(d[vals[2]]) + barWidth; })
        .text(function(d) { return d[vals[2]]; });
}

function change(index) {
    checked = true;
    if (index == 2) {
        checked = false;
    }

    // Sorts domain
    // drawn from https://bl.ocks.org/mbostock/3885705
    var y = yScale.domain(data.sort(checked
        // sort by poverty
        ? function(a, b) { return b[vals[index]] - a[vals[index]] }
        // sort by name
        : function(a, b) { return d3.ascending(a.Area_Name, b.Area_Name); })
        .map(function(d) { return d.Area_Name; }));

    // Moves all rectangles to position based on their name 
    svg.selectAll('rect')
        .transition()
            .duration(1000)
        .attr('y', function(d) {
            return y(d[vals[2]]);
        });

    // Moves all text to position based on their name
    d3.selectAll("text")
        .filter(function(d){
            return this.classList.contains('.names');
        })
        .transition()
            .duration(1000)
            .attr('y', function(d) {
                return y(d[vals[2]])+barWidth;
            });

    d3.selectAll("text")
        .filter(function(d){
            return this.classList.contains('.bartext');
        })
        .transition()
            .duration(1000)
            .attr('y', function(d) {
                return y(d[vals[2]]);
            });
}