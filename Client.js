const hostname = '127.0.0.1'
const port = '8080'

// const flight_parameters = ['AILERON POSITION LH', 'AILERON POSITION RH', 'CORRECTED ANGLE OF ATTACK', 'BARO CORRECT ALTITUDE LSP', 'BARO CORRECT ALTITUDE LSP', 'COMPUTED AIRSPEED LSP', 'SELECTED COURSE', 'DRIFT ANGLE', 'ELEVATOR POSITION LEFT', 'ELEVATOR POSITION RIGHT', 'T.E.FLAP POSITION', 'GLIDESLOPE DEVIATION', 'SELECTED HEADING', 'SELECTED AIRSPEED', 'LOCALIZER DEVIATION', 'N1 COMMAND LSP', 'TOTAL PRESSURE LSP', 'PITCH ANGLE LSP', 'ROLL ANGLE LSP', 'RUDDER POSITION', 'TRUE HEADING LSP', 'VERTICAL ACCELERATION', 'WIND SPEED', 'AP FD STATUS', 'GEARS L & R DOWN LOCKED', 'TCAS LSP', 'WEIGHT ON WHEELS']

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
            var par3 = document.getElementById('time_series_options')
            var num = 0;
            flight_parameters.forEach(x => {
                var o1 = document.createElement('option')
                var o2 = document.createElement('option')
                if(num != 0){
                  let o3 = document.createElement('input')
                  o3.type = 'checkbox'
                  o3.id = x
                  o3.name = "time_series_option"
                  o3.value = x
                  let label = document.createElement('label')
                  label.htmlFor = x
                  label.appendChild(document.createTextNode(x))
                  let br = document.createElement('br')
                  par3.appendChild(o3)
                  par3.appendChild(label)
                  par3.appendChild(br)
                }
                o1.innerHTML = x
                o2.innerHTML = x
                par1.appendChild(o1)
                par2.appendChild(o2)
                num++
            })
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

    document.getElementById('TPC').style.border = "1px solid #00ff00";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
}
function goto2() {
    refresh_chart = dtr_chart;
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = false;
    document.getElementById('time_series_select').hidden = true;
    document.getElementById('time_series_options').hidden = true;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #00ff00";
    document.getElementById('TS').style.border = "1px solid #000000";
}
function goto3() {
    refresh_chart = () => time_series(true);
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = false;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #00ff00";

}

var refresh_chart = two_parameter_chart;

function remove_children(p){

  while(p.firstChild){
    p.removeChild(p.firstChild);
  }

}

function two_parameter_chart() {
    const chart = document.getElementById('test-chart');
    remove_children(chart);
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
            Plotly.newPlot(chart, [plot_data], {
                margin: { t: 0 }
            })
        })
        .catch(err => console.error(err))
}

function dtr_chart() {
    const chart = document.getElementById('test-chart');
    remove_children(chart);
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    fetch("http://" + hostname + ":" + port + "/" + ['dtr', flight, par1].join('/'))
        .then(response => response.json())
        .then(data => {
            plot_data = {
                x: data.x.map((x) => -x + data.x[data.x.length - 1]),
                y: data.y,
                mode: 'markers',
                type: 'scatter'
            };
            console.log(data);
            Plotly.newPlot(chart, [plot_data], {
                margin: { t: 0 },
                xaxis: { autorange: 'reversed' }
            })
        })
        .catch(err => console.error(err))
}

var data_bank = [];

function time_series(refresh) {
    const chart = document.getElementById('test-chart');
    remove_children(chart);
    var flight = document.getElementById('file-select').value

    const checkboxes = document.querySelectorAll('input[name="time_series_option"]:checked');
    let options = [];
    checkboxes.forEach((checkbox) => {
    options.push(checkbox.value);
      });

      var type;
      if(options.length > 1){
        type = 'TS2';
      }else{
        type = 'TS1';
      }

    for(var i = 0; i < options.length; i++){
      let new_chart = document.createElement('span');
      new_chart.setAttribute('class', type);
      
    fetch("http://" + hostname + ":" + port + "/" + ['time-series', flight, options[i]].join('/'))
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
            Plotly.newPlot(new_chart, data_bank, {
                margin: { t: 0 }
            })
        })
        .catch(err => console.error(err))
        chart.appendChild(new_chart);
      }
}

function drop(){
var x = document.getElementById('time_series_options')
  if(x.hidden === true){
    x.hidden = false;
  }else{
    x.hidden = true;
  }
}
