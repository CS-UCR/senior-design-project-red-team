var p_cur_chart
var data_error = false

function p_init() {
    fetch("http://" + hostname + ":" + port + "/" + ['flights'].join('/'))
        .then(response => response.json())
        .then(obj => {
            var e = document.getElementById('file-select')
            e.innerHTML = ''
            obj.forEach(x => {
                var o = document.createElement('option')
                o.innerHTML = x
                e.appendChild(o)
            })
        })
        .catch(err => console.error(err));
    /*var par1 = document.getElementById('parameter-1')
    var par2 = document.getElementById('parameter-2')
    var par3 = document.getElementById('parameter-3')
    var par4 = document.getElementById('parameter-4')*/
    var parameters = document.getElementById('PairWise_Plot_Parameter_Box');
    flight_parameters.forEach(x => {
        let o3 = document.createElement('input')
        o3.type = 'checkbox'
        o3.id = x
        o3.name = "Pairwise_Plot_Option"
        o3.value = x
        let label = document.createElement('label')
        label.htmlFor = x
        label.appendChild(document.createTextNode(x))
        let br = document.createElement('br')
        parameters.appendChild(o3)
        parameters.appendChild(label)
        parameters.appendChild(br)
        /*var o2 = document.createElement('option')
        var o3 = document.createElement('option')
        var o4 = document.createElement('option')*/
        /*o2.innerHTML = x
        o3.innerHTML = x
        o4.innerHTML = x*/
        /*par2.appendChild(o2)
        par3.appendChild(o3)
        par4.appendChild(o4)*/
    })
}

var axis = () => ({
      showline:false,
      zeroline:false,
      gridcolor:'#ffff',
      ticklen:4
    })

function single_graph() {
    location.href = "Client.html";
}

/*
let lis = document.querySelector("#\\36 77200105090350 > div.ChartContents > svg > g > text:nth-child(16)")
for(var i = 0; i < lis.length; i++){
  if(lis[i].style.display.hidden != true){
    console.log(lis[i].innerHTML);
  }
}

*/

function remove_children(p){
  while(p.firstChild){
    //document.querySelector("#\\36 77200105090350 > div.ChartContents > svg > g > text:nth-child(16)")
    //77200105090350
    //console.log(p.firstChild.querySelectorAll('[text]:nth-child(16)').innerText)
    ///html/body/div[2]/div/main/div[2]/div/div/div[1]/svg/g/text[2]
    //#\36 77200105090350 > div.ChartContents > svg > g > text:nth-child(16)
    //console.log(p.firstChild.querySelector("ChartContents > svg > g > text:nth-child(16)").innerHTML);
    //document.querySelector("#\\36 77200105090350 > div.ChartContents > svg > g > text:nth-child(16)")
    //console.log(p.firstChild.id)
    //console.log(document.querySelector("#\\36 77200105090350 > div.ChartContents > svg > g > text:nth-child(16)").innerHTML)

    p.removeChild(p.firstChild);
  }
}
function goto4() {
    refresh_chart = () =>  p_refresh_chart();
    type_of_graph = "pw"
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById("DISPLAY_STATISTICS").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL_NEW_TAB").hidden = true;
    document.getElementById('Refresh').hidden = false;
    document.getElementById('refresh').hidden = false;
    document.getElementById('ptile-opts').hidden = true;
    document.getElementById('TIME_SERIES_TO_DTR').hidden = true;
    document.getElementById('file-select').disabled = false;
    document.getElementById('DownAnonJson').hidden = true;
    document.getElementById('DownAnonCSV').hidden = true;
    document.getElementById('UpAnon').hidden = true;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #00ff00";
    document.getElementById('STAT').style.border = "1px solid #000000";
    document.getElementById('ONED').style.border = "1px solid #000000";
    document.getElementById('ANON').style.border = "1px solid #000000";

}

 function p_refresh_chart() {

   if(d3.select('#file-select').property('value') === ""){
     window.alert("Please enter a flight");
     return;
   }

    if(tab_count === 0){
      p_refresh_chart_tab();
    }else{

      if(cur_chart){
      remove_children(cur_chart);
      }

      var flight = document.getElementById('file-select').value
      var parameters = GetCheckedParameters();
      let orig = cur_text;
      let hold = cur_text.substring(0, 2);
      document.getElementById(cur_text).id = orig.replace(hold , "pw");
      cur_text = orig.replace(hold , "pw");
    load_chart(parameters,flight,cur_chart);
    document.getElementById('time_series_options').hidden = true;
    let checks = document.querySelectorAll('input[name="time_series_option"]:checked');
    for(var i = 0; i < checks.length; i++){
      checks[i].checked = false;
    }
    }
  }

  function p_refresh_chart_tab(){
    let tab = document.createElement('button');
    let delete_button = document.createElement('span');
    let text = document.createElement('span');
    let chart = document.createElement('div');

    text.classList.add("hover:color-[#0000ff]", "focus:text-color-[#0000ff]")
    delete_button.classList.add("text-4xl", "font-bold", "text-gray-100", "left-2", "z-10", "hover:text-[#f44336]", "cursor-pointer")
    chart.classList.add("w-3/4", "h-[800px]", "ml-5", "mt-2","grapher")
    tab.classList.add("border", "border-solid" ,"border-black" , "h-16" , "w-24")
    chart.id = "chart" + count;
    tab.id = "tab" + count;
    text.id = type_of_graph + count;
    text.innerHTML = "Tab " + count;
    delete_button.innerHTML = 'X';
    delete_button.onclick = () => {delete_tab(tab.id, chart)};
    text.onclick = () => {display(chart,tab , text.id)};


    tab.appendChild(delete_button);
    tab.appendChild(text);
    document.getElementById("sidebar").appendChild(tab);
    document.getElementById("test-chart").appendChild(chart);
    count++;
    if(tab_count === 0){
      first_tab = tab;
    }
    tab_count++;

    if(tab_count > 1){
      if(cur_chart != undefined){
        cur_chart.hidden = true;
      }
      chart.style.display = "inline";
    }
    display(chart,tab , text.id);

    p_refresh_chart();

  }

