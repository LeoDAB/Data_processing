/*
Name: Leonie Bouma
Student number: 10898050
*/

window.onload = function() {
    var womenInScience = "MSTI.json",
        consConf = "consConf.json",
        patents = "patent.json";

    var requests = [d3.json(womenInScience), d3.json(consConf)];

    Promise.all(requests).then(function(response) {

        // make one usable dataset from the two input json's
        createSet(response)

        // create the interactive scatter plot
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

    // define the margins for the scatter plot and the width and height
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 800 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    // add a svg to the chart div but let it start from the upper left margins corner
    var svg = d3.select(".chart")
        .append("svg")
        .attr("width", width + margin.right + margin.left,)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create the variables which are represented by the x or y axis
    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom()
	    .scale(x);

    var yAxis = d3.axisLeft()
        .scale(y);

    // the percentage of woman in research is represented by the y axis and consumer confidence by the x axis
    y.domain(d3.extent(data, function(d){return d.datapoint})).nice();
	x.domain(d3.extent(data, function(d){return d.confVal})).nice();

	// create a function for the circle fill colors
	var color = d3.scaleOrdinal(d3.schemeCategory10);

    // create the data circles from our data and give them a color based on their associated year
    svg.selectAll(".point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cy", function(d){ return y(d.datapoint); })
        .attr("cx", function(d){ return x(d.confVal); })
        .style('fill', function(d){ return color(d.time); });

    // add x axis and label it for consumer confidence
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
       .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", margin.bottom)
        .text("Consumer confidence");

    // add y axis and label it for percentage of female researchers
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", - margin.right * 1.5)
        .attr("x", - height / 3)
        .text("Percentage of female researcher (in %)");

    // add a legend to explain which year each color represents. Based on
    // https://bl.ocks.org/Jverma/076377dd0125b1a508621441752735fc
    var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            // make sure the legend components aren't layered on top of each other
            .attr("transform", function(d, i) { return "translate(0," + i * margin.top + ")"; });

    // create a colored rectangle for each year
    legend.append("rect")
        .attr("x", width)
        .attr("width", margin.right)
        .attr("height", margin.right)
        .style("fill", color);

    // add the year each color represents
    legend.append("text")
        .attr("x", width - margin.left)
        .attr("y", 14)
        .text(function(d) { return d; });

    // add a title to the scatter plot
    svg.append("g")
        .attr("class", "title")
        .append("text")
        .attr("y", -5)
        .attr("x", 0)
        .text("Scatter plot displaying the correlation between percentage of female researchers and consumer confidence for six countries");


    // group scatter points for each country. Based on:
    // https://bl.ocks.org/jalapic/be485f24c4cefb3f0b68f2943364c93d
    var countryName = d3.nest()
            .key(function(d){ return d.Country;})
            .rollup(function(l) { return l.length})
            .entries(data);

    // also add a group to select every circle: for all the countries
    countryName.unshift({"key": "Every country",
                         "value": d3.sum(countryName,function(d) {return d.value;})});

    // add dropdown options to the dropdown menu
    var dropMenu = d3.select("#menu")

    dropMenu.selectAll("option")
    .data(countryName)
    .enter()
    .append("option")
    .text(function(d) { return d.key;})
    .attr("value", function(d){ return d.key;});

    // dynamically change the points visible in the chart
    dropMenu.on("change", function(){

        // initially each point is at full opacity: when 'each country' is selected
        d3.selectAll(".point")
            .attr("opacity", 1);

        // save the selected country name in a variable
        var name = dropMenu.property("value");

        // let the data points disappear if their associated country is not selected
        if(name != "Every country") {
            d3.selectAll(".point")
            // filter for the all but the selected country in the data to not display
            .filter(function(d) {return d.Country != name; })
            .attr("opacity", 0);
        };
    });
}


