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
                layout.yaxis.title.text = par2;
            }
            //console.log(data);
            var chart = cur_chart;
            Plotly.newPlot(chart, [plot_data], layout)
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
    let checked_ptiles = [];
    for (let elem of document.querySelectorAll('.ptile-opt:checked')) {
      // checked_ptiles.push(parseInt(elem.id.slice(-2)));
      checked_ptiles.push(elem.value);
  }
  console.log(checked_ptiles)

    layout.xaxis.title.text = "DISTANCE FROM LANDING (MILES)";
    layout.xaxis.autorange = 'reversed';
    for(var i = 0; i < options.length; i++){
      let new_chart = document.createElement('div');
      new_chart.classList.add('w-fit', 'h-[800px]');
      new_chart.onclick = () => {highlight(new_chart, options[i]);};

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

function highlight(chart, option){
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
    checkboxes.forEach((checkbox) => {
    options.push(checkbox.value);
      });

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
