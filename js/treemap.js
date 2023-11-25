/* global d3 */

// Initialize a treemap chart
function treemap() {
    // Set the dimensions and margins of the chart
    let margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1154 - margin.left - margin.right,
        height = 1154 - margin.top - margin.bottom;
  
    function chart(selector, rawData) {
      // Process the raw data to extract 'Diseases of heart' data for each age group
      let data = [];
      Object.keys(rawData).forEach(ageGroup => {
        let causeData = rawData[ageGroup][0].Causes.find(cause => cause.Cause === 'Diseases of heart');
        if (causeData) {
          data.push({
            name: ageGroup,
            value: causeData['Total Deaths']
          });
        }
      });
  
      // Compute the layout
      let root = d3.treemap()
          .tile(d3.treemapSquarify)
          .size([width, height])
          .padding(1)
          .round(true)
          (d3.hierarchy({ children: data })
              .sum(d => d.value));
  
      // Append the svg object to the specified selector
      let svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Add a cell for each leaf of the hierarchy
      let leaf = svg.selectAll("g")
        .data(root.leaves())
        .enter().append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
      // Append a tooltip
      const format = d3.format(",d");
      leaf.append("title")
        .text(d => `${d.parent.data.name}: ${format(d.value)}`);
  
      // Append a color rectangle
      leaf.append("rect")
        .attr("class", "treemap-rect")
        .attr("fill", "#ccc")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);
  
      // Append text
      leaf.append("text")
        .attr("x", 5)
        .attr("y", 20)
        .text(d => d.parent.data.name);
    }
  
    return chart;
  }
  