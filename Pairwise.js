var p_cur_chart

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
    var par1 = document.getElementById('parameter-1')
    var par2 = document.getElementById('parameter-2')
    var par3 = document.getElementById('parameter-3')
    var par4 = document.getElementById('parameter-4')
    flight_parameters.forEach(x => {
        var o1 = document.createElement('option')
        var o2 = document.createElement('option')
        var o3 = document.createElement('option')
        var o4 = document.createElement('option')
        o1.innerHTML = x
        o2.innerHTML = x
        o3.innerHTML = x
        o4.innerHTML = x
        par1.appendChild(o1)
        par2.appendChild(o2)
        par3.appendChild(o3)
        par4.appendChild(o4)
    })
}

function single_graph() {
    location.href = "Client.html";
}

var axis = () => ({
    showline:false,
    zeroline:false,
    gridcolor:'#ffff',
    ticklen:4
  })

function p_refresh_chart() {
    if(tab_count === 0){
      p_refresh_chart_tab();
    }else{
      var flight = document.getElementById('file-select').value
      var par1 = document.getElementById('parameter-1').value
      var par2 = document.getElementById('parameter-2').value
      var par3 = document.getElementById('parameter-3').value
      var par4 = document.getElementById('parameter-4').value

      if (par1 == par2 || par1 == par3 || par1 == par4 ||
        par2 == par3 || par2 == par4 || par3 == par4) {
              window.alert("All parameters need to be uniqe");
              return;
        }

      fetch("http://" + hostname + ":" + port + "/" + ['pairwise', flight, par1, par2, par3, par4].join('/'))
          .then(response => response.json())
          .then(plot_data => {
                plot_data.map(e => {
                    //e.mode = 'markers'
                    e.type = 'splom'
                    e.dimensions = [
                        {label: '1', values: par1},
                        {label: '2', values: par2},
                        {label: '3', values: par3},
                        {label: '4', values: par4}
                    ]
                })
                
              console.log(data)
              var chart = document.getElementById(p_cur_chart);
              Plotly.newPlot(chart, plot_data, {
                height: 800,
                width: 800,
                autosize: false,
                hovermode:'closest',
                dragmode:'select',
                xaxis:axis(),
                yaxis:axis(),
                xaxis2:axis(),
                xaxis3:axis(),
                xaxis4:axis(),
                yaxis2:axis(),
                yaxis3:axis(),
                yaxis4:axis()
              })
          })
          .catch(err => console.error(err))
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