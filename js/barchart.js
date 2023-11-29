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

  // Selected bars state
  let selectedBars = new Set();

  function chart(selector, data) {
    console.log("Initial bar chart data:", data);
    if (data.length > 0) {
      console.log("Properties of first data element:", Object.keys(data[0]));
    }
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
      .style("fill", "rgb(79, 120, 167)")
      .on("click", function (d) {  // 'd' is the first parameter
        d3.event.stopPropagation(); // For D3 v5 and earlier
        let cause = d.Cause;
        console.log("Clicked disease:", cause); // Debugging statement

        if (selectedBars.has(cause)) {
          selectedBars.delete(cause);
          d3.select(this).style("fill", "rgb(79, 120, 167)");
        } else {
          selectedBars.add(cause);
          d3.select(this).style("fill", "rgb(255, 53, 53)");
        }

        console.log("Current selected diseases:", Array.from(selectedBars));
        dispatcher.call("diseaseSelected", null, Array.from(selectedBars));
      });

    // Add the X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(yScale));
  }

  // Function to clear all selections
  function clearSelections() {
    selectedBars.clear();
    d3.selectAll(".bar").style("fill", "rgb(79, 120, 167)");
    dispatcher.call("diseaseSelected", null, Array.from(selectedBars));
  }

  // Global click listener to clear selections
  d3.select(document).on("click", clearSelections);

  // Expose dispatcher and clearSelections
  chart.dispatcher = function () {
    return dispatcher;
  };
  chart.clearSelections = clearSelections;

  return chart;
}
