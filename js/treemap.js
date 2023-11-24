function createTreeMap() {
    // Load data from the JSON file.
    d3.json('data/age.json').then(data => {
        console.log(data);
        // Specify the chart’s dimensions.
        const width = 1154;
        const height = 1154;

        // Set the color scale to a gradient.
        const color = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(data.children, d => d.value)]);

        // Compute the layout.
        const root = d3.treemap()
            .tile(d3.treemapSquarify)
            .size([width, height])
            .padding(1)
            .round(true)
            (d3.hierarchy({ children: Object.values(data) })
                .sum(d => d[0]["Total Deaths"])
                .sort((a, b) => b.value - a.value));

        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto; font: 10px times-new-roman;");

        // Add a cell for each leaf of the hierarchy.
        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // Append a tooltip.
        const format = d3.format(",d");
        leaf.append("title")
            .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

        // Append a color rectangle. 
        leaf.append("rect")
            .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
            .attr("fill", d => color(d.value))
            .attr("fill-opacity", 0.6)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);

        // Append a clipPath to ensure text does not overflow.
        leaf.append("clipPath")
            .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
            .append("use")
            .attr("xlink:href", d => d.leafUid.href);

        // Append multiline text. The last line shows the value and has a specific formatting.
        leaf.append("text")
            .attr("clip-path", d => d.clipUid)
            .attr("font-size", d => `${Math.min((d.x1 - d.x0) / 5, (d.y1 - d.y0) / 5)}px`)
            .selectAll("tspan")
            .data(d => d.data.Causes.map(cause => `${cause.Cause}: ${format(cause["Total Deaths"])}`))
            .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i) => `${1.1 + i * 0.9}em`)
            .attr("fill-opacity", 0.7)
            .text(d => d);

        // Append the chart to the DOM.
        document.body.appendChild(svg.node());
    });
}
