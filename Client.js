const hostname = '127.0.0.1'
const port = '8080'

// const flight_parameters = ['AILERON POSITION LH', 'AILERON POSITION RH', 'CORRECTED ANGLE OF ATTACK', 'BARO CORRECT ALTITUDE LSP', 'BARO CORRECT ALTITUDE LSP', 'COMPUTED AIRSPEED LSP', 'SELECTED COURSE', 'DRIFT ANGLE', 'ELEVATOR POSITION LEFT', 'ELEVATOR POSITION RIGHT', 'T.E.FLAP POSITION', 'GLIDESLOPE DEVIATION', 'SELECTED HEADING', 'SELECTED AIRSPEED', 'LOCALIZER DEVIATION', 'N1 COMMAND LSP', 'TOTAL PRESSURE LSP', 'PITCH ANGLE LSP', 'ROLL ANGLE LSP', 'RUDDER POSITION', 'TRUE HEADING LSP', 'VERTICAL ACCELERATION', 'WIND SPEED', 'AP FD STATUS', 'GEARS L & R DOWN LOCKED', 'TCAS LSP', 'WEIGHT ON WHEELS']

var layout = {
  xaxis: {
    title: {
      text: "Type1"
    },
    titlefont: {
      family: 'Arial, sans-serif',
      size: 18,
      color: 'lightgrey'
    },
  },
  yaxis: {
    title: {
      text: "Type2"
    },
    titlefont: {
      family: 'Arial, sans-serif',
      size: 18,
      color: 'lightgrey'
    },
  },
  width: 1400,
  height: 800,
};



function init() {
    fetch("http://" + hostname + ":" + port + "/" + ['flights'].join('/'))
        .then(response => response.json())
        .then(obj => {
            d3.select('#file-select')
              .selectAll('option')
              .data(obj)
              .enter()
              .append('option')
                .text(d => d)
        })
        .catch(err => console.error(err));
    fetch("http://" + hostname + ":" + port + "/" + ['parameters'].join('/'))
        .then(response => response.json())
        .then(flight_parameters => {
            var par1 = d3.select('#parameter-1')
            var par2 = d3.select('#parameter-2')
            var ts_pars = d3.select('#time_series_options')

            for (let par of [par1, par2]) {
              par.selectAll('option')
                .data(flight_parameters)
                .enter()
                .append('option')
                  .text(d => d)
            }

            let ts_divs = ts_pars.selectAll('div')
              .data(flight_parameters.slice(1))
              .enter()
              .append('div')
            ts_divs.append('input')
                .attr('type', 'checkbox')
                .attr('id', d => d)
                .attr('name', 'time_series_option')
                .attr('value', d => d)
            ts_divs.append('label')
              .attr('for', d => d)
              .text(d => d)
        })
        .catch(err => console.error(err));
}

function goto1() {
    refresh_chart = two_parameter_chart;
    type_of_graph = "tw";
    document.getElementById('parameter-2').disabled = false;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = false;
    document.getElementById('parameter-1').hidden = false;
    document.getElementById('time_series_select').hidden = true;
    document.getElementById('time_series_options').hidden = true;
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById("DISPLAY_STATISTICS").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL_NEW_TAB").hidden = true;
    document.getElementById('Refresh').hidden = false;
    document.getElementById('refresh').hidden = false;
    document.getElementById('ptile-opts').hidden = true;
    document.getElementById('TIME_SERIES_TO_DTR').hidden = true;


    document.getElementById('TPC').style.border = "1px solid #00ff00";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";
}
function goto2() {
    refresh_chart = () => dtr_chart(false);
    type_of_graph = "dt";
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;
    document.getElementById('time_series_options').hidden = true;
    document.getElementById("dtr-specific").hidden = false;
    document.getElementById("DISPLAY_STATISTICS").hidden = false;
    document.getElementById("DISPLAY_STATISTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL_NEW_TAB").hidden = true;
    document.getElementById('Refresh').hidden = false;
    document.getElementById('refresh').hidden = false;
    document.getElementById('ptile-opts').hidden = true;
    document.getElementById('TIME_SERIES_TO_DTR').hidden = true;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #00ff00";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";
}
function goto3() {
    refresh_chart = () => time_series(true);
    type_of_graph = "ts";
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById("DISPLAY_STATISTICS").hidden = false;
    document.getElementById("DISPLAY_STATISTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL_NEW_TAB").hidden = true;
    document.getElementById('Refresh').hidden = false;
    document.getElementById('refresh').hidden = false;
    document.getElementById('ptile-opts').hidden = true;
    document.getElementById('TIME_SERIES_TO_DTR').hidden = false;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #00ff00";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";

}