function GetCheckedParameters(){
  const checkboxes = document.querySelectorAll('input[name="time_series_option"]:checked');
    var options = [];
    checkboxes.forEach((checkbox) => {
    options.push(checkbox.value);
      });
  return options;
}

function load_chart(pars, flightno, div_name) {
    if (pars.length == 0) return;
    d3.json(`http://${hostname}:${port}/truncated/${flightno}`)
        .then(json => {
            return pars.map(par => json[par]);
        })
        .then(D => {
            console.log(D);
            pairwiseChart(div_name, D, pars);
        });
};

var clip_counter = 0;

function pairwiseChart(chart_div, data, pars, total_width = 800, total_height = 800, sep = 10) {
    const data_t = d3.transpose(data);
    console.log(data);
    const fontinfo = {
        size: 14,
        opacity: 50
    }
    const margin = {
        left: 30,
        bottom: 30,
        top: 10,
        right: 10
    };
    const width  = total_width - margin.left - margin.right;
    const height = total_height - margin.top - margin.bottom;
    const subplot = {
        num: pars.length,
        sep: sep,
        width: undefined,
        height: undefined
    }
    subplot.width = (width - subplot.sep * (subplot.num - 1)) / subplot.num;
    subplot.height = (height - subplot.sep * (subplot.num - 1)) / subplot.num;

    console.log(subplot);

    // Create SVG and graph area offset by margin values
    let svg = d3.select(chart_div)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create Scales and Bins
    let xScale = data.map(d =>
        d3.scaleLinear()
            .domain(d3.extent(d)).nice()
            .range([0, subplot.width])
    );
    let yScale = data.map(d =>
        d3.scaleLinear()
            .domain(d3.extent(d))
            .range([subplot.height, 0])
    );
    let bins = data.map((d, i) =>
        d3.bin()
            .domain(xScale[i].domain())
            .thresholds(xScale[i].ticks(10))
        (d)
    );
    let hScale = bins.map(bs =>
        d3.scaleLinear()
            .domain([0, d3.max(bs, b => b.length)])
            .range([subplot.height, 0])
    );

    // Create Subplot <g>'s
    let cell = svg.selectAll("g")
        .data(d3.cross(d3.range(pars.length), d3.range(pars.length)))
        .join("g")
            .attr("transform", ([i,j]) => `translate(
                ${i * (subplot.sep + subplot.width)},
                ${j * (subplot.sep + subplot.height)}
            )`);

    // Populate subplots
    cell.each(function ([i,j]) {
        if (i == j) { // Draw Histogram
            d3.select(this)
                .selectAll('rect')
                .data(bins[i])
                .join('rect')
                    .attr("x", 1)
                    .attr("transform", b => `translate(${xScale[i](b.x0)}, ${hScale[i](b.length)})`)
                    .attr("width", b => (n => n < 0 ? 0 : n)(xScale[i](b.x1) - xScale[i](b.x0) - 1))
                    .attr("height", b => subplot.height - hScale[i](b.length))
                    .style("fill", "steelblue");
        } else { // Draw Points
            d3.select(this)
                .selectAll("circle")
                .data(data_t)
                .join("circle")
                    .attr("cx", d => xScale[i](d[i]))
                    .attr("cy", d => yScale[j](d[j]))
                    .attr("r", 3)
                    .attr("fill-opacity", 0.7)
                    .attr("fill", "steelblue");
        }
    });

    // Draw borders around subplots
    cell.append("rect")
        .style("fill", "none")
        .style("stroke", "gray")
        .attr("width", subplot.width)
        .attr("height", subplot.height);

    // Brushing (Selection ability)
    circle = cell.selectAll("circle");

    const brush = d3.brush()
        .extent([[0, 0],[subplot.width, subplot.height]])
        .on("start", brushStart)
        .on("brush", brushMove)
        .on("end", brushEnd);

    let currentCell;

    function brushStart() {
        if (currentCell !== this) {
            d3.select(currentCell).call(brush.move, null);
            currentCell = this;
        }
    }
    function brushMove({selection}, [i,j]) {
        if (selection) {
            [[x0, y0], [x1, y1]] = selection;
            circle.classed("hidden", d =>
                xScale[i](d[i]) < x0 ||
                xScale[i](d[i]) > x1 ||
                yScale[j](d[j]) < y0 ||
                yScale[j](d[j]) > y1
            );
        }
    }
    function brushEnd({selection}, [i,j]) {
        if (selection) return;
        // [[x0, x1], [y0, y1]] = selection;
        // data.filter(d =>
        //     xScale[i](d[i]) > x0 &&
        //     xScale[i](d[i]) < x1 &&
        //     yScale[j](d[j]) > y0 &&
        //     yScale[j](d[j]) < y1
        // );
        circle.classed("hidden", false);
    }

    cell.filter(([i,j]) => i != j).call(brush);

    let xLabel = svg.append("g").selectAll("text")
        .data(pars)
        .join("text")
        .style("opacity", `${fontinfo.opacity}%`)
        .style("font-size", `${fontinfo.size}`)
        .text(p => p)
        .attr("transform", function (_, i) {
                return `translate(
                    ${(i * subplot.width + subplot.sep) + subplot.width / 2 - this.getComputedTextLength() / 2},
                    ${height + margin.bottom - fontinfo.size}
                )`});

    let yLabel = svg.append("g").selectAll("text")
        .data(pars)
        .join("text")
        .style("opacity", `${fontinfo.opacity}%`)
        .style("font-size", `${fontinfo.size}`)
        .text(p => p)
        .attr("transform", function (_, i) {
                return `rotate(${-90}) translate(
                    -${(i * subplot.width + subplot.sep) + subplot.height / 2 + this.getComputedTextLength() / 2},
                    -${margin.left - fontinfo.size}
                )`});
}

