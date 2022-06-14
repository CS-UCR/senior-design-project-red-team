const onAWS = false;
const hostname = onAWS ? 'ec2-54-91-170-251.compute-1.amazonaws.com' : '127.0.0.1'
const port = onAWS ? '80' : '8080'

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


    document.getElementById('TPC').style.border = "1px solid #00ff00";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";
}
function goto2() {
    refresh_chart = dtr_chart;
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


    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #00ff00";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";
}
function goto3() {
    refresh_chart = () => time_series(true);
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


    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #00ff00";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";

}

function goto4() {
    refresh_chart = () =>  p_refresh_chart();
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;
    document.getElementById("dtr-specific").hidden = true;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #00ff00";

}

var refresh_chart = two_parameter_chart;
var tab_count = 0;
var cur_chart;
var cur_tab;
var first_tab;
var dtr_current_selected_chart = undefined;
var selected_chart_for_point_selection = undefined;
var data_to_be_selected;

function remove_children(p){
  while(p.firstChild){
    p.removeChild(p.firstChild);
  }

}
async function two_parameter_chart() {
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
    layout.xaxis.title.text = par1;
    let [data, json] = await Promise.all([
        d3.json("http://" + hostname + ":" + port + "/" + ['two-parameter', flight, par1, par2].join('/')),
        d3.json("http://" + hostname + ":" + port + "/Anomalies.json")
    ]).catch(err => console.error(err));
    console.log(json)
    let apl_anom = json.filter(obj => obj.flight == flight && obj.x_par == par1 && obj.y_par == par2)
    console.log(apl_anom)
    let on_anomaly = (sel, type) => {
      let a = {
          x: sel[0],
          y: sel[1],
          flight: flight,
          x_par: par1,
          y_par: par2,
          type: type
      }
      console.log(a);
      Anomaly_Upload(a);
    }
    const settings = {
        width: 1200,
        boxes: apl_anom.map(obj => ({sel: [obj.x, obj.y], color: anomaly_colours.get(obj.type), text: obj.type})),
        onAnomaly: on_anomaly
    }
    twoParameterChart(d3.select(cur_chart).append('div').node(), [{X: data.x, Y: data.y}], [par1, par2], settings)       
}

function oneDimChart() {
  
}

function dtr_chart() {
    document.getElementById('time_series_options').hidden = true;
    if (tab_count === 0) {
        refresh_chart_tab();
        return;
    }
    const chart = cur_chart;
    if (chart) {
        remove_children(chart);
    }
    var flight = d3.select('#file-select').property('value');
    const checkboxes = d3.selectAll('input[name="time_series_option"]:checked');
    let checked_ptiles = d3.selectAll('.ptile-opt:checked').nodes().map(node => node.value);
    console.log(checked_ptiles)
    const ptile_colors = {
        '10': 'green',
        '50': 'orange',
        '90': 'red'
    }
    checkboxes.each( async function () {
        let new_chart = d3.select(chart).append('div').node();
        new_chart.classList.add('w-fit', 'h-[800px]');

        let data = await fetch("http://" + hostname + ":" + port + "/" + ['dtr', flight, this.value, ...checked_ptiles].join('/'))
            .then(response => response.json())
            .catch(err => console.error(err));

        console.log(data);
        if (!data.percentiles.ys) data.percentiles.ys = {}

        let on_anomaly = (sel, type) => {
            let a = {
                x: sel[0],
                y: sel[1],
                flight: flight,
                x_par: 'Index',
                y_par: this.value,
                type: type
            }
            console.log(a);
            Anomaly_Upload(a);
        }
        const settings = {
            width: 1200,
            onAnomaly: on_anomaly,
            // show_anomalies: true,
            reverse_x: true,
            trace_names: ['Main', ...Object.keys(data.percentiles.ys).map(s => s + 'th Percentile')],
            trace_colors: ['steelblue', ...Object.keys(data.percentiles.ys).map(x => ptile_colors[x])]
        }

        twoParameterChart(
            new_chart, // div
            [{X: data.main.x, Y: data.main.y}, Object.values(data.percentiles?.ys).map(y => ({X: data.percentiles.x, Y: y}))].flat(), // traces
            ["DISTANCE FROM LANDING (MILES)", this.value], // X & Y labels
            settings
        )
    });
}

function time_series() {
    document.getElementById('time_series_options').hidden = true;
    if (tab_count === 0) {
        refresh_chart_tab();
        return;
    }
    const chart = cur_chart;
    if (chart) {
        remove_children(chart);
    }
    var flight = d3.select('#file-select').property('value');
    const checkboxes = d3.selectAll('input[name="time_series_option"]:checked');

    checkboxes.each( async function () {
        let new_chart = d3.select(chart).append('div').node();
        let data = await fetch("http://" + hostname + ":" + port + "/" + ['time-series', flight, this.value].join('/'))
            .then(response => response.json())
            .catch(err => console.error(err))

        new_chart.id = flight;
        let on_anomaly = (sel, type) => {
            let a = {
                x: sel[0],
                y: sel[1],
                flight: flight,
                x_par: 'Index',
                y_par: this.value,
                type: type
            }
            console.log(a);
            Anomaly_Upload(a);
        }
        const settings = {
          width: 1200,
          onAnomaly: on_anomaly,
        }

        twoParameterChart(
            new_chart,
            [{X: data.x, Y: data.y}], 
            ['Time (Index)', this.value], 
            settings
        );

        
    });
}

var count = 1;

function refresh_chart_tab() {
    let tab = document.createElement('button');
    let delete_button = document.createElement('span');
    let text = document.createElement('span');
    let chart = document.createElement('div');

    text.classList.add("hover:color-[#0000ff]", "focus:text-color-[#0000ff]")
    delete_button.classList.add("text-4xl", "font-bold", "text-gray-100", "left-2", "z-10", "hover:text-[#f44336]", "cursor-pointer")
    chart.classList.add("w-3/4", "h-[800px]", "ml-5", "mt-2", "grapher")

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
    display(chart,tab);

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
      display(document.getElementsByClassName('grapher')[0],first_tab);
    }
  }
}

function display(chart,tab){
  if(cur_chart != undefined){
    cur_chart.style.display = "none";
    cur_tab.style.color = "#2196F3";
  }
  cur_chart = chart;
  cur_tab = tab;
  cur_chart.style.display = "inline";
  if(cur_tab != undefined){
    cur_tab.style.color = "#000000";
  }
}

var Anomaly_list = []
var Charts = []

var anomaly_colours = new Map([
  ['Flap Slate', '#228B22'],
  ['Path High', '#FFA500'],
  ['Speed High','#F08080'],
  ['Note', 'blue']
])

async function Anomaly_Upload(obj){
    fetch("http://" + hostname + ":" + port + "/" , {method: 'POST' , body: JSON.stringify(obj)})
        .then(response => response.text())
        .then(response => {
            console.log('RESPONSE::POST:')
            console.log(response);
        })

}

document.addEventListener('keypress', (ev) => {
  if (ev.key === 'k') {
    testing()
  }
})

function testing() {
  document.getElementById('parameter-1').value = 'AILERON POSITION LH'
  document.getElementById('parameter-2').value = 'AILERON POSITION RH'
  two_parameter_chart()
}
