/*
Name: Leonie Bouma
Student number: 10898050

useful site:
https://bl.ocks.org/jalapic/be485f24c4cefb3f0b68f2943364c93d
https://bl.ocks.org/sebg/6f7f1dd55e0c52ce5ee0dac2b2769f4b
https://bl.ocks.org/Jverma/076377dd0125b1a508621441752735fc

*/
window.onload = function() {
    var womenInScience = "MSTI.json",
        consConf = "consConf.json",
        patents = "patent.json";



    var requests = [d3.json(womenInScience), d3.json(consConf)];

    Promise.all(requests).then(function(response) {
        createSet(response)
        createScatter(dataset)
    }).catch(function(e){
        throw(e);
    });
};

function createSet(data) {
    // datapoint values from the consConf json are added to the MSTI dataset
    dataset = data[0]
    confVal = data[1]

    // countries are not defined in the MSTI dataset and thus need to be added in correct order
    var countries = ["France", "Germany", "Korea", "Netherlands", "Portugal", "United Kingdom"];
    var countryNum = 0;

    for (var i = 0; i < dataset.length; i++){
        dataset[i]["Country"] = countries[countryNum]

        // countries and associated times in the different datasets are not accessed by same index
        for (var j = 0; j < confVal.length; j++){
            if (dataset[i].time === confVal[j].time && dataset[i].Country === confVal[j].Country){
                dataset[i]["confVal"] = confVal[j].datapoint
            }
        }

        // 2015 is the last data value for each country
        if (dataset[i].time == "2015"){
            countryNum++;
        }
    }

   return dataset
};


function createScatter(data) {

    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 800 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select(".chart")
            .append("svg")
            .attr("width", width + margin.right + margin.left,)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create x and y variables
    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom()
	    .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);

    y.domain(d3.extent(data, function(d){return d.datapoint})).nice();
	x.domain(d3.extent(data, function(d){return d.confVal})).nice();

	// setup fill color
	var color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.selectAll(".point")
        .data(data)
      .enter().append("circle")
        .attr("class", "point")
        .attr("r", 4)
        .attr("cy", function(d){ return y(d.datapoint); })
        .attr("cx", function(d){ return x(d.confVal); })
        .style('fill', function(d){ return color(d.time); });

    // add x axis and label it
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
       .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", margin.bottom)
        .attr("fill", "black")
        .text("Consumer confidence");

    // add y axis and label it
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", - margin.right * 1.5)
        .attr("x", - height / 3)
        .attr("fill", "black")
        .text("Percentage of female researcher");


     var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


  // Group/filter by selector............

  var names = d3.nest()
                .key(function(d){ return d.Country;})     // group by name
                .rollup(function(a) { return a.length})  // aggregation on array
                .entries(data);

  //add all
    names.unshift({"key": "ALL",
                   "value": d3.sum(names,function(d) {return d.value;})});

// add dropdown options to selector

 var selector= d3.select("#selector"); // selector

 selector
   .selectAll("option")
   .data(names)
   .enter()
   .append("option")
   .text(function(d) { return d.key + ": " + d.value;})
   .attr("value", function(d){ return d.key;});


// bovenstaande grotendeels van https://bl.ocks.org/jalapic/be485f24c4cefb3f0b68f2943364c93d
};