const default_settings = {
    height: 800,
    width: 1000,
    reverse_x: false,
    lines: false,
    onAnomaly: () => {},
    trace_colors: ['steelblue'],
    trace_names: ['Main'],
    boxes: [],
}

var addBox;

function twoParameterChart(chart_div, data, pars, user_settings) {
    console.log(data);
    var settings = {};
    Object.assign(settings, default_settings);
    Object.assign(settings, user_settings);
    console.log(settings);
    const total_height = settings.height;
    const total_width = settings.width;
    const fontinfo = {
        size: 18,
        opacity: 50,
        type: 'sans-serif'
    }
    const margin = {
        left: 100,
        bottom: 80,
        top: 10,
        right: 10
    };
    sel = null;

    // Create html divs
    let chart_grid = d3.select(chart_div).classed('ChartGrid', true)
    let chart_content = chart_grid.append('div').classed('ChartContents', true)
    let chart_sidebar = chart_grid.append('div').classed('ChartSidebar', true)
    let chart_options = chart_sidebar.append('div').classed('ChartOptions', true)
    let chart_box_toggle = chart_sidebar.append('div').classed('ChartBoxToggle', true)
    let chart_traces  = chart_sidebar.append('div')
    let chart_anomaly = chart_sidebar.append('div').classed('ChartAnomaly', true)

    //chart_anomaly.setAttribute("data-html2canvas" , "ignore");

    // Create anomaly-save interface
    chart_anomaly.append('select')
        .selectAll('option')
        .data(['Flap Slate', 'Path High', 'Speed High', 'Note'])
        .enter()
        .append('option')
            .text(d => d)
    chart_anomaly.append('textarea')
        .style('margin', '5px 0px')
        .style('border', '1px solid #222')
        // .style('width', '150px')
        .style('display', 'none')
    chart_anomaly.append('button')
        .text('Save as Anomaly')
        .node().onclick = (ev) => {
            if (!sel) return;
            let type = chart_anomaly.select('select').property('value');
            let text = type;
            if (type != 'Note') {
                settings.onAnomaly(sel, type);
            } else {
                text = chart_anomaly.select('textarea').property('value');
            }
            addBox({
                sel: sel,
                color: anomaly_colours.get(type),
                text: text
            })
            brush.move(brush_rect, null);
        }
        //.attr('data-html2canvas-ignore')
    chart_anomaly.append('button')
      .style('margin-top', '5px')
      .text('Save PNG of Graph')
      .node().onclick = (ev) => {
        let file_name = prompt("Please enter the name of the image.")
        if(file_name != null){
        //chart_anomaly.style.display = 'none';
        html2canvas(chart_div).then(function(canvas) {
        var ctx = canvas.getContext("2d");
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //var pos = chart_anomaly.getBoundingClientRect();
        //var top = pos.top;
        //var lef = pos.left;
        ctx.fillStyle = "white";
        ctx.fillRect(1243,600,200,300);
        //ctx.putImageData(imageData, 0, 0);
    // Export the canvas to its data URI representation
    //chart_anomaly.style.display = 'inline';
    var base64image = canvas.toDataURL("image/png");


    var link = document.createElement("a");
    link.download = file_name;
    link.href = base64image;
    link.click()

    //downloadURI(base64image);
  //  window.saveAs(base64image);
    });
  }

      }
      //.attr('data-html2canvas-ignore')

        chart_anomaly.select('select').on('change', (e) => {
            chart_anomaly.select('textarea').style('display', (e.target.value == 'Note') ? null : 'none')
        })

    chart_box_toggle
        .append('label')
            .text('Show Annotations')
            .append('input')
                .attr('type', 'checkbox')
                .property('checked', true)
                .on('change', (e) => {
                    box_g.style('display', e.target.checked ? null : 'none')
                })


    const width  = total_width - margin.left - margin.right;
    const height = total_height - margin.top - margin.bottom;

    // Create <svg> and <g>
    let total_svg = chart_content.append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    let svg = total_svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create Scales
    let xExtents = d3.transpose(data.map(trace => d3.extent(trace.X)))
    let xScale = d3.scaleLinear()
        .domain([d3.min(xExtents[0]), d3.max(xExtents[1])]).nice()
        .range(settings.reverse_x ? [width, 0] : [0, width]);
    let yExtents = d3.transpose(data.map(trace => d3.extent(trace.Y)))
    let yScale = d3.scaleLinear()
        .domain(d3.extent([d3.min(yExtents[0]), d3.max(yExtents[1])])).nice()
        .range([height, 0]);

    // Create Axes
    let yAxis = svg
        .append("g")
        .style('font-size', '14px')
        .call(d3.axisLeft().scale(yScale))
    let xAxis = svg
        .append("g")
        .style('font-size', '14px')
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom().scale(xScale))

    // Create clipping <rect>
    total_svg
        .append('defs')
        .append('svg:clipPath')
            .attr('id', `c${clip_counter}`)
        .append("svg:rect")
            // .attr('x', margin.left)
            // .attr('y', margin.top)
            .attr('x', 0)
            .attr('y', 0)
            .attr("width", width)
            .attr("height", height)


    // Create circles within clipped <g>
    let clip_g = svg.append("g").attr('clip-path', `url(#c${clip_counter++})`)
    let box_g = clip_g.append("g").style('opacity', 0.5)
    let circle_g = clip_g.append("g")
    circle_g
        .selectAll('g')
        .data(data)
        .join('g')
            .each(function (trace, i)  {
                chart_traces
                    .append('label')
                        .text(settings.trace_names[i] + '  ')
                        .style('color', settings.trace_colors[i])
                        .append('input')
                            .attr('type', 'checkbox')
                            .property('checked', true)
                            .on('change', (e) => {
                                 d3.select(this).style('display', e.target.checked ? null : 'none');
                            })
                chart_traces.append('br')
                d3.select(this)
                    .selectAll("circle")
                    .data(d3.zip(trace.X, trace.Y))
                    .join("circle")
                        // .call((s) => s.each(d => console.log(d)))
                        .attr("cx", d => xScale(d[0]))
                        .attr("cy", d => yScale(d[1]))
                        .attr("r", 3)
                        .attr("fill-opacity", 0.7)
                        .attr("fill", settings.trace_colors[i]);
            })



    // Draw borders
    svg
        .append("rect")
            .style("fill", "none")
            .style("stroke", "gray")
            .attr("width", width)
            .attr("height", height);

    let circle = circle_g.selectAll("circle");

    // Create selection brush and its callbacks
    let brush = d3.brush()
        .extent([[0,0],[width, height]])
        .on("start", brushStart)
        .on("brush", brushMove)
        .on("end", brushEnd);

    function brushStart() {

    }
    var zoom_t = d3.zoomIdentity;
    function brushMove({selection}) {
        if (selection) {
            [[x0, y0], [x1, y1]] = selection.map((xs) => zoom_t.invert(xs));
            // console.log(selection[0] + ', ' + selection[1], '\n' + [x0, y0] + ',' + [x1, y1]);
            circle.classed("hidden", d =>
                xScale(d[0]) < x0 ||
                xScale(d[0]) > x1 ||
                yScale(d[1]) < y0 ||
                yScale(d[1]) > y1
            );
        }
    }
    function brushEnd({selection}) {
        if (selection) {
            [[x0, y0], [x1, y1]] = selection;
            // data.filter(d =>
            //     xScale[i](d[i]) > x0 &&
            //     xScale[i](d[i]) < x1 &&
            //     yScale[j](d[j]) > y0 &&
            //     yScale[j](d[j]) < y1
            // );
            sel = [[rxScale.invert(x0),rxScale.invert(x1)],[ryScale.invert(y0),ryScale.invert(y1)]];
        }
        else {
            sel = null;
            circle.classed("hidden", false);
        }
    }

    // Create zoom/pan and its callback
    let zoom = d3.zoom()
        .on("zoom", zoomMove)

    let ryScale = yScale, rxScale = xScale
    let old_k = null;
    function zoomMove({transform: t}) {
        zoom_t = t;
        circle_g.attr('transform', t)
        box_g.attr('transform', t)
        box_g.selectAll('rect').style('stroke-width', 2 / t.k)
        box_g.selectAll('text').style('font-size', `${fontinfo.size / t.k}`)
        if (old_k != t.k) {
            circle.attr('r', 3 / t.k)
            old_k = t.k
        }

        ryScale = t.rescaleY(yScale)
        rxScale = t.rescaleX(xScale)
        yAxis.call(d3.axisLeft(ryScale));
        xAxis.call(d3.axisBottom(rxScale));

        xAxis.selectAll('.tick').each( function () {
            d3.select(this).select('line')
                .attr('y1', -height)
                .attr('opacity', (d3.select(this).select('text').text() == 0) ? 1 : 0.1)
        });
        yAxis.selectAll('.tick').each( function () {
            d3.select(this).select('line')
                .attr('x1', width)
                .attr('opacity', (d3.select(this).select('text').text() == 0) ? 1 : 0.1)
        });
    }

    // Overwrite double click to reset view instead of zoom in
    function onDblClick(e) {
        zoom_rect.call(zoom.transform, d3.zoomIdentity);
    }

    // Apply zoom to new <rect> for easy disabling
    let zoom_rect = total_svg
        .append('rect')
            .attr('id', 'zoom')
            .attr('x', margin.left)
            .attr('y', margin.top)
            .attr('width', width)
            .attr('height', height)
            .style('opacity', 0)
            .call(zoom)
            .on("dblclick.zoom", onDblClick)

    let brush_rect = svg.call(brush);

    // Add Menu Buttons and their callbacks
    let switchToZoom = () => {
        zoom_rect.attr('display', null);
        brush_rect.select('.overlay').attr('display', 'none');
        brush.move(svg, null);
    }
    let switchToBrush = () => {
        zoom_rect.attr('display', 'none');
        brush_rect.select('.overlay').attr('display', null);
    }

    const OptionButtonsInfo = [
        {img_src: "https://www.svgrepo.com/show/314941/zoom-icon.svg", callback: switchToZoom},
        {img_src: "https://www.svgrepo.com/show/114778/selection.svg", callback: switchToBrush}
    ]
    chart_options.selectAll('button')
        .data(OptionButtonsInfo)
        .enter()
        .append('button')
            .classed('chart-btn', true)
            .on('click', (_, d) => (d.callback)())
            // .attr('onclick', d => d.callback.name + '()')
            .append('img')
                .attr('src', d => d.img_src)

    // Click on first button
    chart_options.select('.chart-btn').node().click()


    // Add Labels
    let xLabel = svg.append("text")
        .style("opacity", `${fontinfo.opacity}%`)
        .style("font-size", `${fontinfo.size}`)
        .style('fill', 'black')
        .text(pars[0])
        .attr("transform", function () {return `translate(
                ${width / 2 - this.getComputedTextLength() / 2},
                ${height + margin.bottom - fontinfo.size}
            )`});

    let yLabel = svg.append("text")
        .style("opacity", `${fontinfo.opacity}%`)
        .style("font-size", `${fontinfo.size}`)
        .style('fill', 'black')
        .text(pars[1])
        .classed('ylabel', true)
        .attr("transform", function () {return `rotate(${-90}) translate(
                -${height / 2 + this.getComputedTextLength() / 2},
                -${margin.left - fontinfo.size}
            )`});

    // Extend tick marks to create grid
    xAxis.selectAll('.tick > line').each( function () {
        d3.select(this)
            .attr('y1', -height)
            .attr('opacity', 0.1)
    });
    yAxis.selectAll('.tick > line').each( function () {
        d3.select(this)
            .attr('x1', width)
            .attr('opacity', 0.1)
    });

    function addBox({ sel, color, text }) {
        sel[0] = sel[0].map((x) => rxScale(x)).map((x) => zoom_t.invertX(x))
        sel[1] = sel[1].map((y) => ryScale(y)).map((y) => zoom_t.invertY(y))
        let [[x0, x1], [y0, y1]] = sel;
        box_g.append('rect')
            .attr('width', x1 - x0)
            .attr('height', y1 - y0)
            .style('transform', `translate(${x0}px, ${y0}px)`)
            .style('fill', color)
            .style('fill-opacity', 0.2)
            .style('stroke', color)
            .style('stroke-width', '2px')
            .style('stroke-opacity', 0.5)
        box_g.append('text')
            .style("opacity", 0.7)
            .style("font-size", `${fontinfo.size}`)
            .style('fill', color)
            .style("transform", `translate(
                ${x0}px,
                ${y0 - fontinfo.size - 3}px
            )`)
            .text(text);
    }

    // Show Anomalies
    for (let box of settings.boxes) {
        addBox(box);
    }
}

