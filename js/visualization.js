// Immediately Invoked Function Expression
((() => {
  let pieChartInstance, treeMapChartInstance, barData, ageData;

  // Function to aggregate data for the pie chart
  function aggregatePieData(selectedDiseases, pieData) {
    let aggregatedData = [];
    let totalDeaths = 0;

    Object.keys(pieData).slice(1).forEach(race => { // Skip the first key
      let raceTotal = 0;
      pieData[race][0].Causes.forEach(cause => {
        if (selectedDiseases.includes(cause.Cause)) {
          raceTotal += cause['Total Deaths'];
        }
      });
      totalDeaths += raceTotal;
      if (raceTotal > 0) {
        aggregatedData.push({ race: race, totalDeaths: raceTotal });
      }
    });

    // Convert to percentages
    aggregatedData = aggregatedData.map(d => ({
      race: d.race,
      percentage: (d.totalDeaths / totalDeaths) * 100
    }));
  
    return aggregatedData;
  }

  // Function to aggregate data for the treemap
  function aggregateTreeData(selectedDiseases, treeData) {
    let aggregatedData = [];

    Object.keys(treeData).forEach(ageGroup => {
      let groupTotal = 0;
      treeData[ageGroup][0].Causes.forEach(cause => {
        if (selectedDiseases.includes(cause.Cause)) {
          groupTotal += cause['Total Deaths'];
        }
      });
      if (groupTotal > 0) {
        aggregatedData.push({ ageGroup: ageGroup, totalDeaths: groupTotal });
      }
    });

    return aggregatedData;
  }

  // Load and display the bar chart
  d3.json("/data/race.JSON", (error, data) => {
    if (error) throw error;
    barData = data; // Store the data for later use

    let diseaseBarChart = barchart(); // Create the chart function
    diseaseBarChart("#barchart", barData['Total Population'][0].Causes.slice(0, 10));

    // Modify dispatcher to handle multiple selections
    diseaseBarChart.dispatcher().on("diseaseSelected", selectedDiseases => {
      console.log("Selected diseases:", selectedDiseases);
      let aggregatedPieData = aggregatePieData(selectedDiseases, barData);
      let aggregatedTreeData = aggregateTreeData(selectedDiseases, ageData);
      pieChartInstance.updateData("#piechart", aggregatedPieData);
      treeMapChartInstance.updateData("#treemap", aggregatedTreeData);
    });
  });

  // Load and display the initial pie chart and treemap
  d3.json("/data/race.json", (error, pieData) => {
    if (error) console.error("Error loading the data:", error);
    else {
      pieChartInstance = pieChart();
      pieChartInstance("#piechart", pieData);
    }
  });

  d3.json("/data/age.JSON", (error, data) => {
    if (error) console.error("Error loading the data:", error);
    else {
      ageData = data; // Store the data for later use

      // Initialize the treemap with initial data
      treeMapChartInstance = treemap();
      let initialTreeData = aggregateTreeData([], ageData); // Assuming an empty selection initially
      treeMapChartInstance.updateData("#treemap", initialTreeData);
    }
  });
})());
