// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Check with a log
    console.log("Metadata:", metadata);
    console.log("Sample:", sample);

    // Filter the metadata for the object with the desired sample number (no parseInt was causing undefined metadata, need for panel to display)
    const selectedMetadata = metadata.find(item => item.id === parseInt(sample));
    console.log("SelectedMD", selectedMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    const metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Check with a log
    console.log("Selected Metadata:", selectedMetadata);

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  }).catch(error => {
    console.error("Error fetching metadata:", error);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const selectedSample = samples.find(item => item.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = selectedSample.otu_ids;
    const otuLabels = selectedSample.otu_labels;
    const sampleValues = selectedSample.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };
    const bubbleData = [bubbleTrace];
    const bubbleLayout = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };


    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const top10OtuIds = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const top10Values = sampleValues.slice(0, 10).reverse();
    const top10Labels = otuLabels.slice(0, 10).reverse();
    const barTrace = {
      x: top10Values,
      y: top10OtuIds,
      text: top10Labels,
      type: 'bar',
      orientation: 'h'
    };
    const barData = [barTrace];
    const barLayout = {
      title: 'Top 10 OTUs Bar Chart',
      xaxis: { title: 'Sample Values' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  }).catch(error => {
    console.error("Error building charts:", error);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  }).catch(error => {
    console.error("Error initializing dashboard:", error);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
