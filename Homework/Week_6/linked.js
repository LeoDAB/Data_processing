/*
Name: Leonie Bouma
Student number: 10898050
*/

window.onload = function() {
    var voters = "data.json"
    var requests = [d3.json(voters)];

    Promise.all(requests).then(function(response) {

        // create the scatter plot, change the data to a usable format and then create the grouped bar chart
        linkedViews(response[0])
        changeData(response[0])
        groupBar(data)

    }).catch(function(e){
        throw(e);
    });
};


function linkedViews(dataset)  {

    // make a list of dicts
    var data = []
    Object.keys(dataset).forEach(function(key) {
        data.push(dataset[key])

    });

     // define the margins for the scatter plot and the width and height
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 600 - margin.right - margin.left,
        height = 300 - margin.top - margin.bottom;

    // add a svg but let it start from the upper left margins corner
    var scatter = d3.select("body")
        .append("svg")
        .attr("width", width + margin.right + margin.left,)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create the tooltip
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

    // the percentage of total voters is on the y axis, the employment rate on the x axis
    y.domain(d3.extent(data, function(d){return d.Total_voters})).nice();
	x.domain(d3.extent(data, function(d){return d.Total_employed})).nice();


    // create the data circles from our data
    point = scatter.selectAll(".point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cy", function(d){ return y(d.Total_voters); })
        .attr("cx", function(d){ return x(d.Total_employed); });

    // show the country name for a data point
    point.on("mousemove", function(d){
          tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 70 + "px")
          .style("display", "inline-block")
          .html(d.country);

          // trying to link it to the bar chart but failing
          document.getElementsByClassName("block").style.opacity = '0.5'
           })
        .on("mouseout", function(d){ tooltip.style("display", "none"); });

   // point.on("mousemove", function(d) {
   //     document.getElementsByClassName("block")
   // })

    // add y axis and label it for percentage of voters turnout
    scatter.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", - margin.right * 1.2)
        .attr("x", - height / 3)
        .text("voters turnout (%)");


     // add x axis and label it for employment rate in each country
    scatter.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", margin.bottom / 1.5)
        .text("employment rate (%)");
}

function changeData(dataset)   {

    data = []

    // create a list with nested dictionaries for each country
    Object.keys(dataset).forEach(function(key) {
        var obj = {};
        obj["country"] = dataset[key].country

        var objVotersWom = {};
        objVotersWom["type"] = "% of women voted"
        objVotersWom["value"] = dataset[key].Woman_voters

        var objVotersTot = {};
        objVotersTot["type"] = "% of population voted"
        objVotersTot["value"] = dataset[key].Total_voters

        var objVotersMen = {};
        objVotersMen["type"] = "% of men voted"
        objVotersMen["value"] = dataset[key].Men_voters


        valuelist = [objVotersWom, objVotersTot, objVotersMen]

        obj["values"] = valuelist

        data.push(obj)


    });

    return data
}

function groupBar(data)  {


    // define the margins for the bar chart
    var margin = {top: 20, right: 20, bottom: 80, left: 40},
    width = 1500 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom;

    // x0 are the countries
    var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05);

    // x1 are the separate voter groups
    var x1 = d3.scaleBand().padding(0.075);;

    var y = d3.scaleLinear()
    .range([height, 0]);

    // colors for woman, total and men (pink, green, blue)
    var color = d3.scaleOrdinal()
    .range(["#e9a3c9", "#31a354", "#43a2ca"])

    // define axis
    var xAxis = d3.axisBottom()
	    .scale(x0);

    var yAxis = d3.axisLeft()
        .scale(y);

    // add a svg but let it start from the upper left margins corner
    var groupedBar = d3.select("body")
        .append("svg")
        .attr("width", width + margin.right + margin.left,)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var countryNames = data.map(function(d) { return d.country; });
    var voterPercentage = data[0].values.map(function(d) { return d.type; })

    // based on: https://stackoverflow.com/questions/14551653/how-can-i-perform-this-d3-js-magic-grouped-bar-chart-with-json-rather-than-csv
    x0.domain(countryNames)
    x1.domain(voterPercentage).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(types) { return d3.max(types.values, function(d) { return d.value; }); })]).nice();


    // create a block for each country
    groupedBar.selectAll(".block")
        .data(data)
        .enter().append("g")
        .attr("class", "block")
        .attr("transform",function(d) { return "translate(" + x0(d.country) + ",0)"; })

        // add the bars into the block for each country
        .selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function(d) { return x1(d.type); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        // give it the appropriate color
        .style("fill", function(d) { return color(d.type) });

    // add y axis to bar chart
    groupedBar.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", - margin.right * 1.5)
        .text("Percentage of voters (%)");

    // add x axis to bar chart and rotate the ticks based on: https://bl.ocks.org/mbostock/4403522
    groupedBar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // add a legend to the plot and since it doesn't fit at either left or right: place it above some lower bars
    var legend = groupedBar.selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        // make sure the legend components aren't layered on top of each other
        .attr("transform", function(d, i) { return "translate(-270," + i * margin.top + ")"; });

    // create a colored rectangle for group, pink female, green total an blue for men
    legend.append("rect")
        .attr("x", width)
        .attr("width", margin.right)
        .attr("height", margin.right)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - margin.left*4)
        .attr("y", 14)
        .text(function(d) { return d; });
}


