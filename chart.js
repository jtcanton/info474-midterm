//dictionary for pokemon colors
const colors = {
    "Bug": "#6a7dab",
    "Dark": "#9bc4cf",
    "Electric": "#edaf77",
    "Fairy": "#9c7bba",
    "Fighting": "#216e03",
    "Fire": "#f5d65b",
    "Flying": "#babbe8",
    "Ghost": "#a69a46",
    "Grass": "#85c9a6",
    "Ground": "#3b9481",
    "Ice": "#a6f2ff",
    "Normal": "#cc415d",
    "Poison": "#ed8298",
    "Psychic": "#7a7a7a",
    "Steel": "#964e6e",
    "Water": "#edb4da",
    "Dragon": "#de8431",
    "Rock": "#c9c9c9"

}

let globalData;
var v = document.getElementById("sel");
let gen = 1; //v.options[v.selectedIndex].value;
console.log(gen);
let legendary = "All";
let totalMax = 0;
let sDefMax = 0;

document.getElementById('sel').addEventListener("change", function () {
    var e = document.getElementById("sel");
    var val = e.options[e.selectedIndex].value;
    gen = val;
    //console.log(val);
    makeGraph(globalData);
})

document.getElementById('legSel').addEventListener("change", function () {
    var e = document.getElementById("legSel");
    var val = e.options[e.selectedIndex].value;
    legendary = val;
    //console.log(val);
    makeGraph(globalData);
})

let margin = { top: 40, right: 40, bottom: 40, left: 40 },
    height = 800 - margin.top - margin.bottom,
    width = 1200 - margin.right - margin.left;

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
d3.csv("./pokemon.csv", (data) => makeGraph(data));

function makeGraph(data) {

    if (globalData == null) {
        globalData = data;
    }
    svg.selectAll("*").remove();

    //console.log(data.filter(function (d) { return d.Generation == gen && d["Legendary"] == "True"; }));

    //function to filter the data
    function getFilteredData(param, leg) {
        // if 
        if (leg == "All" && param != "All") {
            return data.filter(function (d) { return d.Generation == param; });
        }
        if (leg != "All" && param == "All") {
            return data.filter(function (d) { return d.Generation == param; });
        } if (leg != "All" && param != "All") {
            return data.filter(function (d) { return d.Generation == param && d.Legendary == leg; });
        } else {
            return data;
        }
    }

    //filtered data
    let temp = getFilteredData(gen, legendary);

    //set up the max and min for each of the axes
    let res1 = temp.map(a => a.Total);
    let res2 = temp.map(b => b["Sp. Def"]);
    totalMax = Math.max(...res1);
    sDefMax = Math.max(...res2);
    let totalMin = Math.min(...res1);
    let sDefMin = Math.min(...res2);

    //array for legend
    let types = temp.map(a => a["Type 1"]);
    types = [...new Set(types)];

    console.log(types);


    // Add X axis
    var x = d3.scaleLinear()
        .domain([sDefMin - 10, sDefMax + 10])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([totalMin - 10, totalMax + 20])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(20)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(10)
    }

    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        )

    d3.selectAll(".grid line")
        .attr("stroke", "lightgray");


    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(getFilteredData(gen, legendary))
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d["Sp. Def"]); })
        .attr("cy", function (d) { return y(d.Total); })
        .attr("r", 10)
        .style("stroke", "#5885cc")
        .style("fill", function (d) {
            return colors[d['Type 1']]
        })
        .on("mouseover", function (d) {
            //console.log(d3.event.pageX + " " + d3.event.pageY);
            div.transition()
                .style("border", "1px solid grey")
                //.duration(200)
                .style("opacity", .9);
            div.html(d.Name + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(300)
                .style("opacity", 0)
                .style("border", "0px");
        })

    document.getElementById("legend").innerHTML = "";

    d3.select("#legend")
        .style("width", "160px")
        .style("height", "560px")
        .style("position", "absolute")
        .style("top", "200px")
        .style("left", "1200px");

    let childX = 10;
    let ChildY = 15;

    for (let i = 0; i < types.length; i++) {
        var div1 = document.createElement('div');
        document.getElementById('legend').appendChild(div1);
        div1.id = 'div1';
        div1.style.position = "absolute";
        div1.style.left = childX + "px"; 
        div1.style.top = ChildY + "px";
        div1.style.border = "1px solid black";
        div1.style.width = "125px";
        div1.style.height = "20px";
        div1.style.padding = "4px";
        div1.style.backgroundColor = colors[types[i]];
        div1.style.color = "white";
        div1.innerHTML = types[i];
        div1.style.zIndex = 500;

        ChildY += 33;
    }




    // svg.append('g')
    //     .selectAll("rect")
    //     .data(types)
    //     .enter()
    //     .append('rect')
    // .attr("cx", function (d) { return x(d["Sp. Def"]); })
    // .attr("cy", function (d) { return y(d.Total); })
    //     .style("position", "absolute")
    //     .style("top", "200px")
    //     .style("left", "1200px")
    // .style("width", "16px")
    // .style("height", "16px")
    //     .style("border", "2px solid black")




}
