var Graph = function(ld3, lgrid) {
    var d3 = ld3;
    var grid = lgrid;

    this.updateGraph = function() {
        var tempData = grid.get();
        createGraph(createTestData(tempData), function(k) { return k == "CI"; }, "body #myGraph1");
        createGraph(createTestData(tempData), function(k) { return k == "LI"; }, "body #myGraph2");
        createGraph(createTestData(tempData), function(k) { return k == "LgI" || k == "LI"; }, "body #myGraph3");
    }

    function createGraph(inData, filterKeyword, target_tag) {
    
        var margin = {top: 20, right: 80, bottom: 30, left: 50},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
        
        var parseDate = d3.time.format("%Y%m").parse;
        
        var x = d3.time.scale()
            .range([0, width]);
        
        var y = d3.scale.linear()
            .range([height, 0]);
        
        var color = d3.scale.category10();
    
        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.temperature); });
        
        d3.select(target_tag + " > svg").remove();
    
        var svg = d3.select(target_tag).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        color.domain(d3.keys(inData[0]).filter(function(key) {
            return filterKeyword(key);
        }));
    
        inData.forEach(function(d) {
            d.date_form = parseDate(d.date);
        });
    
        var cities = color.domain().map(function(name) {
            return {
                name: name,
                values: inData.map(function(d) {
                    return {date: d.date_form, temperature: +d[name]};
                })
            }
        });
        x.domain(d3.extent(inData, function(d) { return d.date_form; }));
        y.domain([
            d3.min(cities, function(c) {
                return d3.min(c.values, function(v) {
                    return v.temperature;}); }),
            d3.max(cities, function(c) {
                return d3.max(c.values, function(v) {
                    return v.temperature;}); })
        ]);
        
        var city = svg.selectAll(".city")
            .data(cities)
            .enter().append("g")
            .attr("class", "city");
        
        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) {
                return line(d.values);
            })
            .style("stroke", function(d) {
                return color(d.name);
            });
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
            
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");
    }

    function createTestData(srcArray) {
        var newdata = [];
        srcArray.forEach(function(src) {
          if (!src.del) {
            newdata.push({
              date:src.date,
              CI:src.CI,
              LI:src.LI,
              LgI:src.LgI
            });
          }
        });
        return newdata;
    }

}

