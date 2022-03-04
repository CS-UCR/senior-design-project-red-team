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
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById("DISPLAY_SATSTICS").hidden = true;
    document.getElementById("DISPLAY_SATSTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_SATSTICS_NORMAL_NEW_TAB").hidden = true;
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
    document.getElementById("DISPLAY_SATSTICS").hidden = false;
    document.getElementById("DISPLAY_SATSTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_SATSTICS_NORMAL_NEW_TAB").hidden = true;
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
    document.getElementById("DISPLAY_SATSTICS").hidden = false;
    document.getElementById("DISPLAY_SATSTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_SATSTICS_NORMAL_NEW_TAB").hidden = true;
    document.getElementById('Refresh').hidden = false;
    document.getElementById('refresh').hidden = false;


    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #00ff00";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";

}
/*function goto4() {
    refresh_chart = () =>  p_refresh_chart();
    import p_refresh_chart() from './Pairwise.js';
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

}*/

var refresh_chart = two_parameter_chart;
var tab_count = 0;
var cur_chart;
var cur_tab;
var first_tab;
var dtr_current_selected_chart = undefined;

function remove_children(p){
  while(p.firstChild){
    p.removeChild(p.firstChild);
  }

}
var type_of_graph = '';
function two_parameter_chart() {
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
     type_of_graph = 'two-parameter';
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
                layout.yaxis.title.text = par2;
            }
            //console.log(data);
            var chart = cur_chart;
            Plotly.newPlot(chart, [plot_data], layout)
            selectDisplay(chart);
        })
        .catch(err => console.error(err))
}

async function dtr_chart() {
  document.getElementById('time_series_options').hidden = true;
  if(tab_count === 0){
    refresh_chart_tab();
    return;
  }
  const chart = cur_chart;
  if(chart){
  remove_children(chart);
}
    var flight = document.getElementById('file-select').value
    const checkboxes = document.querySelectorAll('input[name="time_series_option"]:checked');
    let options = [];
    checkboxes.forEach((checkbox) => {
    options.push(checkbox.value);
      });
      Parameters_options.push(options);
    let checked_ptiles = [];
    for (let elem of document.querySelectorAll('.ptile-opt:checked')) {
      // checked_ptiles.push(parseInt(elem.id.slice(-2)));
      checked_ptiles.push(elem.value);
  }
  console.log(checked_ptiles)
    type_of_graph = 'dtr';
    layout.xaxis.title.text = "DISTANCE FROM LANDING (MILES)";
    layout.xaxis.autorange = 'reversed';
    for(var i = 0; i < options.length; i++){
      let new_chart = document.createElement('div');
      new_chart.classList.add('w-fit', 'h-[800px]');
      new_chart.onclick = () => {highlight(new_chart, options[i]);}; // THIS IS WHERRE THE DTR SLECTION FEATURE IS STARTED

      let data = await fetch("http://" + hostname + ":" + port + "/" + [['dtr', flight, options[i]], checked_ptiles].flat().join('/'))
              .then(response => response.json())
              .catch(err => console.error(err));
          console.log(data);
          data.main.name = "Main"
          var traces = [data.main];
          for (let ptile in data.percentiles.ys) {
              traces.push({
                x: data.percentiles.x,
                y: data.percentiles.ys[ptile],
                type: 'scattergl',
                name: ptile.toString() + 'th Percentile'
              });
          }

          layout.yaxis.title.text = options[i];
          Plotly.newPlot(new_chart, traces, layout);

        chart.appendChild(new_chart);
      }
}

async function dtr_chart_selected(chart, option){
  if(chart){
    var flight = document.getElementById('file-select').value
    let checked_ptiles = [];
    type_of_graph = 'dtr';
   for (let elem of document.querySelectorAll('.ptile-opt:checked')) {
       // checked_ptiles.push(parseInt(elem.id.slice(-2)));
       checked_ptiles.push(elem.value);
   }
   console.log(checked_ptiles)

   let data = await fetch("http://" + hostname + ":" + port + "/" + [['dtr', flight, option], checked_ptiles].flat().join('/'))
       .then(response => response.json())
       .catch(err => console.error(err));
   console.log(data);
   var traces = [data.main];
   for (let ptile in data.percentiles.ys) {
       traces.push({
           x: data.percentiles.x,
           y: data.percentiles.ys[ptile]
       });
   }
   for (let trace of traces) {
       trace.type = 'scattergl';
       trace.mode = 'markers';
   }

   layout.xaxis.title.text = 'DISTANCE FROM LANDING (MILES)';
   layout.yaxis.title.text = option;
   Plotly.react(chart, traces, layout);
  } else {
    dtr_chart();
  }
}