function goto4() {
    refresh_chart = () =>  p_refresh_chart();
    type_of_graph = "pw";
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById('ptile-opts').hidden = true;
    document.getElementById('TIME_SERIES_TO_DTR') = false;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #00ff00";
    document.getElementById('STAT').style.border = "1px solid #000000";

}

var refresh_chart = two_parameter_chart;
var tab_count = 0;
var cur_chart;
var cur_tab;
var first_tab;
var dtr_current_selected_chart = undefined;
var selected_chart_for_point_selection = undefined;
var data_to_be_selected;
var type_of_graph;
var cur_text;

function remove_children(p){
  while(p.firstChild){
    console.log("Here");
    //console.log(p.firstChild.ChartContents.svg.g.text)
    p.removeChild(p.firstChild);
  }

}
function two_parameter_chart() {
  console.log("Here");
    if(tab_count === 0){
      refresh_chart_tab();
      return;
    }
    if(cur_chart){
    remove_children(cur_chart);
  }
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var par2 = document.getElementById('parameter-2').value
    let orig = cur_text;
    let hold = cur_text.substring(0, 2);
    document.getElementById(cur_text).id = orig.replace(hold , "tw");
    cur_text = orig.replace(hold , "tw");
    if(par1 === "" || par2 === ""){
      return;
    }
    layout.xaxis.title.text = par1;
    fetch("http://" + hostname + ":" + port + "/" + ['two-parameter', flight, par1, par2].join('/'))
        .then(response => response.json())
        .then(data => {

          on_anomaly = (sel, type , note) => {
              let a = {
                  x: sel[0],
                  y: sel[1],
                  flight: flight,
                  x_par: par1,
                  y_par: par2,
                  type: type,
                  Graph_Type: "Two Parameter Chart",
                  Note: note
              }
              console.log(a);
              Anomaly_Upload(a);
          }

          const settings = {
              width: 1200,
              onAnomaly: on_anomaly,
              trace_names: [flight]
            }
            twoParameterChart(d3.select(cur_chart).append('div').node(), [{X: data.x, Y: data.y}], [par1, par2], settings)
            // if (par1 == par2) {
            //     plot_data = {
            //         x: data.x,
            //         y: data.y,
            //         type: 'histogram'
            //     };
            // } else {
            //     plot_data = {
            //         x: data.x,
            //         y: data.y,
            //         mode: 'markers',
            //         type: 'scatter'
            //     };
            //     layout.yaxis.title.text = par2;
            // }
            // //console.log(data);
            // var chart = cur_chart;
            // chart.id = flight;
            // Plotly.newPlot(chart, [plot_data], layout)
            // //selectDisplay(chart);

            // chart.on('plotly_selected' , function(eventData){
            //   selected_chart_for_point_selection = chart;
            //   data_to_be_selected = eventData;
            //   Log_Display();
            // });

        })
        .catch(err => console.error(err))
}

