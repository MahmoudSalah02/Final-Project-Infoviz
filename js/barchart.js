// Initialize a horizontal bar chart
function barchart() {
  let margin = { top: 30, right: 20, bottom: 70, left: 180 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Create scales
  let xScale = d3.scaleLinear().range([0, width]);
  let yScale = d3.scaleBand().range([0, height]).padding(0.1);

  // Create a dispatcher for events
  let dispatcher = d3.dispatch("diseaseSelected");

  function chart(selector, data) {
    // Sort data based on Total Deaths
    data.sort((a, b) => b['Total Deaths'] - a['Total Deaths']);

    // Set the domains for the scales
    xScale.domain([0, d3.max(data, d => d['Total Deaths'])]);
    yScale.domain(data.map(d => d.Cause));

    // Append the svg object to the body of the page
    let svg = d3.select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the bars and store the selection in 'bars'
    let bars = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", d => xScale(d['Total Deaths']))
      .attr("y", d => yScale(d.Cause))
      .attr("height", yScale.bandwidth())
      .on("click", function (d) {
        // Reset the color of all bars
        bars.style("fill", "");
        // Change the color of the clicked bar
        d3.select(this).style("fill", "red");
        // Log the selected disease
        console.log("Selected disease:", d.Cause);
        // Dispatch the event (if you have a dispatcher set up)
        dispatcher.call("diseaseSelected", this, d.Cause);
      });

    // Add the X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(yScale));
  }

  // Expose dispatcher
  chart.dispatcher = function () {
    return dispatcher;
  };

  return chart;
}
