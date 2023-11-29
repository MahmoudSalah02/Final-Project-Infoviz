function pieChart() {
    let width = 780,
        height = 470,
        radius = Math.min(width, height) / 2.3,
        colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    function processData(data, selectedDisease) {
        let diseaseData = [];
        let totalDeaths = 0;

        Object.keys(data).slice(1).forEach(race => {
            const disease = data[race][0].Causes.find(cause => cause.Cause === selectedDisease);
            if (disease) {
                totalDeaths += disease['Total Deaths'];
            }
        });

        Object.keys(data).slice(1).forEach(race => {
            const disease = data[race][0].Causes.find(cause => cause.Cause === selectedDisease);
            if (disease) {
                diseaseData.push({
                    label: race,
                    value: (disease['Total Deaths'] / totalDeaths) * 100
                });
            }
        });

        return diseaseData;
    }

    function chart(selector, data, selectedDisease = 'Diseases of heart') {
        d3.select(selector).select("svg").remove(); // Clear previous svg (if any)

        let processedData = processData(data, selectedDisease);

        const svg = d3.select(selector)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2 +120},${height / 2})`);

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
            .attr("transform", (d, i) => `translate(${width / 2 -1270}, ${-height / 2 + i * 30})`); 
            //.attr("transform", (d, i) => `translate(${-radius}, ${-height / 2 + i * 20})`);

        legend.append("rect")
            .attr("x", width / 2 - 18)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", (d, i) => colorScale(i));

        legend.append("text")
            .attr("x", width / 2 )
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start") 
            .text(d => d.label)
            .style("font-size", "12px");
            // .style("text-anchor", "end")
    }

    chart.updateData = function (selector, newData, selectedDisease) {
        chart(selector, newData, selectedDisease);
    };

    return chart;
}
