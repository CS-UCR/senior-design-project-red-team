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

function remove_children(p){
  while(p.firstChild){
    p.removeChild(p.firstChild);
  }
}
function goto4() {
    refresh_chart = () =>  p_refresh_chart();
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById("DISPLAY_SATSTICS").hidden = true;
    document.getElementById("DISPLAY_SATSTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_SATSTICS_NORMAL_NEW_TAB").hidden = true;
    document.getElementById('Refresh').hidden = false;
    document.getElementById('refresh').hidden = false;


    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #00ff00";
      document.getElementById('STAT').style.border = "1px solid #000000";

}

 function p_refresh_chart() {

    if(tab_count === 0){
      p_refresh_chart_tab();
    }else{

      if(cur_chart){
      remove_children(cur_chart);
      }

      var flight = document.getElementById('file-select').value
      var parameters = GetCheckedParameters();

    load_chart(parameters,flight,cur_chart);

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

    chart.id = "chart" + count;
    tab.id = "tab" + count;
    text.innerHTML = "Tab " + count;
    delete_button.innerHTML = 'X';
    delete_button.onclick = () => {delete_tab(tab.id, chart)};
    text.onclick = () => {display(chart,tab)};


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
    display(chart,tab);

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
    d3.json(`http://127.0.0.1:8080/truncated/${flightno}`)
        .then(json => {
            return pars.map(par => json[par]);
        })
        .then(D => {
            console.log(D);
            pairwiseChart(div_name, D, pars);
        });
};

function pairwiseChart(chartname, data, pars, total_width  = 800, total_height = 800, sep = 10) {
    data = d3.transpose(data);
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
        num: data[0].length,
        sep: sep,
        width: undefined,
        height: undefined
    }
    subplot.width = (width - subplot.sep * (subplot.num - 1)) / subplot.num;
    subplot.height = (height - subplot.sep * (subplot.num - 1)) / subplot.num;

    console.log(subplot);

    let svg = d3.select(chartname)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    for (let i = 0; i < subplot.num; i++) {
        let x = i * (subplot.sep + subplot.width);
        for (let j = 0; j < subplot.num; j++) {
            let y = j * (subplot.sep + subplot.height);


            if (i == 0) { // left

            }
            let xScale = d3.scaleLinear()
                .domain(d3.extent(data, d => d[i])).nice()
                .range([x, x + subplot.width]);

            if (i == j) {
                let bin = d3.bin()
                    .value(d => d[i])
                    .domain(xScale.domain())
                    .thresholds(xScale.ticks(10));
                let bins = bin(data);

                let hScale = d3.scaleLinear()
                    .domain([0, d3.max(bins, b => b.length)])
                    .range([subplot.height, 0]);

                svg.append("g")
                    .selectAll("rect")
                    .data(bins)
                    .join("rect")
                        .attr("x", x + 1)
                        .attr("y", y)
                        .attr("transform", b => `translate(${xScale(b.x0) - x}, ${hScale(b.length)})`)
                        .attr("width", b => xScale(b.x1) - xScale(b.x0) - 1)
                        .attr("height", b => subplot.height - hScale(b.length))
                        .style("fill", "steelblue")

            } else {
                // if (j == subplot.num - 1) {
                //     svg.append("g")
                //         .attr("transform", `translate(0, ${height})`)
                //         .call(d3.axisBottom(xScale));
                // }
                let yScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[j])).nice()
                    .range([y + subplot.height, y]);
                // if (i == 0) {
                //     svg.append("g")
                //         .call(d3.axisLeft(yScale));
                // }

                // svg.append("path")
                //     .datum(data)
                //     .attr("fill", "none")
                //     .attr("stroke", "steelblue")
                //     .attr("stroke-width", "3")
                //     .attr("d", d3.line()
                //         .x(d => xScale(d[i]))
                //         .y(d => yScale(d[j]))
                //     );

                svg.append("g")
                    .selectAll("dot")
                    .data(data)
                    .join("circle")
                        .attr("cx", d => xScale(d[i]))
                        .attr("cy", d => yScale(d[j]))
                        .attr("r", 1.5)
                        .style("stroke", "steelblue")
                        .style("fill", "steelblue");

            }

            let sub_g = svg.append("g")
                .attr("transform", `translate(${x}, ${y})`)
            sub_g.append("path")
                .style("fill", "none")
                .style("stroke-width", `${2}`)
                .style("stroke", "gray")
                .attr("d", `M 0, 0 h ${subplot.width} v ${subplot.height} h ${-subplot.width} v ${-subplot.height} Z`);

            if (j == subplot.num - 1) { // bottom
                let xLabel = sub_g.append("text")
                    .style("opacity", `${fontinfo.opacity}%`)
                    .style("font-size", `${fontinfo.size}`)
                    .text(`${pars[i]}`);
                xLabel
                    .attr("transform",
                            `translate(
                                ${subplot.width / 2 - xLabel.node().getComputedTextLength() / 2},
                                ${subplot.height + margin.bottom - fontinfo.size}
                            )`);
            }
            if (i == 0) {
                let yLabel = sub_g.append("text")
                    .style("opacity", `${fontinfo.opacity}%`)
                    .style("font-size", `${fontinfo.size}`)
                    .text(`${pars[j]}`);
                yLabel
                    .attr("transform",
                          `rotate(${-90})
                           translate(
                               -${subplot.height / 2 + yLabel.node().getComputedTextLength() / 2},
                               -${margin.left - fontinfo.size}
                           )`);
            }
        }
    }

    // let xScale = d3.scaleLinear()
    //     .domain(d3.extent(data, d => d.X))
    //     .range([width, 0]);
    // svg.append("g")
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(d3.axisBottom(xScale));
    // let xLabel = svg.append("text")
    //     .style("opacity", `${fontinfo.opacity}%`)
    //     .style("font-size", `${fontinfo.size}`)
    //     .text("THIS IS AN XAXIS LABEL WOOOO");
    // xLabel
    //     .attr("transform",
    //           `translate(
    //               ${width / 2 - xLabel.node().getComputedTextLength() / 2},
    //               ${height + margin.bottom - fontinfo.size}
    //           )`);

    // let yScale = d3.scaleLinear()
    //     .domain(d3.extent(data, d => d.Y1))
    //     .range([height, 0]);
    // svg.append("g")
    //     .call(d3.axisLeft(yScale));
    // let yLabel = svg.append("text")
    //     .style("opacity", `${fontinfo.opacity}%`)
    //     .style("font-size", `${fontinfo.size}`)
    //     .text("THIS IS A YAXIS LABEL WOOOO");
    // yLabel
    //     .attr("transform",
    //           `rotate(${-90})
    //            translate(
    //                -${height / 2 + yLabel.node().getComputedTextLength() / 2},
    //                -${margin.left - fontinfo.size}
    //            )`);

    // svg.append("path")
    //     .datum(data)
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", "3")
    //     .attr("d", d3.line()
    //         .x(d => xScale(d.X))
    //         .y(d => yScale(d.Y))
    //         )

    // svg.append("g")
    //     .selectAll("dot")
    //     .data(data)
    //     .join("circle")
    //         .attr("cx", d => xScale(d.X))
    //         .attr("cy", d => yScale(d.Y))
    //         .attr("r", 2)
    //         .style("stroke", "steelblue")
    //         .style("fill", "white")
}
