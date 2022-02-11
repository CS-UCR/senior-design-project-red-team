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
}

function goto1() {
    refresh_chart = two_parameter_chart;
    document.getElementById('parameter-2').disabled = false;
    document.getElementById('add-button').hidden = true;
}
function goto2() {
    refresh_chart = dtr_chart;
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = true;
}
function goto3() {
    refresh_chart = () => time_series(true);
    document.getElementById('parameter-2').disabled = true;
    document.getElementById('add-button').hidden = false;

}

var refresh_chart = two_parameter_chart;
var type_of_graph = ''
function two_parameter_chart() {
    const chart = document.getElementById('test-chart');
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var par2 = document.getElementById('parameter-2').value
    type_of_graph = 'two-parameter'

    fetch("http://" + hostname + ":" + port + "/" + [type_of_graph, flight, par1, par2].join('/'))
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
            config  = removeEvents()
            Plotly.newPlot(chart,[plot_data], {
                margin: { t: 0 },
                
                
            },config)
            selectDisplay()


            

        })
        .catch(err => console.error(err))
}
function removeEvents(){
    var config = {
        modeBarButtonsToRemove:[
            'lasso2d'
        ]
    }
    return config
}
function selectDisplay(){
    console.log('clicked')
    const chart = document.getElementById('test-chart');

    var x_start = 0
    var x_end = 0
    var y_start = 0
    var y_end = 0

    var x_values = []
    var y_values = []
    chart.on('plotly_selected',
        function(data){
            console.log(data)
  
            x_start =  data.range.x[0]
            x_end   =  data.range.x[1]
            y_start =  data.range.y[0]
            y_end   =  data.range.y[1] 

            for(var i = 0; i < data.points.length; i++){
                x_values.push(data.points[i].x)
                y_values.push(data.points[i].y)
            }
            // console.log(x_values,y_values)
            selected_values = {
                x: x_values,
                y: y_values,
                xaxis: {range: [x_start,x_end]},
                yaxis: {range: [y_start,y_end]}

            }
            Anomaly_list.push(selected_values)
            console.log(Anomaly_list)
            Log_Display()
            x_values = []
            y_values = []

        })
       

}


// FLap slate path high speed high 
var Anomaly_list = []
function Log_Display(){
    
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var par2 = document.getElementById('parameter-2').value


    var s_flight = document.getElementById('fid').value = String(flight)
    var type = document.getElementById('gid').value = type_of_graph
    var par = document.getElementById('pid').value = par1
    var parr =  document.getElementById('pid2').value = par2
 
    // var mylist = document.getElementById('class-id').value;
   


    var graph_values 
    if(Anomaly_list.length <= 1){
        graph_values = Anomaly_list[0]
    }
    else{
        graph_values  = Anomaly_list[Anomaly_list.length-1]
    }
    console.log(graph_values)
    // console.log(v)
    saveForm(graph_values,s_flight,type,par,parr)
}

function openForm(){
    document.getElementById('logForm').style.display = 'block'
}
// var mylist = document.getElementById("class-id")
var v_test = ''
function type_Anomally(){
    var mylist = document.getElementById("class-id")
    v_test = document.getElementById("demo").value = mylist.options[mylist.selectedIndex].text
}
function saveForm(graph_values,s_flight,type,par,parr){

    var save_btn = document.getElementById('save_btn')
    // var input =  mylist.options[mylist.selectedIndex].text
    // console.log(input)
    // console.log(v_test)
    save_btn.onclick = function(){
        var upload = {
            Points: graph_values,
            Flight: s_flight,
            Type: type,
            Parameters: [par,parr],
            Anomaly: v_test

        }
        console.log(upload)
        
    }

}
function closeForm(){
    document.getElementById('logForm').style.display = 'none'
    document.getElementById('fid').value = ''
    document.getElementById('gid').value = ''
    document.getElementById('pid').value = ''
    document.getElementById('pid2').value = ''
}


function dtr_chart() {
    const chart = document.getElementById('test-chart');
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var zoom_btn  = document.getElementById('zoom-btn')
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
            selectDisplay()
        })
        .catch(err => console.error(err))
}

var data_bank = [];

function time_series(refresh) {
    const chart = document.getElementById('test-chart');
    var flight = document.getElementById('file-select').value
    var par1 = document.getElementById('parameter-1').value
    var zoom_btn  = document.getElementById('zoom-btn')
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
            selectDisplay()

        })
        .catch(err => console.error(err))
}