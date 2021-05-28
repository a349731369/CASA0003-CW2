var date = [];

TotalData.forEach(elem => {
    if (date.indexOf(elem["date"]) == -1)
        date.push(elem["date"]);
});

var date = date.sort((x, y) => new Date(x) - new Date(y));

const svg1 = d3.select('#air_quality').append('svg')
    .attr('width', config.SVGWidth)
    .attr('height', config.SVGHeight);
const innerWidth = config.SVGWidth - config.Padding.left - config.Padding.right;
const innerHeight = config.SVGHeight - config.Padding.top - config.Padding.bottom - 50;
const intervalTime = config.IntervalTime;


// Drawing Config
const xValue = d => Number(d.value);
const yValue = d => d.name;

const g = svg1.append('g')
    .attr('transform', `translate(${config.Padding.left},${config.Padding.top})`);
const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`);
const yAxisG = g.append('g');

xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 100);

const xScale = d3.scaleLinear();
const yScale = d3.scaleBand()
    .paddingInner(0.3)
    .paddingOuter(0);

const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(config.XTicks)
    .tickPadding(20)
    .tickFormat(d => d)
    .tickSize(-innerHeight);

const yAxis = d3.axisLeft()
    .scale(yScale)
    .tickPadding(5)
    .tickSize(-innerWidth);

var timeCounter = {"value": 0};
const timer = g.append("text")
    .attr('class', 'timer')
    .attr('font-size', config.TimerFontSize)
    .attr('fill-opacity', 0)
    .attr('x', innerWidth - 100)
    .attr('y', innerHeight);

function getColorClass(d){
    var tmp = 0;
    for (let index = 0; index < d.name.length; index++)
        tmp = tmp + d.name.charCodeAt(index);
    return config.ColorClass[tmp % config.ColorClass.length];
}

function getDataByDate(date){
    //isFirst = 0;
    //timeCounter.value = Number(date);

    var data = [];
    TotalData.forEach(elem => {
        if (elem["date"] == date)
            data.push(elem);
    });
    return data.slice(0, config.MaxNumber);
}

function refresh(data){
    yScale
        .domain(data.map(yValue).reverse())
        .range([innerHeight, 0]);
    xScale
        .domain([0, d3.max(data, xValue)]).range([0, innerWidth]);
    xAxisG
        .transition(g).duration(3000 * intervalTime).ease(d3.easeLinear).call(xAxis);
    yAxisG
        .transition(g).duration(3000 * intervalTime).ease(d3.easeLinear).call(yAxis);
    yAxisG
        .selectAll('.tick').remove();
    timer.data(data)
        .transition().duration(intervalTime * 2000).delay(intervalTime * 1000 * isFirst).ease(d3.easeLinear)
        .attr('fill-opacity', 1)
        .tween("text", function(d){
            var self = this;
            //var i = d3.interpolate(self.textContent, data[0].date);
            return function(t){
                self.textContent = data[0].date;
            };
        });


    // start
    var bar = g.selectAll(".bar")
        .data(data, function(d){
            return d.name;
        });

    // Enter Items
    var barEnter = bar.enter().insert("g", ".axis")
        .attr("class", "bar")
        .attr("transform", function(d){
            return "translate(0," + yScale(yValue(d)) + ")";
        });
    barEnter.append("g")
        .attr("class", function(d){
            return getColorClass(d);
        });

    barEnter.append("rect")
        .attr("width", d => xScale(xValue(d)))
        .attr("fill-opacity", 0)
        .attr("height", 26).attr("y", 50)
        .transition("a")
        .attr("class", d => getColorClass(d))
        .delay(500 * intervalTime)
        .duration(2490 * intervalTime)
        .attr("y", 0)
        .attr("width", d => xScale(xValue(d)))
        .attr("fill-opacity", 1);

    barEnter.append("text")
        .attr("y", 50)
        .attr("fill-opacity", 0)
        .transition("2")
        .delay(500 * intervalTime)
        .duration(2490 * intervalTime)
        .attr("fill-opacity", 1)
        .attr("y", 0)
        .attr("class", function(d){
            return "label " + getColorClass(d);
        })
        .attr("x", -5)
        .attr("y", 20)
        .attr("text-anchor", "end")
        .attr('style', 'font-size:18pt')
        .text(d => d.name);

    barEnter.append("text")
        .attr("x", d => xScale(xValue(d)))
        .attr("y", 50)
        .attr("fill-opacity", 0)
        .text(d => d.value)
        .transition()
        .delay(500 * intervalTime)
        .duration(2490 * intervalTime)
        .attr("fill-opacity", 1).attr("y", 0)
        .attr("class", function(d){
            return "value " + getColorClass(d);
        })
        .tween("text", function(d){
            var self = this; // why?
            var i = d3.interpolate(self.textContent, Number(d.value));
            return function(t){
                self.textContent = Math.round(i(t));
            };
        })
        .attr("x", d => xScale(xValue(d)) + 10)
        .attr("y", 22);

    // barEnter.append("text").attr("x", d => xScale(xValue(d)))
    //     .attr("stroke", function(d) {
    //         return $("." + getColorClass(d)).css("fill");
    //     })
    //     .attr("class", "barInfo")
    //     .attr("y", 50).attr("stroke-width", "0px")
    //     .attr("fill-opacity", 0)
    //     .transition()
    //     .delay(500 * intervalTime)
    //     .duration(2490 * intervalTime)
    //     .text(d => d.name)
    //     .attr("x", d => xScale(xValue(d)) - 10)
    //     .attr("fill-opacity", 1)
    //     .attr("y", 2)
    //     .attr("dy", ".5em")
    //     .attr("text-anchor", "end")
    //     .attr("stroke-width", "1px");

    // Update Items
    var barUpdate = bar.transition().duration(2990 * intervalTime).ease(d3.easeLinear);

    barUpdate.select("rect")
        .attr("width", d => xScale(xValue(d)));
    barUpdate.select(".barInfo")
        .attr("x", d => xScale(xValue(d)) - 10)
        .attr("fill-opacity", 1)
        .attr("stroke-width", "1px");

    barUpdate.select(".value")
        .tween("text", function(d){
            var self = this;
            var i = d3.interpolate(self.textContent, Number(d.value));
            return function(t){
                self.textContent = Math.round(i(t));
            };
        })
        .duration(2990 * intervalTime)
        .attr("x", d => xScale(xValue(d)) + 10);


    // Exit Items
    var barExit = bar.exit()
        .attr("fill-opacity", 1)
        .transition().duration(2500 * intervalTime);

    barExit
        .attr("transform", "translate(0," + 780 + ")")
        .remove()
        .attr("fill-opacity", 0);

    barExit.select("rect")
        .attr("fill-opacity", 0);
    barExit.select(".value")
        .attr("fill-opacity", 0);
    barExit.select(".barInfo")
        .attr("fill-opacity", 0)
        .attr("stroke-width", "0px");

    bar.data(data, d => d.name)
        .transition()
        .delay(500 * intervalTime)
        .duration(2490 * intervalTime)
        .attr("transform", function(d){
            return "translate(0," + yScale(yValue(d)) + ")";
        });
}


var Ninterval = 0;
var iter = 0,
    isFirst = 1;
restartflag = false;

function changeflag(){
    restartflag = true
}

var inter = setInterval(function next(){
    if (restartflag)
    {
        iter=0
        restartflag=false
    }
    refresh(getDataByDate(date[iter++]));
    if (iter >= date.length)
        window.clearInterval(inter);
}, 3000 * intervalTime);


