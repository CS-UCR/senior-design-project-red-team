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
            let drop_down = document.getElementsByClassName('drop-down')
            flight_parameters.forEach(x => {
                // drop_down.forEach(y => {
                //     var o1 = document.createElement('option')
                //     o1.innerHTML = x
                //     y.appendChild(o1)
                // })
                var o1 = document.createElement('option')
                var o2 = document.createElement('option')
                o1.innerHTML = x
                o2.innerHTML = x
                par1.appendChild(o1)
                par2.appendChild(o2)
            })
        })
        .catch(err => console.error(err));
    
}

function goto1() {
    const chart = document.getElementById('test-chart');
    // refresh_chart = 
    two_parameter_chart(chart);
    document.getElementById('test-chart').hidden = false;
    document.getElementById('parameter-1').hidden = false;
    document.getElementById('parameter-2').hidden = false;
    document.getElementById('parameter-2').disabled = false;
    document.getElementById('add-button').hidden = true;
    
    document.getElementById('01').hidden = true;
    document.getElementById('02').hidden = true;
    document.getElementById('03').hidden = true;
    document.getElementById('04').hidden = true;
  
    document.getElementById('graph-01').hidden =true;
    document.getElementById('graph-02').hidden =true;
    document.getElementById('graph-03').hidden =true;
    document.getElementById('graph-04').hidden =true;


}
function goto2() {

    refresh_chart = dtr_chart;
    document.getElementById('parameter-2').hidden = false;
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
    document.getElementById('test-chart').hidden = false;
    document.getElementById('parameter-1').hidden = false;

    document.getElementById('01').hidden = true;
    document.getElementById('02').hidden = true;
    document.getElementById('03').hidden = true;
    document.getElementById('04').hidden = true;
    
    document.getElementById('graph-01').hidden =true;
    document.getElementById('graph-02').hidden =true;
    document.getElementById('graph-03').hidden =true;
    document.getElementById('graph-04').hidden =true;

    
}
function goto3() {
    
    refresh_chart = () => time_series(true);

    document.getElementById('test-chart').hidden = false;
    document.getElementById('parameter-1').hidden = false;
    document.getElementById('parameter-2').hidden = false;
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = false;

    document.getElementById('01').hidden = true;
    document.getElementById('02').hidden = true;
    document.getElementById('03').hidden = true;
    document.getElementById('04').hidden = true;
 
    document.getElementById('graph-01').hidden =true;
    document.getElementById('graph-02').hidden =true;
    document.getElementById('graph-03').hidden =true;
    document.getElementById('graph-04').hidden =true;

}

function goto4(){

    document.getElementById('test-chart').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('parameter-2').hidden = true;

    document.getElementById('01').hidden = false;
    document.getElementById('02').hidden = false;
    document.getElementById('03').hidden = false;
    document.getElementById('04').hidden = false;
 
    document.getElementById('graph-01').hidden =false;
    document.getElementById('graph-02').hidden =false;
    document.getElementById('graph-03').hidden =false;
    document.getElementById('graph-04').hidden =false;
    MultiSubGraphs()
}

var refresh_chart = two_parameter_chart;

function two_parameter_chart(chart) {

    // const chart = document.getElementById('test-chart');
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var par2 = document.getElementById('parameter-2').value
    const config = ButtonFunctions();


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


        
            Plotly.newPlot(chart, [plot_data], {
                margin: { t: 0 },
                
            },config)

            chart.on('plotly_relayout',
                function(eventdata){
                   alert("zzom!!")
                }
            )
            // chart.addEventListener()
            
        })
        
        .catch(err => console.error(err))
        
}


function dtr_chart() {

    const chart = document.getElementById('test-chart');
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
            
            Plotly.newPlot(chart, data_bank, {
                margin: { t: 0 }
            })
 


        })
        .catch(err => console.error(err))

}

function MultiSubGraphs(){
    const chart_one = document.getElementById('01')
    var flight = document.getElementById('file-select').value
    var parr_one = document.getElementById('m-parameter-1').value
    var parr_two = document.getElementById('m-parameter-2').value

}



function ButtonFunctions(){
    const config = {
        modeBarButtonsToAdd: [
            {
                name: 'Zoom Feature',
                icon:  Plotly.Icons.pencil,
                click: function() {}

    
            }
        ],
        modeBarButtonsToRemove:[
                'toImage',
                'pan2d',
                'lasso2d',
                'zoomOut2d',
                'zoomIn2d',
                'autoScale2d',
                'Zoom',
                'select2d',
                'resetScale2d'
        ]

    };
    return config;
}

// https://plotly.com/javascript/zoom-events/
// function zoomIn(chart){
//     chart.on('plotly_relayout',source = chart,
//     function(eventdata){
//         alert("Zooooom!");
//     })
// }