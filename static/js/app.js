// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadataField = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadataFilter = metadataField.filter(id =>id.id== sample);
    let metadataFirst = metadataFilter[0];
    console.log(metadataFirst)

    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    meta = d3.select("#sample-metadata").html('')

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(metadataFirst).forEach(([key, value]) => {
      meta.append('h6').text(`${key.toUpperCase()}, ${value}`);
    });

  });
};

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    // Filter the samples for the object with the desired sample number
    let samples= data.samples;
    let samplesFilter= samples.filter(id =>id.id == sample);
    let sampleFirst = samplesFilter[0];
    // Get the otu_ids, otu_labels, and sample_values
   let  sampleValues= sampleFirst.sample_values;
   let otu_ids = sampleFirst.otu_ids
   let otu_labels = sampleFirst.otu_labels

   console.log(otu_ids)

    // Build a Bubble Chart
    let bubble_chart=[{
      x :otu_ids,
      y: sampleValues,
      text: otu_labels,
      mode : 'markers',
      marker: {
        color : otu_ids,
        size : sampleValues,
        colorscale : "Earth"
      }

    }]

    // Render the Bubble Chart

    let bubble_layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'}
    }
    //plot the bubble chart
    Plotly.newPlot('bubble', bubble_chart, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
     let yotuIDS= otu_ids.map(otuID =>`OTU ${otuID}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barChart =[{
      x : sampleValues.slice(0,10).reverse(),
      y : yotuIDS.slice(0,10).reverse(),
      text  : otu_labels.slice(0,10).reverse(),
      type : 'bar',
      orientation : 'h'
    }]

    // Render the Bar Chart
      let layout = {title: "Top Ten Bacteria Cultures Found"};
          Plotly.newPlot("bar", barChart, layout);

      });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_names = data.names;
    console.log(sample_names);
    
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset') ;

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (names of sample_names){
      dropdown.append("option").text(names).property("value", names)
    };

     // create a listen event for dropdown menu change
     dropdown.on("change", function () {
      let nwSample = d3.select(this).property("value")
     optionChanged(nwSample)
    });


    // Get the first sample from the list
    let first_name = sample_names[0] ;
    console.log("First entry" , first_name);


    // Build charts and metadata panel with the first sample
    buildCharts(first_name);
    buildMetadata(first_name) ;

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample) ;
  buildMetadata(newSample) ;

};

// Initialize the dashboard
init();
