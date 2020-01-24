// @TODO: YOUR CODE HERE!
var svgWidth = 450;
var svgHeight = 400;

var margin = {
    top: 50,
    right: 50,
    bottom: 80,
    left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//funtion to pase date
var parseDate = d3.time.format("%Y-%m-%d").parse

//set ranges
var xScale = d3.time.scale().range([0, width]);
var yScale = d3.scale.linear().range([height, 0])

//axis functions
var bottomAxis = d3.svg.axis().scale(xScale)
    .orient("bottom").ticks(6);

var leftAxis = d3.svg.axis().scale(yScale)
    .orient("left").ticks(8);


//This is empty space for map
var svg1 = d3.select("#map")
    .append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Review vs date
//create svg wrapper and append svg group
var svg1 = d3.select("#chart1")
    .append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup1 = svg1.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body")
    .append("div")
    .attr("class", "d3-tip")

d3.csv("data/Reviews.csv", function (airbnbData) {
    airbnbData.forEach(function (data) {
        data.reviews = +data.reviews;
        data.date = parseDate(data.date)
    });
    //domain
    xScale.domain([new Date("2015-03-01"), new Date("2020-02-01")])
    yScale.domain([0, d3.max(airbnbData, d => d.reviews)])


    chartGroup1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup1.append("g")
        .call(leftAxis);

    // Line generators for each line
    var line = d3.svg.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.reviews));

    // Append a path for line1
    chartGroup1.append("path")
        .data([airbnbData])
        .attr("d", line)
        .classed("line green", true);

    var circlesGroup = chartGroup1.selectAll("circle")
        .data(airbnbData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.reviews))
        .attr("r", "5")
        .attr("class", "stateCircle")

    circlesGroup.append("text")

    //Tooltip initialization
    var toolTip1 = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.date}<br>Mean review: ${d.reviews}`);
        });

    chartGroup1.call(toolTip1);

    circlesGroup.on("mouseover", function (data) {
        toolTip1.show(data, this)
    })

        .on("mouseout", function (data, index) {
            toolTip1.hide(data);
        });

    chartGroup1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 4)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Average reviews count");

    chartGroup1.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Year");
})


//Price vs date chart

var svg2 = d3.select("#chart2")
    .append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup2 = svg2.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Append a div to the body to create tooltips, assign it a class
d3.select("body").append("div").attr("class", "d3-tip");
// Step 3:
// Import data from the All_airbnb_listings.csv file
// =================================
d3.csv("data/Price.csv", function (airbnbData) {
    airbnbData.forEach(function (data) {
        data.price = +data.price;
        data.date = parseDate(data.date)
    });
    // Step 5: Create Scales
    //==============================
    xScale.domain([new Date("2015-02-01"), new Date("2020-02-01")])
    yScale.domain([90, d3.max(airbnbData, d => d.price)])

    // append axes
    chartGroup2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup2.append("g")
        .call(leftAxis);

    // Line generators for each line
    var line = d3.svg.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.price));

    // Append a path for line1
    chartGroup2.append("path")
        .data([airbnbData])
        .attr("d", line)
        .classed("line green", true);


    var circlesGroup = chartGroup2.selectAll("circle")
        .data(airbnbData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.price))
        .attr("r", "4")
        .attr("class", "stateCircle")

    chartGroup2.append("text")


    //Tooltip initialization
    var toolTip2 = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.date}<br>mean price: ${d.price}`);
        });

    chartGroup2.call(toolTip2);

    circlesGroup.on("mouseover", function (data) {
        toolTip2.show(data, this)
    })

        .on("mouseout", function (data, index) {
            toolTip2.hide(data);
        });

    chartGroup2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 4)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Average price (US $)");

    chartGroup2.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Year");
});

//day-of-week vs price
var svg3 = d3.select("#chart3")
    .append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup3 = svg3.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Append a div to the body to create tooltips, assign it a class
d3.select("body").append("div").attr("class", "d3-tip");
// Step 3:
// Import data from the All_airbnb_listings.csv file
// =================================
d3.csv("data/day_week.csv", function (airbnbData) {
    airbnbData.forEach(function (data) {
        data.price = +data.price;
        console.log(data.price)
    });

    var xBandScale = d3.scale.ordinal()
    .domain(airbnbData.map(d => d.weekday))
    .rangeRoundBands([0, width], .1);

  // Create a linear scale for the vertical axis.
    var yLinearScale = d3.scale.linear()
    .domain([0, d3.max(airbnbData, d => d.price)])
    .range([height, 0]);

    var bottomAxis = d3.svg.axis()
    .scale(xBandScale)
    .orient("bottom");

    var leftAxis = d3.svg.axis()
    .scale(yLinearScale)
    .orient("left")

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup3.append("g")
    .call(leftAxis);

  chartGroup3.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(bottomAxis)
    .selectAll("text")
    .style("text-anchor", "start")
    .attr("xBandScale",9)
    .attr("transform", "rotate(45)")

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup3.selectAll(".bar")
    .data(airbnbData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.weekday))
    .attr("y", d => yLinearScale(d.price))
    .attr("width", xBandScale.rangeBand())
    .attr("height", d => height - yLinearScale(d.price));

    chartGroup3.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 4)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("Average price (US $)");

});

