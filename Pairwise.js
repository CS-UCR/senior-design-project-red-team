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
    document.getElementById("summary_select").hidden = false;
    document.getElementById("summary_display").hidden = true;
    clear_summary();

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #00ff00";

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

      if (parameters.length !== 4) {
        window.alert("You need 4 parameters");
        return;
      }


      fetch("http://" + hostname + ":" + port + "/" + ['pairwise', flight, parameters[0], parameters[1],parameters[2],parameters[3]].join('/'))
       .then(response => response.json())
       .then(data => {
               plot_data = [{
                 dimensions: [
                   {label:parameters[0], values:data.w},
                   {label:parameters[1], values:data.x},
                   {label:parameters[2], values:data.y},
                   {label:parameters[3], values:data.z}
                 ],
                   type: 'splom'
               }];
               var layout = {
                 title:'Pairwise Data Set',
                 height: 800,
                 width: 800,
                 autosize: false,
                 hovermode:'closest',
                 dragmode:'select',
                 plot_bgcolor:'rgba(240,240,240, 0.95)',
                 xaxis:axis(),
                 yaxis:axis(),
                 xaxis2:axis(),
                 xaxis3:axis(),
                 xaxis4:axis(),
                 yaxis2:axis(),
                 yaxis3:axis(),
                 yaxis4:axis()
               }
           //console.log(data);
           Plotly.newPlot(cur_chart, plot_data, layout);
           console.log("here");
       })
       .catch(err => console.error(err))

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
/*function display(chart,tab){
  if(dtr_current_selected_chart != undefined){
    dtr_current_selected_chart.style.border = 0;
    dtr_current_selected_chart = undefined;
  }
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
}*/
