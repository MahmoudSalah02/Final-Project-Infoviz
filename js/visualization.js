// Immediately Invoked Function Expression
((() => {
  let pieChartInstance, treeMapChartInstance;

  // Load and display the bar chart
  d3.json("data/race.JSON", (error, barData) => {
    if (error) throw error;

    let diseaseBarChart = barchart()("#barchart", barData['Total Population'][0].Causes.slice(0, 10));


    // Setup event listener for bar chart selections
    diseaseBarChart.dispatcher().on("diseaseSelected", selectedDisease => {
      pieChartInstance.updateData("#piechart", barData, selectedDisease);
      treeMapChartInstance.updateData("#treemap", barData, selectedDisease);
    });
  });

  // Load and display the initial pie chart
  d3.json("data/race.json", (error, pieData) => {
    if (error) console.error("Error loading the data:", error);
    else {
      pieChartInstance = pieChart();
      pieChartInstance("#piechart", pieData);
    }
  });

  // Load and display the initial treemap
  d3.json("data/age.JSON", (error, treeData) => {
    if (error) console.error("Error loading the data:", error);
    else {
      treeMapChartInstance = treemap();
      treeMapChartInstance("#treemap", treeData);
    }
  });
})());