function dtr_chart(val) {
    document.getElementById('time_series_options').hidden = true;
    document.getElementById('ptile-opts').hidden = true;
    if (tab_count === 0) {
        refresh_chart_tab();
        return;
    }
    const chart = cur_chart;
    var time_dtr_values;
    if(val != false){
    time_dtr_values = chart.querySelectorAll("#\\36 77200105090350 > div.ChartContents > svg > g > text:nth-child(16)")
    time_dtr_values.forEach((element) =>{
      console.log(element.innerHTML)
    });
  }

    if (chart) {
        remove_children(chart);
    }
    let orig = cur_text;
    let hold = cur_text.substring(0, 2);
    document.getElementById(cur_text).id = orig.replace(hold , "dt");
    cur_text = orig.replace(hold , "dt");
    var flight = d3.select('#file-select').property('value');
    const checkboxes = d3.selectAll('input[name="time_series_option"]:checked');


    let checked_ptiles = d3.selectAll('.ptile-opt:checked').nodes().map(node => node.value);
    console.log(checked_ptiles)
    const ptile_colors = {
        '10': 'green',
        '50': 'orange',
        '90': 'red'
    }
    if(val === false){
    checkboxes.each( async function () {
        let new_chart = d3.select(chart).append('div').node();
        new_chart.classList.add('w-fit', 'h-[800px]');

        let data = await fetch("http://" + hostname + ":" + port + "/" + ['dtr', flight, this.value, ...checked_ptiles].join('/'))
            .then(response => response.json())
            .catch(err => console.error(err));

        console.log(data);
        if (!data.percentiles.ys) data.percentiles.ys = {}

        on_anomaly = (sel, type , note) => {
            let a = {
                x: sel[0],
                y: sel[1],
                flight: flight,
                x_par: 'Distance From Landing (Miles)',
                y_par: this.value,
                type: type,
                Graph_Type: "DTR Chart",
                Note: note
            }
            console.log(a);
            Anomaly_Upload(a);
        }
        const settings = {
            width: 1200,
            onAnomaly: on_anomaly,
            // show_anomalies: true,
            reverse_x: true,
            trace_names: [flight, ...Object.keys(data.percentiles.ys).map(s => s + 'th Percentile')],
            trace_colors: ['steelblue', ...Object.keys(data.percentiles.ys).map(x => ptile_colors[x])]
        }

        twoParameterChart(
            new_chart, // div
            [{X: data.main.x, Y: data.main.y}, Object.values(data.percentiles?.ys).map(y => ({X: data.percentiles.x, Y: y}))].flat(), // traces
            ["DISTANCE FROM LANDING (MILES)", this.value], // X & Y labels
            settings
        )
    });
  }else{
    time_dtr_values.forEach( async (element) =>{
      let new_chart = d3.select(chart).append('div').node();
      new_chart.classList.add('w-fit', 'h-[800px]');

      let data = await fetch("http://" + hostname + ":" + port + "/" + ['dtr', flight, element.innerHTML, ...checked_ptiles].join('/'))
          .then(response => response.json())
          .catch(err => console.error(err));

      console.log(data);
      if (!data.percentiles.ys) data.percentiles.ys = {}

      on_anomaly = (sel, type , note) => {
          let a = {
              x: sel[0],
              y: sel[1],
              flight: flight,
              x_par: 'Distance From Landing (Miles)',
              y_par: element.innerHTML,
              type: type,
              Graph_Type: "DTR Chart",
              Note: note
          }
          console.log(a);
          Anomaly_Upload(a);
      }
      const settings = {
          width: 1200,
          onAnomaly: on_anomaly,
          // show_anomalies: true,
          reverse_x: true,
          trace_names: [flight, ...Object.keys(data.percentiles.ys).map(s => s + 'th Percentile')],
          trace_colors: ['steelblue', ...Object.keys(data.percentiles.ys).map(x => ptile_colors[x])]
      }

      twoParameterChart(
          new_chart, // div
          [{X: data.main.x, Y: data.main.y}, Object.values(data.percentiles?.ys).map(y => ({X: data.percentiles.x, Y: y}))].flat(), // traces
          ["DISTANCE FROM LANDING (MILES)", element.innerHTML], // X & Y labels
          settings
      )
    });
    goto2();
  }
    let checks = document.querySelectorAll('input[name="time_series_option"]:checked');
    for(var i = 0; i < checks.length; i++){
      checks[i].checked = false;
    }

    checks = document.querySelectorAll('.ptile-opt:checked');
    for(var i = 0; i < checks.length; i++){
      checks[i].checked = false;
    }
}

