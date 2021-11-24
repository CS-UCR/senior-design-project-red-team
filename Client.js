const hostname = '127.0.0.1'
const port = '8080'

const flight_parameters = ['AILERON POSITION LH', 'AILERON POSITION RH', 'CORRECTED ANGLE OF ATTACK', 'BARO CORRECT ALTITUDE LSP', 'BARO CORRECT ALTITUDE LSP', 'COMPUTED AIRSPEED LSP', 'SELECTED COURSE', 'DRIFT ANGLE', 'ELEVATOR POSITION LEFT', 'ELEVATOR POSITION RIGHT', 'T.E.FLAP POSITION', 'GLIDESLOPE DEVIATION', 'SELECTED HEADING', 'SELECTED AIRSPEED', 'LOCALIZER DEVIATION', 'N1 COMMAND LSP', 'TOTAL PRESSURE LSP', 'PITCH ANGLE LSP', 'ROLL ANGLE LSP', 'RUDDER POSITION', 'TRUE HEADING LSP', 'VERTICAL ACCELERATION', 'WIND SPEED', 'AP FD STATUS', 'GEARS L & R DOWN LOCKED', 'TCAS LSP', 'WEIGHT ON WHEELS']

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
}

const chart = document.getElementById('test-chart');

function refresh_chart() {
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var par2 = document.getElementById('parameter-2').value
    fetch("http://" + hostname + ":" + port + "/" + ['flight', flight, par1, par2].join('/'))
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