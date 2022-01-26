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

function single_graph() {
    location.href = "Client.html";
}

function remove_children(p){
  while(p.firstChild){
    p.removeChild(p.firstChild);
  }
}

function p_refresh_chart() {
    if(tab_count === 0){
      p_refresh_chart_tab();
    }else{

      const chart = document.getElementById('test-chart');
      remove_children(chart);

      var flight = document.getElementById('file-select').value
      var parameters = GetCheckedParameters();

      if (parameters.length !== 4) {
        window.alert("You need 4 parameters");
        return;
      }

      for (let i = 0; i < parameters.length; i++) {
        for (let k = 0; k < parameters.length; k++) {

          par1 = parameters[i];
          par2 = parameters[k];

          let new_chart = document.createElement('div');
          new_chart.setAttribute('class', 'TS2');
          
          if (par1 == par2) {
            fetch("http://" + hostname + ":" + port + "/" + ['flight', flight, par1, par2].join('/'))
            .then(response => response.json())
            .then(plot_data => {
            
              plot_data.map(e => {
                e.type = 'histogram'
              })
              
              console.log(plot_data); 
              Plotly.newPlot(new_chart, plot_data, {
                margin: { t: 0 }
              })

              chart.appendChild(new_chart);
            })
            .catch(err => console.error(err))
          }
          else {
            fetch("http://" + hostname + ":" + port + "/" + ['flight', flight, par1, par2].join('/'))
            .then(response => response.json())
            .then(plot_data => {
              
                plot_data.map(e => {
                  e.mode = 'markers'
                  e.type = 'scatter'
                })

              console.log(plot_data)
              Plotly.newPlot(new_chart, plot_data, {
                margin: { t: 0 }
              })

              chart.appendChild(new_chart);
            })
            .catch(err => console.error(err))
          }
          
        }
      }

    }
  }

  function p_refresh_chart_tab(){
    let tab = document.createElement('button');
    let delete_button = document.createElement('span');
    let text = document.createElement('span');
    let chart = document.createElement('span');

    text.setAttribute("class", "button");
    delete_button.setAttribute("class", "close");
    chart.setAttribute("class", "grapher");

    chart.id = "chart" + count;
    tab.id = "tab" + count;
    text.innerHTML = "Tab " + count;
    delete_button.innerHTML = 'X';
    delete_button.onclick = () => {delete_tab(tab.id, chart.id)};
    text.onclick = () => {display(chart.id)};


    tab.appendChild(delete_button);
    tab.appendChild(text);
    document.getElementById("sidebar").appendChild(tab);
    document.getElementById("test-chart").appendChild(chart);
    count++;
    tab_count++;

    if(tab_count > 1){
      if(cur_chart != undefined){
        document.getElementById(cur_chart).style.display = "none";
      }
      document.getElementById(chart.id).style.display = "inline";
    }
    cur_chart = chart.id;

    p_refresh_chart();

  }

function drop(){
  var x = document.getElementById('PairWise_Plot_Parameter_Box');
    if(x.hidden === true){
      x.hidden = false;
    }else{
      x.hidden = true;
    }
}

function GetCheckedParameters(){
  const checkboxes = document.querySelectorAll('input[name="Pairwise_Plot_Option"]:checked');
    var options = [];
    checkboxes.forEach((checkbox) => {
    options.push(checkbox.value);
      });
  return options;
}
