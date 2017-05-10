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
    //data = csvData;

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
        /*
        .domain([d3.min(data, function(d) { return parseFloat(d[vals[3]]); })-1,
                 d3.max(data, function(d) { return parseFloat(d[vals[3]]); })+1])
        */
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
        .attr("fill", "black")
        
        .on('click', function() {
            //console.log(data)
            //console.log(sort(3));
            change();
        });
    
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

    //counter = 0;
    povBar.enter()
        .append('svg:rect')
        .attr('class', '.pov')
        //.attr('class', '.pov')
        .attr('height', barWidth)
        .attr('y', function(d, i) {
            // order according to area name
            return yScale(d[vals[2]]);
            //return yScale(d.Area_Name); - would bind name of states to y scale
            //return yScale(i);
        })
        .attr('x', function(d) {
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
        // .filter(function(d){
        //     if ( (d[vals[0]]%1000) == 0) {return d;}
        // })
        .attr('class', '.inc')
        .attr('height', barWidth)
        // .attr('y', function() {
        //     counter += padding + barWidth;
        //     return counter;
        // })
        .attr('y', function(d, i) {
            // order according to area name
            return yScale(d[vals[2]]);
            //return yScale(i);
        })
        .attr('x', function(d) {
            return w/2 + (buffer/2);
        })
        .attr('width', function(d) {
            results = (w - (margin)) - incScale(d[vals[4]]);
            return results;
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
        // .attr('y', function() {
        //     counter += padding + barWidth;
        //     return counter;
        // })
        .attr('y', function(d, i) {
            // order according to area name
            return yScale(d[vals[2]]) + barWidth;
            //return yScale(i) + barWidth;

        })
        .text(function(d) { return d[vals[2]]; });
}

//sorts the data by given index
function sort(valIndex) {
    
    //data = data.sort(d3.descending);
    //drawBars();
    
    data
        .filter(function(d){
            if ( (d[vals[0]]%1000) == 0) {return d;}
        })
        .sort(function(a, b) {              
            return d3.descending(parseFloat(a[vals[3]]), parseFloat(b[vals[3]]));
    });
    
    counter = axisOffset;
    
    svg.selectAll('.pov')
        .each(function(d) {
            d3.select(this).attr('y', function() {
            counter += padding + barWidth;
            return counter;
        });
    });
    
}

function change() {
    // Copy-on-write since tweens are evaluated after a delay.
    checked = false;

    // Sorts domain
    // drawn from https://bl.ocks.org/mbostock/3885705
    var y = yScale.domain(data.sort(checked
        // sort by poverty
        ? function(a, b) { return b[vals[3]] - a[vals[3]] }
        // sort by name
        : function(a, b) { return d3.ascending(a.Area_Name, b.Area_Name); })
        .map(function(d) { return d.Area_Name; }));

    // Moves all rectangles to position based on their name 
    svg.selectAll('rect')
        .attr('y', function(d) {
            return y(d[vals[2]]);
        });

    // Moves all text to position based on their name
    svg.selectAll('text')
        .filter(function(d) {
            if (this.attr.class == '.names') {
            return this;
        }
        })
        .attr('y', function(d) { return y(d[vals[2]]); });

    // 
    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll('.pov')
        .delay(delay)
        .attr("y", function(d) { return y(d.Area_Name); });

    // transition.select(".y.axis")
    //     .call(yAxis)
    //     .selectAll("g")
    //     .delay(delay); 
}