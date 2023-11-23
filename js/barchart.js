/* global d3 */

// Initialize a horizontal bar chart
function barchart() {
  let margin = { top: 30, right: 20, bottom: 70, left: 180 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // Create scales
  let xScale = d3.scaleLinear().range([0, width]);
  let yScale = d3.scaleBand().range([0, height]).padding(0.1);

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

    // Create the bars
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("width", d => xScale(d['Total Deaths']))
      .attr("y", d => yScale(d.Cause))
      .attr("height", yScale.bandwidth());

    // Add the X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(yScale));
  }

  return chart;
}
