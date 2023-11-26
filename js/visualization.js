// Immediately Invoked Function Expression
((() => {
  let pieChartInstance, treeMapChartInstance, barData, ageData;

  // Load and display the bar chart
  d3.json("data/race.JSON", (error, data) => {
    if (error) throw error;
    barData = data; // Store the data for later use

    let diseaseBarChart = barchart(); // Create the chart function
    diseaseBarChart("#barchart", barData['Total Population'][0].Causes.slice(0, 10));

    diseaseBarChart.dispatcher().on("diseaseSelected", selectedDisease => {
      console.log("in dispatcher")
      pieChartInstance.updateData("#piechart", barData, selectedDisease);
      treeMapChartInstance.updateData("#treemap", ageData, selectedDisease);
    });
  });

  // Load and display the initial pie chart
  d3.json("data/race.JSON", (error, pieData) => {
    if (error) console.error("Error loading the data:", error);
    else {
      pieChartInstance = pieChart();
      pieChartInstance("#piechart", pieData);
    }
  });

  // Load and display the initial treemap
  d3.json("data/age.JSON", (error, data) => {
    if (error) console.error("Error loading the data:", error);
    else {
      ageData = data; // Store the data for later use
      treeMapChartInstance = treemap();
      treeMapChartInstance("#treemap", ageData);
    }
  });
})());
