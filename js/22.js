d3.csv("data/UK_sectoral_shares_of_employment_disaggregated_by_subsector,_1920_to_2016.csv", function(IndustryData){
    var chartdata;

    var IndustryMenu = document.getElementById("IndustryMenu");

    for (var i = 0; i < IndustryData.length; i++) {            // In this loop we add the names of all the Cities in the CSV to the drop down menu
        var el = document.createElement("option");
        el.textContent = IndustryData[i].Industry;
        el.value = IndustryData[i].Index;
        IndustryMenu.appendChild(el);
    }

    function SetIndustryData(index){   // Function that extracts the population timeseries for the selected city

        console.log(IndustryData[index]); // Show the data of the row in the console

        //document.getElementById("charttitle").innerHTML = IndustryData[index].Industry; // The name of the city and country is inserted into the chart title

        // Dimple requires each data point on a time series to be a separate row. Below we insert the population data from the CityData array into a new array of JSON objects in the required format
        chartdata = [
            {"Industry": "Hist", "Year": "1920", "proportion": (IndustryData[index].prop1920_1938 * 1)},
            {"Industry": "Hist", "Year": "1948", "proportion": (IndustryData[index].prop1948_1959 * 1)},
            {"Industry": "Hist", "Year": "1960", "proportion": (IndustryData[index].prop1960_1979 * 1)},
            {"Industry": "Hist", "Year": "1980", "proportion": (IndustryData[index].prop1980_1999 * 1)},
            {"Industry": "Hist", "Year": "2000", "proportion": (IndustryData[index].prop2000_2016 * 1)},
        ];

    }

    SetIndustryData(0);


    var svg = dimple.newSvg("#chartContainer", 1280, 400); // The chart is an svg variable assigned to the chartcontainer div. It's width and height are also assigned here


    var myChart = new dimple.chart(svg, chartdata);  // Create the chart
    myChart.setBounds(60, 15, 700, 300);               // Set the chart bounds within the svg container

    myChart.defaultColors = [
        new dimple.color("#54aae3"),
        new dimple.color("#54aae3")
    ];


    var x = myChart.addTimeAxis("x", "Year", "%Y", "%Y");  // Define the x axis. The latter statements define the date format which we want to be year only
    x.timeInterval = 10;

    var y = myChart.addMeasureAxis("y", "proportion"); // Define the y axis
    y.ticks = 10;

    var s = myChart.addSeries("Industry", dimple.plot.line);
    s.lineMarkers = true;
    s.interpolation = "cardinal";

    myChart.draw(500); // Draw the chart. The number is the animation delay in miliseconds


    svg.selectAll("path.dimple-proj").style("stroke-dasharray", "2"); // Some minor stying changes using the svg selectAll statement. Make the projected data a dashed line and the grid colour lighter.
    svg.selectAll("path.domain").style("stroke", "#CCC");
    svg.selectAll("g.tick line").style("stroke", "#CCC");


    document.getElementById("IndustryMenu").onchange = function(){    // This is the event listener that runs when the user changes the menu
        var x = document.getElementById("IndustryMenu");
        let index = x.selectedIndex;


        SetIndustryData(index);   // Run the function that will update chartdata with the user selected city

        svg.selectAll(".dimple-marker,.dimple-marker-back").remove(); // There's a bug where it doesn't remove the markers from the previous series.

        myChart.data = chartdata; // Update the chart with the new chartdata
        myChart.draw(500);
    };


});
