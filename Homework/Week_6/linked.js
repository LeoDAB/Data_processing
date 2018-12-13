/*
Name: Leonie Bouma
Student number: 10898050
*/

window.onload = function() {
    var voters = "data.json"

    var requests = [d3.json(voters)];



    Promise.all(requests).then(function(response) {

        linkedViews(response[0])

    }).catch(function(e){
        throw(e);
    });
};


function linkedViews(dataset)  {

    var data = []

    Object.keys(dataset).forEach(function(key) {
        data.push(dataset[key])

    });

     // define the margins for the scatter plot and the width and height
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 800 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    // add a svg to the chart div but let it start from the upper left margins corner
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.right + margin.left,)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create the tooltip
    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "toolTip");

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
    y.domain(d3.extent(data, function(d){return d.Total_voters})).nice();
	x.domain(d3.extent(data, function(d){return d.Total_employed})).nice();


    // create the data circles from our data and give them a color based on their associated year
    svg.selectAll(".point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cy", function(d){ return y(d.Total_voters); })
        .attr("cx", function(d){ return x(d.Total_employed); })
        .on("mousemove", function(d){
          tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(d.country) })
        .on("mouseout", function(d){ tooltip.style("display", "none"); })
        .on("click", function(d) {return groupBar(data, d.country)})


    // add y axis and label it for percentage of female researchers
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", - margin.right * 1.2)
        .attr("x", - height / 3)
        .text("voters turnout (%)");


     // add x axis and label it for consumer confidence
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
       .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", margin.bottom / 1.5)
        .text("employment rate (%)");

}

function groupBar(data, selectedCountry)  {

    // define the margins for the scatter plot and the width and height
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 300 - margin.right - margin.left,
        height = 300 - margin.top - margin.bottom;

    // add a svg to the chart div but let it start from the upper left margins corner
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.right + margin.left,)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    for (i = 0; i < data.length; i++) {
        if (data[i].country === selectedCountry) {

        console.log(data[i].Woman_voters)
        }
    }

}


