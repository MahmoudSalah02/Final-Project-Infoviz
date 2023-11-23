// Initialize a pie chart
function pieChart() {
    // Chart dimensions and configuration variables
    let width = 500,
      height = 500,
      radius = Math.min(width, height) / 2,
      colorScale = d3.scaleOrdinal(d3.schemeCategory10), // Color scale for the pie slices
      value = (d) => d.value, // Accessor function for the data value
      label = (d) => d.label, // Accessor function for the data label
      dispatcher; // Event dispatcher for interactivity
  
    // Function to create the pie chart within the specified selector using the given data
    function chart(selector, data) {
      // Create an SVG container for the chart
      const svg = d3
        .select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`); // Center the pie chart
  
      // Create an arc generator for drawing the pie slices
      const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
  
      // Create a pie layout based on the specified value accessor
      const pie = d3.pie().sort(null).value(value);
  
      // Create groups (arcs) for each pie slice
      const arcs = svg
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");
  
      // Draw the pie slices
      arcs
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => colorScale(i)) // Apply colors from the color scale
        .on("click", (d) => {
          // Handle click events if needed
          // You can dispatch an event using dispatcher
        });
  
      // Add labels to the pie slices
      arcs
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .text((d) => label(d.data));
  
      return chart;
    }
  
    // Getter and setter functions for chart dimensions and configuration
    chart.width = function (_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
    };
  
    chart.height = function (_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
    };
  
    chart.colorScale = function (_) {
      if (!arguments.length) return colorScale;
      colorScale = _;
      return chart;
    };
  
    chart.value = function (_) {
      if (!arguments.length) return value;
      value = _;
      return chart;
    };
  
    chart.label = function (_) {
      if (!arguments.length) return label;
      label = _;
      return chart;
    };
  
    // Getter and setter for the event dispatcher
    chart.selectionDispatcher = function (_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
    };
  
    // Function to update the selection based on external input
    chart.updateSelection = function (selectedData) {
      if (!arguments.length) return;
  
      // Highlight or modify the appearance of selected slices
      svg
        .selectAll(".arc")
        .classed("selected", (d) => selectedData.includes(label(d.data)))
        .attr("fill", (d, i) =>
          selectedData.includes(label(d.data)) ? colorScale(i) : originalColor
        );
  
      // Get the name of our dispatcher's event
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
  
      // Let other charts know about our selection
      dispatcher.call(dispatchString, this, selectedData);
    };
  
    return chart;
  }
  