

function goto5() {
    refresh_chart = () => Statistics();
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = false;
    document.getElementById('time_series_options').hidden = true;
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById("DISPLAY_SATSTICS").hidden = true;
    document.getElementById("DISPLAY_SATSTICS_NORMAL").hidden = false;
    document.getElementById("DISPLAY_SATSTICS_NORMAL_NEW_TAB").hidden = false;
    document.getElementById('Refresh').hidden = true;
    document.getElementById('refresh').hidden = true;



    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #00FF00";

}

 function Statistics(){
  document.getElementById('time_series_options').hidden = true;
  if(tab_count === 0){
    s_refresh_chart_tab();
  }else{

      if(cur_chart){
        remove_children(cur_chart);
      }

      var flight = document.getElementById('file-select').value
      var parameters = GetCheckedParameters();
      let size = parameters.length;
      for(var i = 0; i < size; i++){
        let par = parameters[i];
        let new_chart = document.createElement('div');
        new_chart.classList.add("pc","blue-trim");
        fetch("http://" + hostname + ":" + port + "/" + ['two-parameter', flight, parameters[i], parameters[i]].join('/'))
            .then(response => response.json())
            .then(data => {
              plot_data = data.x;

                new_chart.innerHTML = par;
                new_chart.innerHTML += "\n";
                new_chart.innerHTML += "Flight number: " + flight + "\n";
                new_chart.innerHTML += "Min: " + d3.min(plot_data) + "\n";
                new_chart.innerHTML += "Max: " + d3.max(plot_data) + "\n";
                new_chart.innerHTML += "Mean: " + d3.mean(plot_data) + "\n";
                new_chart.innerHTML += "Variance: " + d3.variance(plot_data) + "\n";
                new_chart.innerHTML += "Standard Deviation: " + d3.deviation(plot_data) + "\n";
                new_chart.innerHTML += "Median: " + d3.median(plot_data) + "\n";

                cur_chart.appendChild(new_chart);

            })

          }
          //.catch(err => console.error(err))
        }
}

function s_refresh_chart_tab(){
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

  Statistics();

}
