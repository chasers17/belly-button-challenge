const url = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`;

d3.json(url).then(function(data) {
  // Barchart
  function createBarChart(sampleData) {
    var samples = data.samples;
    var selectedSample = samples.find(s => s.id === sampleData);
  
    var sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
    var otuIds = selectedSample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    var otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();
  
    var trace = {
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };
  
    var layout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
  
    var chartData = [trace];
  
    Plotly.newPlot("bar", chartData, layout);
  }
  
  // Bubble Chart
  function createBubbleChart(sampleData) {
    var samples = data.samples;
    var selectedSample = samples.find(s => s.id === sampleData);
  
    var otuIds = selectedSample.otu_ids;
    var sampleValues = selectedSample.sample_values;
    var otuLabels = selectedSample.otu_labels;
  
    var trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    };
  
    var layout = {
      title: "OTU IDs vs Sample Values",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };
  
    var chartData = [trace];
  
    Plotly.newPlot("bubble", chartData, layout);
  }
  
  // Metadata
  function displaySampleMetadata(sample) {
    var metadata = data.metadata;
    var selectedMetadata = metadata.find(m => m.id === parseInt(sample));
  
    var metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html(""); 
  
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataDiv.append("p").text(`${key}: ${value}`);
    });
  }
  
  // Dropdown Menu
  var dropdown = d3.select("#selDataset");
  
  data.names.forEach(name => {
    dropdown.append("option").text(name).attr("value", name);
  });
  
  var defaultSample = data.names[0];
  createBarChart(defaultSample);
  createBubbleChart(defaultSample);
  displaySampleMetadata(defaultSample);
  
  // Update plot with dropdown menu change
  function optionChanged(sample) {
    createBarChart(sample);
    createBubbleChart(sample);
    displaySampleMetadata(sample);
  }

// Event listener to update plots
  dropdown.on("change", function() {
    var selectedSample = d3.select(this).property("value");
    optionChanged(selectedSample);
  });
});
