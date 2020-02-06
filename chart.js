//dictionary for pokemon colors
const colors = {
    "Bug": "#4E79A7",
    "Dark": "#A0CBE8",
    "Electric": "#F28E2B",
    "Fairy": "#FFBE7D",
    "Fighting": "#59A14F",
    "Fire": "#8CD17D",
    "Ghost": "#B6992D",
    "Grass": "#499894",
    "Ground": "#86BCB6",
    "Ice": "#a6f2ff",
    "Normal": "#E15759",
    "Poison": "#FF9D9A",
    "Psychic": "#79706E",
    "Steel": "#BAB0AC",
    "Water": "#D37295"
}

let gen = 6;
let legendary = "False";

let margin = { top: 40, right: 40, bottom: 40, left: 40 },
    height = 600 - margin.top - margin.bottom,
    width = 1000 - margin.right - margin.left;
    
    // Define the div for the tooltip
let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

let svg = d3.select('#myChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//read in pokemon data
d3.csv("./pokemon.csv", function (data) {

    console.log(data.filter(function(d) { return d.Generation == gen && d["Legendary"] == "True"; }));

    function getFilteredData(param, leg) {
        return data.filter(function(d) { return d.Generation == param && d.Legendary == leg; });
    }

    // Add X axis
    var x = d3.scaleLinear()
        .domain([15, 160])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([150, 800])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(getFilteredData(gen, legendary))
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d["Sp. Def"]); })
        .attr("cy", function (d) { return y(d.Total); })
        .attr("r", 10)
        .style("fill", function (d) { return colors[d['Type 1']]
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("tip<br/>tip")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);; })

})