function time_series(refresh) {
    document.getElementById('time_series_options').hidden = true;
    if (tab_count === 0) {
        refresh_chart_tab();
        return;
    }
    const chart = cur_chart;
    if (chart) {
        remove_children(chart);
    }
    let orig = cur_text;
    let hold = cur_text.substring(0, 2);
    document.getElementById(cur_text).id = orig.replace(hold , "ts");
    cur_text = orig.replace(hold , "ts");
    var flight = d3.select('#file-select').property('value');
    const checkboxes = d3.selectAll('input[name="time_series_option"]:checked');

    checkboxes.each( async function () {
        let new_chart = d3.select(chart).append('div').node();
        let data = await fetch("http://" + hostname + ":" + port + "/" + ['time-series', flight, this.value].join('/'))
            .then(response => response.json())
            .catch(err => console.error(err))

        new_chart.id = flight;
        on_anomaly = (sel, type , note) => {
            let a = {
                x: sel[0],
                y: sel[1],
                flight: flight,
                x_par: 'Time',
                y_par: this.value,
                type: type,
                Graph_Type: "Time Series Chart",
                Note: note
            }
            console.log(a);
            Anomaly_Upload(a);
        }
        const settings = {
          width: 1200,
          onAnomaly: on_anomaly,
          trace_names: [flight]
        //   show_anomalies: true
        }

        twoParameterChart(
            new_chart,
            [{X: data.x, Y: data.y}],
            ['Time (Index)', this.value],
            settings
        );


    });
    let checks = document.querySelectorAll('input[name="time_series_option"]:checked');
    for(var i = 0; i < checks.length; i++){
      checks[i].checked = false;
    }
}

var count = 1;

function refresh_chart_tab() {
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
    console.log(text.id);
    text.innerHTML = "Tab " + count;
    delete_button.innerHTML = 'X';
    delete_button.onclick = () => {delete_tab(tab.id, chart)};
    text.onclick = () => {display(chart,tab , text.id)};


    tab.appendChild(delete_button);
    tab.appendChild(text);
    document.getElementById("sidebar").appendChild(tab);
    document.getElementById("test-chart").appendChild(chart);
    count++;
    if (tab_count === 0) {
        first_tab = tab;
    }
    tab_count++;

    if (tab_count > 1){
        if (cur_chart != undefined) {
            cur_chart.hidden = true;
        }
        chart.style.display = "inline";
    }
    display(chart,tab , text.id);

    refresh_chart();

}

function drop() {
    let e = document.getElementById('time_series_options');
    e.hidden = !e.hidden;
}

function delete_tab(tab, chart){
  document.getElementById(tab).remove();
  //document.getElementById(chart).remove();
  chart.remove();
  tab_count--;
  if(cur_chart === chart){
    cur_chart = undefined;
    if (tab_count) {
      console.log(document.getElementById('sidebar').children[0].children[1])
      display(document.getElementsByClassName('grapher')[0],document.getElementById('sidebar').children[0].children[1], document.getElementById('sidebar').children[0].children[1].id);
    }
  }
}

function display(chart,tab , text){
  console.log(text);
  if(cur_chart != undefined){
    cur_chart.style.display = "none";
    cur_tab.style.color = "#2196F3";
    cur_tab.style.fontWeight = 'normal';
  }
  cur_chart = chart;
  cur_tab = tab;
  cur_text = text;
  cur_chart.style.display = "inline";
  if(cur_tab != undefined){
    cur_tab.style.color = "#FF0000";
    cur_tab.style.fontWeight = 'bold';
  }
  let hold = text.substring(0, 2);
  switch(hold){
    case "tw":
      goto1();
      break;
    case "dt":
      goto2();
      break;
    case "ts":
      goto3();
      break;
    case "pw":
      goto4();
      break;
    case "st":
      goto5();
      break;
  }
}

var Anomaly_list = []
var Charts = []

var anomaly_colours = new Map([
  ['Flap Slate', '#228B22'],
  ['Path High', '#FFA500'],
  ['Speed High','#F08080']
])

async function Anomaly_Upload(obj){
    fetch("http://" + hostname + ":" + port + "/" , {method: 'POST' , body: JSON.stringify(obj)})
        .then(response => response.text())
        .then(response => {
            console.log('RESPONSE::POST:')
            console.log(response);
            window.alert("Anamoly marked.")
        })

}
