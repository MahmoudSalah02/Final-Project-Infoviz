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
    console.log("Treemap data:", aggregatedData);  // Log the data

    d3.select(selector).select("svg").remove();

    let data = processData(aggregatedData);

    // Check if data is empty and handle accordingly
    if (!data || data.length === 0) {
        console.log("No data to display for the treemap.");
        return; // Exit the function if no data is present
    }

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

    let leaf = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    const format = d3.format(",d");
    leaf.append("title")
      .text(d => `${d.data.name}: ${format(d.value)}`);

    leaf.append("rect")
      .attr("class", "treemap-rect")
      .attr("fill", "#ccc")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

    leaf.append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text(d => d.data.name);
  }

  chart.updateData = function (selector, newData) {
    chart(selector, newData);
  };

  return chart;
}
