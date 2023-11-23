// Initialize a pie chart
function pieChart() {
  let width = 500,
      height = 500,
      radius = Math.min(width, height) / 2,
      colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Default color scale

  // Function to process the data for "Diseases of heart"
  function processData(data) {
      let heartDiseaseData = [];
      let totalDeaths = 0;

      // Skip the first index and calculate the total deaths from "Diseases of heart" across all races
      Object.keys(data).slice(1).forEach(race => {
          const heartDisease = data[race][0].Causes.find(cause => cause.Cause === "Diseases of heart");
          if (heartDisease) {
              totalDeaths += heartDisease['Total Deaths'];
          }
      });

      // Create the dataset for the pie chart
      Object.keys(data).slice(1).forEach(race => {
          const heartDisease = data[race][0].Causes.find(cause => cause.Cause === "Diseases of heart");
          if (heartDisease) {
              heartDiseaseData.push({
                  label: race,
                  value: (heartDisease['Total Deaths'] / totalDeaths) * 100 // Convert to percentage
              });
          }
      });

      return heartDiseaseData;
  }

  // Main function to create the pie chart
  function chart(selector, data) {
      let processedData = processData(data);

      const svg = d3.select(selector)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);

      const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
      const pie = d3.pie().sort(null).value(d => d.value);

      const arcs = svg.selectAll(".arc")
          .data(pie(processedData))
          .enter().append("g")
          .attr("class", "arc");

      arcs.append("path")
          .attr("d", arc)
          .attr("fill", (d, i) => colorScale(i));

      // Adding a legend
      const legend = svg.selectAll(".legend")
          .data(processedData)
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", (d, i) => `translate(${-radius}, ${-height / 2 + i * 20})`);

      legend.append("rect")
          .attr("x", width / 2 - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", (d, i) => colorScale(i));

      legend.append("text")
          .attr("x", width / 2 - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(d => d.label);

      return chart;
  }

  return chart;
}
