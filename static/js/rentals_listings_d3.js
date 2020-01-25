var svgWidth = 825;
var svgHeight = 675;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Import data from flask
d3.json("/data/airbnb_mean_prices").then(airbnbData => {
  d3.json("/data/rentals").then(rentalData => {
      d3.json("/data/listings").then(listingData => {
          console.log(airbnbData);
          console.log(rentalData);
          console.log(listingData);
      // var parseTime = d3.timeParse("%b-%Y")
      //     .forEach(function(d) {
      //       d.airbnbData = +d.airbnbData
      //       d.rentalData = +d.rentalData;
      //       d.listingData = +data.listingData;
          // });
      var neighborhoods = []
        listingData.forEach(own => {
          console.log(own.Neighborhood);
          hood = own.Neighborhood;
          if (neighborhoods.includes(hood)) {
            console.log(`${hood} already included`);
          } else {
            neighborhoods.push(hood);
            console.log(`Added ${hood}`)};
      // const keys = Object.entries(listingData)
      //   for (const entry of entries) {
      //   console.log(key)
      // }

      var filteredAir = airbnbData.filter(item => neighborhoods.includes(item.neighbourhood));
            console.log(filteredAir);
      var filteredRent = rentalData.filter(item => neighborhoods.includes(item.Neighborhood));
            console.log(filteredRent)});

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  function yScale(airData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(airData, d => d[chosenYAxis]) * 0.8,
        d3.max(airData, d => d[chosenYAxis]) * 1.2
      ])
      .range([0, width]);
  
    return yLinearScale;
  
  }
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(airbnbData, d => d.airData)])
      .range([0, width]);

    var chosenYAxis = "rentalData";
    var yLinearScale = yScale(rentalData, chosenYAxis);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    function renderAxes(newYScale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);
    
      xAxis.transition()
        .duration(750)
        .call(leftAxis);
    
      return yAxis;
    }

    function renderCircles(circleGroup, newYScale, chosenYAxis) {

      circleGroup.transition()
        .duration(750)
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
      return circleGroup;
    }

    function updateToolTip(chosenYAxis, circleGroup) {

      if (chosenYAxis === "rentalData") {
        var label = "Rental Data:";
      }
      else {
        var label = "Home Price Data:";
      }
    
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.airbnbData}<br>${label} ${d[chosenYAxis]}`);
        });
    
      circleGroup.call(toolTip);
    
      circleGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
    
      return circleGroup;
    }
    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(airbnbData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.airbnbData))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "10")
    .attr("fill", "green")
    .attr("opacity", ".4");

    // Create y axis lables
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var rentLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "rentalData")
    .classed("active", true)
    .text("Rental Prices");

    var ownLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "num_albums") // value to grab for event listener
    .classed("inactive", true)
    .text("Home Prices");

    // append x axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("AirBNB Rates by Month and Year");

    var circles = updateToolTip(chosenYAxis, circlesGroup);
    
    // y axis labels event listener
  labelsGroup.selectAll("text")
  .on("click", function() {

    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = xScale(rentalData, chosenYAxis);

      // updates x axis with transition
      yAxis = renderAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circles = renderCircles(circleGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circles = updateToolTip(chosenYAxis, circleGroup);

      // changes classes to change bold text
      if (chosenYAxis === "rentalData") {
        albumsLabel
          .classed("active", true)
          .classed("inactive", false);
        hairLengthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        albumsLabel
          .classed("active", false)
          .classed("inactive", true);
        hairLengthLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
})
})
});
// }).catch(function(error) {
// console.log(error);
// });
//     // Initialize tool tip
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`AirBNB Cost: ${d.airData}<br>Rental Cost: ${d.rentData}<br>Median Home Price: ${d.ownData}`);
//       });

//     // Create tooltip in the chart
//     chartGroup.call(toolTip);

//     // Create event listeners to display and hide the tooltip
//     circlesGroup.on("mouseover", function(data) {
//       toolTip.show(data, this);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data);
//       });

//     // Create axes labels
//     chartGroup.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left + 40)
//       .attr("x", 0 - (height / 2))
//       .attr("cx", d => xLinearScale(d.airData))
//       .attr("cy", d => yLinearScale(d[chosenYAxis]))
//       .attr("dy", "1em")
//       .attr("class", "axisText")
//       .text("Rental Prices 2015-19");

//     chartGroup.append("text")
//       .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
//       .attr("class", "axisText")
//       .text("AirBNB Listing 2015-2019");
//     })
//   // .catch(function(error) {
//   //   console.log(error);
//   });