function highlight(chart, option){ //SELECTION HAPPENS HERE
  if(dtr_current_selected_chart != undefined){
    dtr_current_selected_chart.style.border = 0;
    if(dtr_current_selected_chart === chart){
      dtr_current_selected_chart = undefined;
      refresh_chart = dtr_chart;
    }else{
      chart.style.border = "1px solid #00FF00";
      dtr_current_selected_chart.style.border = chart;
      refresh_chart = () => dtr_chart_selected(dtr_current_selected_chart, option);
    }
  }else{
    chart.style.border = "1px solid #00FF00";
    dtr_current_selected_chart = chart;
    refresh_chart = () => dtr_chart_selected(dtr_current_selected_chart, option);
  }
}



var data_bank = [];

async function time_series(refresh) {
  document.getElementById('time_series_options').hidden = true;
  if(tab_count === 0){
    refresh_chart_tab();
    return;
  }
  const chart = cur_chart;
  if(chart){
  remove_children(chart);
}
    var flight = document.getElementById('file-select').value
    const checkboxes = document.querySelectorAll('input[name="time_series_option"]:checked');
    let options = [];
    type_of_graph = 'time-series';
    parameter_two  = 'Time';
    checkboxes.forEach((checkbox) => {
    options.push(checkbox.value);
      });
      Parameters_options.push(options);
      console.log('Parameters Options: ', Parameters_options);
      var type_css;
      if(options.length > 1){
        type_css = ['w-full', 'h-[800px]']; // TS2
      }else{
        type_css = ['w-[1600px]', 'h-[800px]']; // TS1
      }

      layout.xaxis.title.text = 'Time';
    for(var i = 0; i < options.length; i++){
      let new_chart = document.createElement('div');
      for (let t of type_css) new_chart.classList.add(t);
      layout.yaxis.title.text = (options[i]);   //ISSUES HERE, ALL GRAPHS HAVE THE SAME Y AXIS TITLE
    let data = await fetch("http://" + hostname + ":" + port + "/" + ['time-series', flight, options[i]].join('/'))
        .then(response => response.json())
        .catch(err => console.error(err))

            data_bank = [];
            // else data.y = integral(data.y);
            /*data_bank.push({
                x: data.x,
                y: data.y,
                mode: 'markers',
                type: 'scatter'
            });*/
          //  console.log(data);

            Plotly.newPlot(new_chart, [{
                x: data.x,
                y: data.y,
                mode: 'markers',
                type: 'scatter'
            }], layout);

        selectDisplay(new_chart);
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

var count = 1;

function refresh_chart_tab(){
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

  refresh_chart();

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

"SELECTION PART"
function openForm(){
  document.getElementById('logForm').style.display = 'block'
}
function closeForm(){
  document.getElementById('logForm').style.display = 'none'
  document.getElementById('fid').value = ''
  document.getElementById('gid').value = ''
  document.getElementById('pid').value = ''
  document.getElementById('pid2').value = ''
}
var Anomaly_list = []
var Parameters_options = []
var Charts = []
async function selectDisplay(chart){
  // console.log(cur_chart)

  console.log('clicked')
  console.log(chart)
  Charts.push(chart)
  // const chart = document.getElementById('test-chart');

  var x_start = 0
  var x_end = 0
  var y_start = 0
  var y_end = 0

  var x_values = []
  var y_values = []
  chart.on('plotly_selected',
      function(data){
          console.log('here',data)

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
          Chart_Data.push(selected_values)
          Anomaly_list.push(selected_values)
          console.log(Anomaly_list)
          Log_Display()
          x_values = []
          y_values = []




      })


}
var v_test = ''
function type_Anomally(){
    var mylist = document.getElementById("class-id")
    v_test = document.getElementById("demo").value = mylist.options[mylist.selectedIndex].text
}

var parameter_two = ''
function Log_Display(){

  var flight = document.getElementById('file-select').value
  var par1 = document.getElementById('parameter-1').value
  var par2 = document.getElementById('parameter-2').value


  var s_flight = document.getElementById('fid').value = String(flight)
  console.log(flight + "\n");
  var type = document.getElementById('gid').value = type_of_graph
  var par = ''
  var parr =  ''
  // console.log('parpar1)
  switch(type){
    case 'time-series':
      console.log('time')
      par = document.getElementById('pid').value = par1
      parr = document.getElementById('pid2').value =  parameter_two
      break
    case 'dtr':
      console.log('dtr')
      par = document.getElementById('pid').value = par1
      parr = document.getElementById('pid2').value =  parameter_two
     break
    case 'two-parameter':
      console.log('two')
      par = document.getElementById('pid').value = par1
      parr =  document.getElementById('pid2').value = par2

      break
  }

  // // var mylist = document.getElementById('class-id').value;
  // if(parr === '' && par === ''){
  //   console.log("Parameters Not Declared")
  // }
  parameter_Options()

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

"PARAMETER SELECTION WORKS FOR MULT GRAPH SELECTION"
function parameter_Options(){

  var select = document.getElementById('p-pid')

  // console.log(select.length)
  console.log("i length: ", Parameters_options.length)
  for(var i = 0; i < Parameters_options.length; i++){

    console.log('Parameters_options[i].length: ', Parameters_options[i].length)
    if(select.length < Parameters_options[i].length ){
      // console.log("Parameters are in ")
      for(var j = 0; j < Parameters_options[i].length; j++){

        if(Parameters_options.length > 0 && i > 0 && Parameters_options[i-1][j] == Parameters_options[i][j] ){
          console.log("Parameter is already in option selection")
        }

        else{
          var option = document.createElement('option')
          // console.log("i: ",i, 'j: ', j,Parameters_options[i][j] )
          option.value = Parameters_options[i][j]
          option.innerHTML = Parameters_options[i][j]
          select.appendChild(option)
        }

      }


    }

  }

}
var parameter_selected_value = ' '
function type_Parameter(){
  var select = document.getElementById('p-pid')
  parameter_selected_value = document.getElementById('pid').value = select.options[select.selectedIndex].text
}

function Parameter_Outputs(graph_type,parameter_one, parameter_two){
  var return_value
  switch(graph_type){
    case 'time-series':
      return_value = [parameter_selected_value, parameter_two]
      break
    case 'two-parameter':
      return_value = [parameter_one, parameter_two]
      break
    case 'dtr':
      return_value = [parameter_selected_value, parameter_two]
      break

  }
  return return_value
}

var Record_Saved = []
var Chart_Data = []
"COLOR ANOMALY"
var set_anomaly  = new Map([
  ['Flap Slate', '#228B22'],
  ['Path High', '#FFA500'],
  ['Speed High','#F08080']
])
function saveForm(graph_values,s_flight,type,par,parr){

  var save_btn = document.getElementById('save_btn')


  save_btn.onclick = function(){
      var upload = {
          points: graph_values,
          flight: s_flight,
          type: type,
          parameters: Parameter_Outputs(type,par,parr),
          anomaly: v_test,
          marker: {color: set_anomaly.get(v_test)}
      }
      console.log(upload)
      // Record_Saved.push(upload)
      MarkerColor(upload)
  }

}

function MarkerColor(values){
  // console.log("Record_Saved: ", Record_Saved)
  var select = document.getElementById('p-pid')
  console.log('Selection lenght:', select.length)
  console.log('Parameter_Options Values:', Parameters_options)
  plot_data = {
    x: values.points.x,
    y: values.points.y,
    mode: 'markers',
    type: 'scatter',
    name: values.anomaly,
    marker: values.marker

  }
  console.log('New plot_data :', plot_data)
  console.log('Charts: ', Charts)
  var index = 0
  for(var i = 0; i < Parameters_options[Parameters_options.length-1].length; i++ ){
    if(values.parameters[0] === Parameters_options[Parameters_options.length-1][i]){
      console.log("Match")
      index = i
      console.log('Index: ', index)
    }
  }
  var chart_index = Charts.length - Parameters_options[Parameters_options.length-1].length + index
  console.log('Chart index: ', chart_index)

  Plotly.addTraces(Charts[chart_index],plot_data)

}









// const new_anoamly_color = new Map([
//   [1, '#F5DEB3' ],
//   [2,'#EE82EE'],
//   [3,'#4682B4'],
//   [4, '#CD853F'],
//   [5,'#B0C4DE']
// ])
// function colorAnomaly(){

//   var mychart = document.getElementById('test-chart')



//   console.log('GRaph data? ', mychart)
//   Record_Saved[0]['marker'] = {color: set_anomaly.get(Record_Saved[0].Anomaly)}
//   console.log(Record_Saved[0])
//   console.log(Chart_Data[0])


//   Plotly.restyle(mychart,Record_Saved[0])

// }

"MAYBE REMOVE"
// function colorAnomaly(anomaly_feature){
//   var return_color = ''

//   if(set_anomaly.has(anomal_feature)){
//     return_color = set_anomaly.get(anomaly_feature)
//   }
//   else{
//     color_num = Math.floor(Math.random()*5)
//     new_color = new_anoamly_color.get(color_num)
//     new_anoamly_color.delete(color_num)
//     set_anomaly.set(anomaly_feature,new_color)
//     return_color = set_anomaly.get(anomaly_feature)
//   }
//   return return_color
// }
