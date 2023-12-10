// this fucntion calls the treemap
function treemap() {
  let margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 554 - margin.left - margin.right,
    height = 554 - margin.top - margin.bottom;

  // Adjusted processData to handle aggregated data
  function processData(aggregatedData) {
    // Expecting aggregatedData to be an array of objects { ageGroup: string, totalDeaths: number }
    return aggregatedData.map(d => ({
      name: d.ageGroup,
      value: d.totalDeaths
    }));
  }

  function chart(selector, aggregatedData) {
    d3.select(selector).select("svg").remove();

    let data = processData(aggregatedData);

    // Check if data is empty and handle accordingly
    if (!data || data.length === 0) {
      return; // Exit the function if no data is present
    }

    // Create a treemap layout using d3
    let root = d3.treemap()
      .tile(d3.treemapSquarify)
      .size([width, height])
      .padding(1)
      .round(true)
      (d3.hierarchy({ name: "root", children: data })
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value));

    let svg = d3.select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add a title to each leaf showing the name and value
    let leaf = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const format = d3.format(",d");
    leaf.append("title")
      .text(d => `${d.data.name}: ${format(d.value)}`);

    // Add rectangles for each leaf node, representing the treemap
    leaf.append("rect")
      .attr("class", "treemap-rect")
      .attr("fill", "#ccc")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

    // Add text labels to each leaf node
    leaf.append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text(d => d.data.name);
  }
  // Define a function to update the data of the chart
  chart.updateData = function (selector, newData) {
    chart(selector, newData);
  };

  // Return the chart function
  return chart;
}
