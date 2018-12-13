
 var width = 800,
            height = 500,
            barPad = 2,
            yPad = 50,
            xPad = 45;

        var country = [],
            KTOE = [],
            energy = [];

        // Add a scalable vector graphic for the visualisation
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create the tooltip
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "toolTip");

        // import and parse the data
        d3.json("data.json").then(function(data) {
            Object.keys(data).forEach(function(key) {
                country.push(key)
                KTOE.push(data[key]["KTOE"])
                energy.push(data[key]["PC_PRYENRGSUPPLY"])
            });

            // create scales for the data
            var xScale = d3.scaleLinear()
                     .domain([0, energy.length])
                     .range([yPad, width]);

            var yScale = d3.scaleLinear()
                     .domain([d3.min(energy),d3.max(energy)])
                     .range([height - xPad, 0]);

            // create the axis functions
            var xAxis = d3.axisBottom(xScale).ticks(0),
                yAxis = d3.axisLeft(yScale);

            // create the rectangles representing the mean values of renewable energy %
            svg.selectAll("rect")
               .data(energy)
               .enter()
               .append("g")
               .attr("class", "bars")
               .append("rect")
               .attr("class", "bar")

               // calculate position and height of each bar for a data value
               .attr("x", function(d, i) {
                   return xScale(i); })
               .attr("y", function(d) {
                   return yScale(d); })
               .attr("width", width / energy.length - barPad)
               .attr("height", function(d) {
                   return height - xPad - yScale(d); })

               // show data value while hovering over a bar
               .on("mousemove", function(d){
                    tooltip
                      .style("left", d3.event.pageX - 50 + "px")
                      .style("top", d3.event.pageY - 70 + "px")
                      .style("display", "inline-block")
                      .html(Math.round(d * 100) / 100 + " %");
                })
    		    .on("mouseout", function(d){ tooltip.style("display", "none")
    		    ;});

            // display the according country underneath each bar
            var counter = -1;
            var textCounter = -1;

            svg.selectAll(".bars")
            .append("text")
            .attr("class", "label")
            .attr('transform', 'rotate(90)')
            .attr("y", function(d) { counter++; return  - xScale(counter) - barPad })
            .attr("x", height - xPad)
            .text(function(d) { textCounter++; return country[textCounter]; });

            // display the x axis
            svg.append("g")
                .attr("transform", "translate(0," + (height - xPad) + ")")
                .call(xAxis)
                .append("text")
                .attr("y", xPad - 5)
                .attr("x", width / 2)
                .attr("fill", "black")
                .text("Country");

            // display the y axis
            svg.append("g")
                .attr("transform", "translate(" + yPad + ")")
                .call(yAxis)

                // add y axis label
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -yPad / 2)
                .attr("x", -height / 3)
                .attr("fill", "black")
                .text("Mean percentage (%) of renewable energy");
        });