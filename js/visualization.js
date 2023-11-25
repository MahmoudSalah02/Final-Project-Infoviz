// Immediately Invoked Function Expression
((() => {
  // Load the data from a JSON file
  d3.json("data/race.JSON", (error, data) => {
    if (error) throw error;

    // Extract top 10 diseases data
    let topDiseasesData = data['Total Population'][0].Causes.slice(0, 10);

    // Create a horizontal bar chart
    let diseaseBarChart = barchart()
      ("#barchart", topDiseasesData);
  });

  // Load the data for the pie chart
  d3.json("data/race.json", function (error, data) {
    if (error) {
      console.error("Error loading the data:", error);
      return;
    }

    let pieChartInstance = pieChart();
    pieChartInstance("#piechart", data);
  });

  // After loading your data
  d3.json("data/age.JSON", function (error, data) {
    if (error) {
      console.error("Error loading the data:", error);
      return;
    }
    let treeMapChartInstance = treemap();
    treeMapChartInstance("#treemap", data); // Pass the selector and parsed data
  });


})());
