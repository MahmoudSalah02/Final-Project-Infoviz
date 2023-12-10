// Define a function called pieChart
function pieChart() {
    // Set default dimensions and radius for the pie chart
    let width = 780,
        height = 470,
        radius = Math.min(width, height) / 2.3,
        colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Process the input data into the required format for the pie chart
    function processData(aggregatedData) {
        return aggregatedData.map(d => ({
            label: d.race,
            value: d.percentage
        }));
    }

    // the main chart function
    function chart(selector, aggregatedData) {
        d3.select(selector).select("svg").remove(); // Clear previous svg (if any)

        let processedData = processData(aggregatedData);

        // Create an SVG element and append it to the selected container
        const svg = d3.select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2 + 120},${height / 2})`);

        const arc = d3.arc().outerRadius(radius - 10).innerRadius(0);
        const pie = d3.pie().sort(null).value(d => d.value);

        // Create groups for each pie slice
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
            .attr("transform", (d, i) => `translate(${width / 2 - 1270}, ${-height / 2 + i * 30})`);
        //.attr("transform", (d, i) => `translate(${-radius}, ${-height / 2 + i * 20})`);


        // Append rectangles to the legend, filled with color from the color scale
        legend.append("rect")
        legend.append("rect")
            .attr("x", width / 2 - 18)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", (d, i) => colorScale(i));


        // Append text labels to the legend
        legend.append("text")
            .attr("x", width / 2)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(d => d.label)
            .style("font-size", "12px");
        // .style("text-anchor", "end")
    }

    chart.updateData = function (selector, newData) {
        chart(selector, newData);
    };

    return chart;
}
