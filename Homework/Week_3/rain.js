// Name: Leonie Bouma
// Student number: 10898050

var fileName = "KNMI_rain.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
        var data = JSON.parse(txtFile.responseText);

        // Create a list of the rain in 0.1 mm and dates
        var rain = []
        var dates = []
        Object.keys(data).forEach(function(key) {
            var year = key.slice(0, 4)
            var month = key.slice(4, 6)
            var day = key.slice(6, 8)
            // transform dates into milliseconds and back to dates
            var date = new Date(year, month, day)
            date = date.getTime();
            date = Math.round(date / (60*60*24*1000) - 17197)
            dates.push(date)
            rain.push(data[key]["rain (0.1 mm)"])
         });

        // Create 2D canvas
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
    };
};
txtFile.open("GET", fileName);
txtFile.send();

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}