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
      var data1 = []
      var data2 = []
      var data3 = []
      var data4 = []

      if (par1 == par2 || par1 == par3 || par1 == par4 ||
        par2 == par3 || par2 == par4 || par3 == par4) {
              window.alert("All parameters need to be uniqe");
              return;
        }

      fetch("http://" + hostname + ":" + port + "/" + ['single', flight, par1].join('/'))
          .then(response => response.json())
          .then(data => {
            console.log(data)
            data1 = data
          })
          .catch(err => {
            console.error(err)
            data_error = true
          })

        fetch("http://" + hostname + ":" + port + "/" + ['single', flight, par2].join('/'))
          .then(response => response.json())
          .then(data => {
            console.log(data2)
            data2 = data
          })
          .catch(err => {
            console.error(err)
            data_error = true
          })

          fetch("http://" + hostname + ":" + port + "/" + ['single', flight, par3].join('/'))
          .then(response => response.json())
          .then(data => {
            console.log(data)
            data3 = data
          })
          .catch(err => {
            console.error(err)
            data_error = true
          })

          fetch("http://" + hostname + ":" + port + "/" + ['single', flight, par4].join('/'))
          .then(response => response.json())
          .then(data => {
            console.log(data)
            data4 = data
          })
          .catch(err => {
            console.error(err)
            data_error = true
          })

          if (data_error === true) {
            data_error = false
            return
          }

          var plot_data = [{
            type: 'splom',
            dimensions: [
              {label:'1', values:data1},
              {label:'2', values:data2},
              {label:'3', values:data3},
              {label:'4', values:data4}
            ],
          }]

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
