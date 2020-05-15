
function chartGen (data) {   
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 30, left: 30},
      width = 320 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#mychart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  // Parse the Data
  //d3.csv("js/data.csv", function(data) {
  //d3.json("js/data.json", function(data) {

  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d._id; }))
    .padding(0.2);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
  
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, getMax(data, "count")])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  
  // Bars
  svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d._id); })
      .attr("y", function(d) { return y(d.count); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.count); })
      .attr("fill", "#69b3a2")
    
// })  for read data  from  file : d3.json(, function (data).......) 
}

function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    //return max;
    return max[prop];
}






