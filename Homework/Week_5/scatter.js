/*
Name: Leonie Bouma
Student number: 10898050

useful site: https://bl.ocks.org/jalapic/be485f24c4cefb3f0b68f2943364c93d
*/
window.onload = function() {
    var womenInScience = "MSTI.json",
        consConf = "consConf.json",
        patents = "patent.json";

    var requests = [d3.json(womenInScience), d3.json(consConf)];

    Promise.all(requests).then(function(response) {
        logging(response)
        createScatter(response)
    }).catch(function(e){
        throw(e);
    });
};

function logging(data) {
    console.log(data)
};

function createScatter(data) {
    var dataset = [
                  [ 5,     20 ],
                  [ 480,   90 ],
                  [ 250,   50 ],
                  [ 100,   33 ],
                  [ 330,   95 ],
                  [ 410,   12 ],
                  [ 475,   44 ],
                  [ 25,    67 ],
                  [ 85,    21 ],
                  [ 220,   88 ]
    ];
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 800 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select(".chart")
            .append("svg")
            .attr("width", width + margin.right + margin.left,)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //svg.selectAll("circle")
      //  .data(data)

};

