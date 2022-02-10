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

var tabs = [];
var next_tab_id = 0;
var current_tab = undefined;

function init() {
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
    fetch("http://" + hostname + ":" + port + "/" + ['parameters'].join('/'))
        .then(response => response.json())
        .then(flight_parameters => {
            var par1 = document.getElementById('parameter-1')
            var par2 = document.getElementById('parameter-2')
            flight_parameters.forEach(x => {
                var o1 = document.createElement('option')
                var o2 = document.createElement('option')
                o1.innerHTML = x
                o2.innerHTML = x
                par1.appendChild(o1)
                par2.appendChild(o2)
            })
        })
        .catch(err => console.error(err));
        // Plotly.newPlot(document.getElementById('test-chart'), [])
}

// ONCLICK FUNCTIONS

function test(next_tab_id) {
    return next_tab_id;
}

function goto1(tab_id) {
    if (current_tab != undefined) document.getElementById('tab-graph-' + current_tab.toString()).hidden = true;
    current_tab = tab_id;
    let graph = document.getElementById('tab-graph-' + tab_id.toString());
    graph.hidden = false;
    refresh_chart = () => two_parameter_chart(graph);
    document.getElementById('parameter-2').disabled = false;
    document.getElementById('time-series-specific').hidden = true;
    document.getElementById('dtr-specific').hidden = true;
}
function goto2(tab_id) {
    if (current_tab != undefined) document.getElementById('tab-graph-' + current_tab.toString()).hidden = true;
    current_tab = tab_id;
    let graph = document.getElementById('tab-graph-' + tab_id.toString());
    graph.hidden = false;
    refresh_chart = () => dtr_chart(graph);
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('time-series-specific').hidden = true;
    document.getElementById('dtr-specific').hidden = false;
}
function goto3(tab_id) {
    if (current_tab != undefined) document.getElementById('tab-graph-' + current_tab.toString()).hidden = true;
    current_tab = tab_id;
    let graph = document.getElementById('tab-graph-' + tab_id.toString());
    graph.hidden = false;
    refresh_chart = () => time_series(true, graph);
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('time-series-specific').hidden = false;
    document.getElementById('dtr-specific').hidden = true;
}

function delete_tab(tab_id) {
    document.removeChild(document.getElementById())
}

function create_new_tab(n) {
    tabs.push()
    let this_tab_id = next_tab_id;
    let div = document.getElementById('top-btns');
    let btn = document.createElement('button');
    let X = document.createElement('button');
    X.classList.add('text-red-500');
    X.innerHTML = 'X';
    X.onclick = () => {
        delete_tab(this_tab_id);
    }

    btn.classList = "btn-top";
    let f, type;
    switch (n) {
        case 1: f = goto1; type = '2PAR'; break;
        case 2: f = goto2; type = 'DTR'; break;
        case 3: f = goto3; type = 'TS'; break;
    }
    btn.onclick = () => {
        f(this_tab_id);
        for (let e of div.children) e.classList.toggle('border-2', false);
        btn.classList.add('border-2');
        
    }
    btn.innerHTML = "Tab " + next_tab_id.toString() + ' - ' + type;
    div.appendChild(btn);
    
    let graph = document.createElement('div');
    graph.id = 'tab-graph-' + next_tab_id.toString();
    graph.hidden = true;
    document.getElementById('tab-graphs').appendChild(graph);
    next_tab_id++;

    f(this_tab_id);
}


var refresh_chart;

async function two_parameter_chart(chart) {
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var par2 = document.getElementById('parameter-2').value
    fetch("http://" + hostname + ":" + port + "/" + ['two-parameter', flight, par1, par2].join('/'))
        .then(response => response.json())
        .then(data => {
            if (par1 == par2) {
                plot_data = {
                    x: data.x,
                    y: data.y,
                    type: 'histogram'
                };
            } else {
                plot_data = {
                    x: data.x,
                    y: data.y,
                    mode: 'markers',
                    type: 'scatter'
                };

            }
            console.log(data);
            layout.xaxis.title.text = par1;
            layout.yaxis.title.text = par2;
            Plotly.newPlot(chart, [plot_data], layout);
        })
        .catch(err => console.error(err))
}

async function dtr_chart(chart) {
    var flight = document.getElementById('file-select').value;
    var par1 = document.getElementById('parameter-1').value;
    // let p = document.evaluate('div', n.parentNode, null, XPathResult.ANY_TYPE, null);
    let checked_ptiles = [];
    for (let elem of document.querySelectorAll('.ptile-opt:checked')) {
        // checked_ptiles.push(parseInt(elem.id.slice(-2)));
        checked_ptiles.push(elem.value);
    }
    console.log(checked_ptiles)
    
    let data = await fetch("http://" + hostname + ":" + port + "/" + [['dtr', flight, par1], checked_ptiles].flat().join('/'))
        .then(response => response.json())
        .catch(err => console.error(err));
    console.log(data);
    data.main.name = "Flight trace";
    var traces = [data.main];
    for (let ptile in data.percentiles.ys) {
        traces.push({
            x: data.percentiles.x,
            y: data.percentiles.ys[ptile],
            type: 'scattergl',
            name: ptile.toString() + 'th percentile'
        });
    }

    layout.xaxis.title.text = 'DISTANCE FROM LANDING (MILES)';
    layout.yaxis.title.text = par1;
    Plotly.newPlot(chart, traces, layout);
    
}

var data_bank = [];

async function time_series(refresh, chart) {
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    fetch("http://" + hostname + ":" + port + "/" + ['time-series', flight, par1].join('/'))
        .then(response => response.json())
        .then(data => {
            if (refresh) data_bank = [];
            // else data.y = integral(data.y);
            data_bank.push({
                x: data.x,
                y: data.y,
                mode: 'markers',
                type: 'scatter'
            });
            console.log(data);
            layout.xaxis.title.text = "TIME (SECONDS)";
            layout.yaxis.title.text = par1;
            Plotly.newPlot(chart, data_bank, layout)
        })
        .catch(err => console.error(err))
}