// create a scalable vector graphic
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        // import the data
        d3.json("data.json").then(function(data) {
            Object.keys(data).forEach(function(key) {
                country.push(key)
                KTOE.push(data[key]["KTOE"])
                energy.push(data[key]["PC_PRYENRGSUPPLY"])
            });

            // create scales
            var xScale = d3.scaleLinear()
                     .domain([0, energy.length])
                     .range([yPad, width]);

            //x.domain(d3.extent(data, function(d) {return d.key

            var yScale = d3.scaleLinear()
                     .domain([d3.min(energy),d3.max(energy)])
                     .range([0, height - xPad]);

            var xAxis = d3.axisBottom(xScale).ticks(0);

            var yAxis = d3.axisLeft(yScale);

            // create the bars in  for each mean value energy
            var rects = svg.selectAll("rect")
               .data(energy)
               .enter()
               .append("g")
               .attr("class", "bars")
               .append("rect");



               rects.attr("class", "bar")
               .attr("x", function(d, i) {
                   return xScale(i); })
               .attr("y", function(d) {
                   return height - yScale(d) - xPad; })
               .attr("width", width / energy.length - barPad)
               .attr("height", function(d) {
                   return yScale(d); });

            var counter = -1;
            var textCounter = -1;


            svg.selectAll(".bars")
            .append("text")
            .attr("class", "label")
            .attr('transform', 'rotate(90)')
            .attr("y", function(d) { counter++; return  - xScale(counter) - barPad })
            .attr("x", height - xPad)
            .text(function(d) { textCounter++; return country[textCounter]; });

            // create x axis
            svg.append("g")
                .attr("transform", "translate(0," + (height - xPad) + ")")
                .call(xAxis);

            // create y axis
            svg.append("g")
            .attr("transform", "translate(" + yPad + ")")
            .call(yAxis);