function kernelDensityEstimator(kernel, X) {
    return function (V) {
        return X.map(function (x) {
            return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}









function multi1DChart(chart_div, data, pars, ids, total_width = 800, total_height = 800) {
    const fontinfo = {
        size: 18,
        opacity: 50,
        type: 'sans-serif'
    }
    const margin = {
        left: 100,
        bottom: 50,
        top: 10,
        right: 10
    };
    const width = total_width - margin.left - margin.right;
    const height = total_height - margin.top - margin.bottom;

    let data_pars = [];
    let data_pars_i = 0;
    pars.each(function(){
      data_pars[data_pars_i] = this.value;
      data_pars_i++;
    })
    console.log(data_pars.length)

    const y_pos = d3.range(0, data_pars.length).map(i => (height / (data_pars.length + 1)) * (i + 1))

    // Create html divs
    //let chart_grid = d3.select(chart_div).classed('ChartGrid', true)
    let chart_grid = d3.select(chart_div).classed('ChartGrid', true)
    let chart_content = chart_grid.append('div').classed('ChartContents', true)
    let chart_sidebar = chart_grid.append('div').classed('ChartSidebar', true)
    let chart_options = chart_sidebar.append('div').classed('ChartOptions', true)

    // Create anomaly-save interface
    // chart_options.selectAll('button')
    //     .join(['avg'])

    // Create <svg> and <g>
    let total_svg = chart_content.append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    let svg = total_svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    let xScales = data.map(d =>
        d3.scaleLinear()
            .domain(d3.extent(d)).nice()
            .range([0, width])
        );
    let bins = data.map((d, i) =>
        d3.bin()
            .domain(xScales[i].domain())
            .thresholds(xScales[i].ticks(50))
            (d)
    );
    let hScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, -100])

    svg
        .append("rect")
        .style("fill", "none")
        .style("stroke", "gray")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll('g')
        .data(y_pos)
        .join('g')
            .style('font-size', '14px')
            .attr("transform", y => `translate(0, ${y})`)
            .each(function (_, i) {
                d3.select(this).call(d3.axisBottom().scale(xScales[i]))
            })

    function debug(val) {
        console.log(val)
        return val;
    }

    let sub_plots = svg.append('g')
        .selectAll('g')
        .data(data)
        .join('g')
        .style('transform', (_, i) => `translateY(${y_pos[i]}px)`)
        .each(function (ds, i) { // ds: number[], i: number
            // d3.select(this)

            // let density = kde(ds);
            // density.push([xScales[i].domain()[1], 0], [xScales[i].domain()[0], 0]);

            d3.select(this)
                // .selectAll('rect')
                // .data(bins[i])
                // .join('rect')
                //     .attr("x", 1)
                //     .style('opacity', 0.3)
                //     .attr("transform", b => `translate(${xScales[i](b.x0)}, ${hScale(b.length)})`)
                //     .attr("width", b => (n => n < 0 ? 0 : n)(xScales[i](b.x1) - xScales[i](b.x0) - 1))
                //     .attr("height", b => -hScale(b.length))
                //     .style("fill", "steelblue");
                .append('path')
                    .datum(bins[i])
                    .style('stroke', 'steelblue')
                    .style('stroke-opacity', 0.6)
                    .style('stroke-width', 1)
                    .style('fill', 'steelblue')
                    .style('fill-opacity', 0.2)
                    .attr('d', debug(d3.line()
                        .curve(d3.curveBasis)
                        // REDUCE VALUES BY (-) TO GET DISRETE DERIVATIVE AND PLOT IN THE STEAD OF DENSITY
                            .x(b => xScales[i](b.x0))
                            .y(b => hScale(b.length / bins[i].length)
                                // d3.scaleLinear()
                                //     .domain([0, d3.max(density, d => d[1])])
                                //     .range([0, -100])
                                //     (d[1])
                            )
                    ))

            d3.select(this)
                .selectAll('circle')
                .data(ds.map(d => [xScales[i](d), y_pos[i]]))
                .join('circle')
                    .attr('r', 5)
                    .attr('cx', ([d, _]) => d)
                    .attr('cy', function(d){return height;})
                    .style('fill', 'steelblue')
                    // .style('transform', `scaleX(${1/3})`)
        })
            // .attr('x1', 0)
            // .attr('x2', width)
            // .style('stroke', 'gray')
            // .style('stroke-width', 2)

    let QT = d3.quadtree()
        .x(d => d[0])
        .y(d => d[1])
        .addAll(d3.transpose([...data, ids]))

    let select_circle = total_svg.append('circle').style('fill', 'red');

    total_svg.on('mousemove', (e) => {
        //console.log([e.x, e.y])
        select_circle.attr('cx', e.clientX).attr('cy', e.clientY)
        let found = QT.find(e.x, e.y, 20)
        if (found) {
            console.log(found);
        }
    })

  //console.log(pars._groups)


    let xLabel = svg.append('g')
        .selectAll('text')
        .data(data_pars)
        .join('text')
            .style("opacity", `${fontinfo.opacity}%`)
            .style("font-size", `${fontinfo.size}`)
            .style('fill', 'black')
            .text(d => d)
            .attr("transform", function (_,i) {
                return `translate(
                    ${width / 2 - this.getComputedTextLength() / 2},
                    ${y_pos[i] + 30 + fontinfo.size}
                )`});

    let yLabel = svg.append('text')
        .style("opacity", `${fontinfo.opacity}%`)
        .style("font-size", `${fontinfo.size}`)
        .style('fill', 'black')
        .text('AVG')
        .attr("transform", function () {
            return `translate(
                    ${width / 2 - this.getComputedTextLength() / 2},
                    ${height + margin.bottom - fontinfo.size}
                )`});

}







function One_D_Chart(chart_div, data, pars, user_settings){

      console.log(data);
      var settings = {};
      Object.assign(settings, default_settings);
      Object.assign(settings, user_settings);
      console.log(settings);
      const total_height = settings.height;
      const total_width = settings.width;
      const fontinfo = {
          size: 18,
          opacity: 50,
          type: 'sans-serif'
      }
      const margin = {
          left: 100,
          bottom: 80,
          top: 10,
          right: 10
      };
      sel = null;

      // Create html divs
      let chart_grid = d3.select(chart_div).classed('ChartGrid', true)
      let chart_content = chart_grid.append('div').classed('ChartContents', true)
      let chart_sidebar = chart_grid.append('div').classed('ChartSidebar', true)
      let chart_options = chart_sidebar.append('div').classed('ChartOptions', true)
      let chart_box_toggle = chart_sidebar.append('div').classed('ChartBoxToggle', true)
      let chart_traces  = chart_sidebar.append('div')
      let chart_anomaly = chart_sidebar.append('div').classed('ChartAnomaly', true)

      // Create anomaly-save interface
      chart_anomaly.append('select')
          .selectAll('option')
          .data(['Flap Slate', 'Path High', 'Speed High', 'Note'])
          .enter()
          .append('option')
              .text(d => d)
      chart_anomaly.append('textarea')
          .style('margin', '5px 0px')
          .style('border', '1px solid #222')
          // .style('width', '150px')
          .style('display', 'none')
      chart_anomaly.append('button')
          .text('Save as Anomaly')
          .node().onclick = (ev) => {
              if (!sel) return;
              let type = chart_anomaly.select('select').property('value');
              let text = type;
              if (type != 'Note') {
                  settings.onAnomaly(sel, type);
              } else {
                  text = chart_anomaly.select('textarea').property('value');
              }
              addBox({
                  sel: sel,
                  color: anomaly_colours.get(type),
                  text: text
              })
              brush.move(brush_rect, null);
          }
      chart_anomaly.append('button')
        .style('margin-top', '5px')
        .text('Save PNG of Graph')
        .node().onclick = (ev) => {
          let file_name = prompt("Please enter the name of the image.")
          if(file_name != null){
          html2canvas(chart_div).then(function(canvas) {
      // Export the canvas to its data URI representation
      var base64image = canvas.toDataURL("image/png");


      var link = document.createElement("a");
      link.download = file_name;
      link.href = base64image;
      link.click()

      //downloadURI(base64image);
    //  window.saveAs(base64image);
      });
    }
        }

          chart_anomaly.select('select').on('change', (e) => {
              chart_anomaly.select('textarea').style('display', (e.target.value == 'Note') ? null : 'none')
          })

      chart_box_toggle
          .append('label')
              .text('Show Annotations')
              .append('input')
                  .attr('type', 'checkbox')
                  .property('checked', true)
                  .on('change', (e) => {
                      box_g.style('display', e.target.checked ? null : 'none')
                  })


      const width  = total_width - margin.left - margin.right;
      const height = total_height - margin.top - margin.bottom;

      // Create <svg> and <g>
      let total_svg = chart_content.append('svg')
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      let svg = total_svg
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`)

      // Create Scales
      let xExtents = d3.transpose(data.map(trace => d3.extent(trace.X)))
      let xScale = d3.scaleLinear()
          .domain([d3.min(xExtents[0]), d3.max(xExtents[1])]).nice()
          .range(settings.reverse_x ? [width, 0] : [0, width]);
      let yExtents = d3.transpose(data.map(trace => d3.extent(trace.Y)))
      let yScale = d3.scaleLinear()
          .domain(d3.extent([d3.min(yExtents[0]), d3.max(yExtents[1])])).nice()
          .range([height, 0]);

      // Create Axes
      let yAxis = svg
          .append("g")
          .style('font-size', '14px')
          .call(d3.axisLeft().scale(yScale))
      let xAxis = svg
          .append("g")
          .style('font-size', '14px')
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom().scale(xScale))

      // Create clipping <rect>
      total_svg
          .append('defs')
          .append('svg:clipPath')
              .attr('id', `c${clip_counter}`)
          .append("svg:rect")
              // .attr('x', margin.left)
              // .attr('y', margin.top)
              .attr('x', 0)
              .attr('y', 0)
              .attr("width", width)
              .attr("height", height)


      // Create circles within clipped <g>
      let clip_g = svg.append("g").attr('clip-path', `url(#c${clip_counter++})`)
      let box_g = clip_g.append("g").style('opacity', 0.5)
      let circle_g = clip_g.append("g")
      circle_g
          .selectAll('g')
          .data(data)
          .join('g')
              .each(function (trace, i)  {
                  chart_traces
                      .append('label')
                          .text(settings.trace_names[i] + '  ')
                          .style('color', settings.trace_colors[i])
                          .append('input')
                              .attr('type', 'checkbox')
                              .property('checked', true)
                              .on('change', (e) => {
                                   d3.select(this).style('display', e.target.checked ? null : 'none');
                              })
                  chart_traces.append('br')
                  d3.select(this)
                      .selectAll("circle")
                      .data(d3.zip(trace.X, trace.Y))
                      .join("circle")
                          // .call((s) => s.each(d => console.log(d)))
                          .attr("cx", d => xScale(d[0]))
                          .attr("cy", d => yScale(d[1]))
                          .attr("r", 3)
                          .attr("fill-opacity", 0.7)
                          .attr("fill", settings.trace_colors[i]);
              })



      // Draw borders
      svg
          .append("rect")
              .style("fill", "none")
              .style("stroke", "gray")
              .attr("width", width)
              .attr("height", height);

      let circle = circle_g.selectAll("circle");

      // Create selection brush and its callbacks
      let brush = d3.brush()
          .extent([[0,0],[width, height]])
          .on("start", brushStart)
          .on("brush", brushMove)
          .on("end", brushEnd);

      function brushStart() {

      }
      var zoom_t = d3.zoomIdentity;
      function brushMove({selection}) {
          if (selection) {
              [[x0, y0], [x1, y1]] = selection.map((xs) => zoom_t.invert(xs));
              // console.log(selection[0] + ', ' + selection[1], '\n' + [x0, y0] + ',' + [x1, y1]);
              circle.classed("hidden", d =>
                  xScale(d[0]) < x0 ||
                  xScale(d[0]) > x1 ||
                  yScale(d[1]) < y0 ||
                  yScale(d[1]) > y1
              );
          }
      }
      function brushEnd({selection}) {
          if (selection) {
              [[x0, y0], [x1, y1]] = selection;
              // data.filter(d =>
              //     xScale[i](d[i]) > x0 &&
              //     xScale[i](d[i]) < x1 &&
              //     yScale[j](d[j]) > y0 &&
              //     yScale[j](d[j]) < y1
              // );
              sel = [[rxScale.invert(x0),rxScale.invert(x1)],[ryScale.invert(y0),ryScale.invert(y1)]];
          }
          else {
              sel = null;
              circle.classed("hidden", false);
          }
      }

      // Create zoom/pan and its callback
      let zoom = d3.zoom()
          .on("zoom", zoomMove)

      let ryScale = yScale, rxScale = xScale
      let old_k = null;
      function zoomMove({transform: t}) {
          zoom_t = t;
          circle_g.attr('transform', t)
          box_g.attr('transform', t)
          box_g.selectAll('rect').style('stroke-width', 2 / t.k)
          box_g.selectAll('text').style('font-size', `${fontinfo.size / t.k}`)
          if (old_k != t.k) {
              circle.attr('r', 3 / t.k)
              old_k = t.k
          }

          ryScale = t.rescaleY(yScale)
          rxScale = t.rescaleX(xScale)
          yAxis.call(d3.axisLeft(ryScale));
          xAxis.call(d3.axisBottom(rxScale));

          xAxis.selectAll('.tick').each( function () {
              d3.select(this).select('line')
                  .attr('y1', -height)
                  .attr('opacity', (d3.select(this).select('text').text() == 0) ? 1 : 0.1)
          });
          yAxis.selectAll('.tick').each( function () {
              d3.select(this).select('line')
                  .attr('x1', width)
                  .attr('opacity', (d3.select(this).select('text').text() == 0) ? 1 : 0.1)
          });
      }

      // Overwrite double click to reset view instead of zoom in
      function onDblClick(e) {
          zoom_rect.call(zoom.transform, d3.zoomIdentity);
      }

      // Apply zoom to new <rect> for easy disabling
      let zoom_rect = total_svg
          .append('rect')
              .attr('id', 'zoom')
              .attr('x', margin.left)
              .attr('y', margin.top)
              .attr('width', width)
              .attr('height', height)
              .style('opacity', 0)
              .call(zoom)
              .on("dblclick.zoom", onDblClick)

      let brush_rect = svg.call(brush);

      // Add Menu Buttons and their callbacks
      let switchToZoom = () => {
          zoom_rect.attr('display', null);
          brush_rect.select('.overlay').attr('display', 'none');
          brush.move(svg, null);
      }
      let switchToBrush = () => {
          zoom_rect.attr('display', 'none');
          brush_rect.select('.overlay').attr('display', null);
      }

      const OptionButtonsInfo = [
          {img_src: "https://www.svgrepo.com/show/314941/zoom-icon.svg", callback: switchToZoom},
          {img_src: "https://www.svgrepo.com/show/114778/selection.svg", callback: switchToBrush}
      ]
      chart_options.selectAll('button')
          .data(OptionButtonsInfo)
          .enter()
          .append('button')
              .classed('chart-btn', true)
              .on('click', (_, d) => (d.callback)())
              // .attr('onclick', d => d.callback.name + '()')
              .append('img')
                  .attr('src', d => d.img_src)

      // Click on first button
      chart_options.select('.chart-btn').node().click()


      // Add Labels
      let xLabel = svg.append("text")
          .style("opacity", `${fontinfo.opacity}%`)
          .style("font-size", `${fontinfo.size}`)
          .style('fill', 'black')
          .text(pars[0])
          .attr("transform", function () {return `translate(
                  ${width / 2 - this.getComputedTextLength() / 2},
                  ${height + margin.bottom - fontinfo.size}
              )`});

      let yLabel = svg.append("text")
          .style("opacity", `${fontinfo.opacity}%`)
          .style("font-size", `${fontinfo.size}`)
          .style('fill', 'black')
          .text(pars[1])
          .classed('ylabel', true)
          .attr("transform", function () {return `rotate(${-90}) translate(
                  -${height / 2 + this.getComputedTextLength() / 2},
                  -${margin.left - fontinfo.size}
              )`});

      // Extend tick marks to create grid
      xAxis.selectAll('.tick > line').each( function () {
          d3.select(this)
              .attr('y1', -height)
              .attr('opacity', 0.1)
      });
      yAxis.selectAll('.tick > line').each( function () {
          d3.select(this)
              .attr('x1', width)
              .attr('opacity', 0.1)
      });

      function addBox({ sel, color, text }) {
          sel[0] = sel[0].map((x) => rxScale(x)).map((x) => zoom_t.invertX(x))
          sel[1] = sel[1].map((y) => ryScale(y)).map((y) => zoom_t.invertY(y))
          let [[x0, x1], [y0, y1]] = sel;
          box_g.append('rect')
              .attr('width', x1 - x0)
              .attr('height', y1 - y0)
              .style('transform', `translate(${x0}px, ${y0}px)`)
              .style('fill', color)
              .style('fill-opacity', 0.2)
              .style('stroke', color)
              .style('stroke-width', '2px')
              .style('stroke-opacity', 0.5)
          box_g.append('text')
              .style("opacity", 0.7)
              .style("font-size", `${fontinfo.size}`)
              .style('fill', color)
              .style("transform", `translate(
                  ${x0}px,
                  ${y0 - fontinfo.size - 3}px
              )`)
              .text(text);
      }

      // Show Anomalies
      for (let box of settings.boxes) {
          addBox(box);
      }
}
