

function goto7() {
    type_of_graph = "st";
    document.getElementById('add-button').hidden = true;
    document.getElementById('parameter-2').hidden = true;
    document.getElementById('parameter-1').hidden = true;
    document.getElementById('time_series_select').hidden = true;
    document.getElementById('time_series_options').hidden = true;
    document.getElementById("dtr-specific").hidden = true;
    document.getElementById("DISPLAY_STATISTICS").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL").hidden = true;
    document.getElementById("DISPLAY_STATISTICS_NORMAL_NEW_TAB").hidden = true;
    document.getElementById('Refresh').hidden = true;
    document.getElementById('refresh').hidden = true;
    document.getElementById('ptile-opts').hidden = true;
    document.getElementById('TIME_SERIES_TO_DTR').hidden = true;
    document.getElementById('file-select').hidden = true;
    document.getElementById('DownAnonJson').hidden = false;
    document.getElementById('DownAnonCSV').hidden = false;
    document.getElementById('UpAnon').hidden = false;
    document.getElementById('ModAnon').hidden = false;
    document.getElementById('GraphSelection').hidden = true;
    document.getElementById('PandF').hidden = true;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";
    document.getElementById('ONED').style.border = "1px solid #000000";
    document.getElementById('ANON').style.border = "1px solid #00ff00";

}

function ModAnonGoto(){
    document.getElementById('GraphSelection').hidden = false;
    document.getElementById('DownAnonJson').hidden = true;
    document.getElementById('DownAnonCSV').hidden = true;
    document.getElementById('UpAnon').hidden = true;
    document.getElementById('ModAnon').hidden = true;
    document.getElementById('file-select').hidden = false;
    document.getElementById('parameter-2').hidden = false;
    document.getElementById('parameter-1').hidden = false;
    document.getElementById('PandF').hidden = false;
}

function refresh_chart_tab_Ana() {
    let tab = document.createElement('button');
    let delete_button = document.createElement('span');
    let text = document.createElement('span');
    let chart = document.createElement('div');

    text.classList.add("hover:color-[#0000ff]", "focus:text-color-[#0000ff]")
    delete_button.classList.add("text-4xl", "font-bold", "text-gray-100", "left-2", "z-10", "hover:text-[#f44336]", "cursor-pointer")
    chart.classList.add("w-3/4", "h-[800px]", "ml-5", "mt-2","grapher")
    tab.classList.add("border", "border-solid" ,"border-black" , "h-16" , "w-24")
    chart.id = "chart" + count;
    tab.id = "tab" + count;
    text.id = type_of_graph + count;
    console.log(chart.id);
    console.log(text.id);
    text.innerHTML = "Tab " + count;
    delete_button.innerHTML = 'X';
    delete_button.onclick = () => {delete_tab(tab.id, chart)};
    text.onclick = () => {display(chart,tab , text.id)};


    tab.appendChild(delete_button);
    tab.appendChild(text);
    document.getElementById("sidebar").appendChild(tab);
    document.getElementById("test-chart").appendChild(chart);
    count++;
    if (tab_count === 0) {
        first_tab = tab;
    }
    tab_count++;

    if (tab_count > 1){
        if (cur_chart != undefined) {
            cur_chart.hidden = true;
        }
        chart.style.display = "inline";
    }
    display(chart,tab , text.id);



}

function DownJson(){

  var url = window.URL || window.webkitURL;

  d3.json("http://" + hostname + ":" + port + "/Anomalies.json")
    .then(json => {
      const fil = new Blob([JSON.stringify(json, null, 2)], { type: "text/plain" })
      let da = url.createObjectURL(fil);
      var link = document.createElement("a");
      link.download = "testAnon.json";
      link.href = da;
      link.click()
    })
    .catch(error => {
    console.error(error);
    });



}

async function DownCSV(){

  var url = window.URL || window.webkitURL;


      const link = document.createElement('a');
      link.setAttribute("href", "http://" + hostname + ":" + port + "/Anamolies.csv");
      link.setAttribute('download', "TestAnon.csv");
      //link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);



}

function UploadAnon(){

  console.log("UploadAnon works");
  let input_btn = document.createElement('input');
  input_btn.setAttribute('type', 'file');
  input_btn.setAttribute('oninput', "UpAno(this.files)")
  input_btn.click();


}

function UpAno(files){

  type = files[0].type;
  console.log(type);
  if(type == "text/csv"){
    fetch("http://" + hostname + ":" + port + "/" + ['anoup_csv'].join('/') , {mode: 'no-cors', method: 'POST' , body: files[0], headers: {'Content-type': 'text/csv; charset=UTF-8'}})
    .then(response => response.text())
    .then(response => {
      window.alert(response)
    })
    .catch(err => console.error(err));
  }else{

    fetch("http://" + hostname + ":" + port + "/" + ['anoup_json'].join('/') , {mode: 'no-cors', method: 'POST' , body: files[0] , headers: {'Content-type': 'application/json; charset=UTF-8'}})
    .then(response => response.text())
    .then(rep => {
      window.alert(rep)
    })
    .catch(err => console.error(err));
  }

}

async function Anomaly_ReUpload(oldobj, newobj){
  fetch("http://" + hostname + ":" + port + "/" + ['Anomaly_redraw'].join('/') , {method: 'POST' , body: JSON.stringify([oldobj, newobj])})
      .then(response => response.text())
      .then(response => {
          console.log('RESPONSE::POST:')
          console.log(response);
          window.alert("Anamoly Updated.")
      })
}

async function grapher(json){
  if(cur_chart){
  remove_children(cur_chart);
}
  grapht = json.Graph_Type;
  flight = json.flight;
  console.log(flight);
  switch(grapht){

    case "Two Parameter Chart":
    let par1 = json.x_par;
    let par2 = json.y_par;
    let [data] = await Promise.all([
        d3.json("http://" + hostname + ":" + port + "/" + ['two-parameter', flight, par1, par2].join('/'))
    ]).catch(err => console.error(err));
    json = [json];
    let apl_anom = json.filter(obj => obj.flight == flight && obj.x_par == par1 && obj.y_par == par2)
    console.log(apl_anom)
    let on_anomaly = (sel, type) => {
      let a = {
          x: sel[0],
          y: sel[1],
          flight: flight,
          x_par: par1,
          y_par: par2,
          type: type,
          Graph_Type: 'Two Parameter Chart',
          User: login
      }
      console.log(a);
      Anomaly_ReUpload(a, json[0]);
    }
    const settings = {
        width: 1200,
        boxes: apl_anom.map(obj => ({sel: [obj.x, obj.y], color: (anomaly_colours.get(obj.type) || '#FF0000'), text: obj.type})),
        onAnomaly: on_anomaly,
        trace_names: [flight]
    }
    twoParameterChart(d3.select(cur_chart).append('div').node(), [{X: data.x, Y: data.y}], [par1, par2], settings)

    break;

    case "DTR Chart ":

    break;

    case "Time Series ":

    break;


  }

}

function RedrawGraph(to_be_graphed){
  const dataarr = to_be_graphed.split("\n");
  let getx = dataarr[0].split(" ");
  let gety = dataarr[1].split(" ");

  let getflight = dataarr[2].split(" ");
  //console.log(getflight);
  let getxpar = dataarr[3].split(" ");
  let x = "";
  for(var i = 3; i < getxpar.length; i++){
    //console.log(getxpar[i]);
    x += getxpar[i] + " ";
  }
  let getypar = dataarr[4].split(" ");
  let y = ""
  for(var i = 3; i < getypar.length; i++){
    y += getypar[i] + " ";
  }
  let ty = (dataarr[5].split(" "));
  let type = "";
  for(var i  = 2; i < ty.length; i++){
    type += ty[i] + " ";
  }
  let gt = (dataarr[6].split(" "));
  let grapht = "";
  for(var i  = 3; i < gt.length; i++){
    grapht += gt[i] + " ";
  }
  let u = (dataarr[7].split(" "));
  let user = "";
  for(var i  = 3; i < u.length; i++){
    user += u[i] + " ";
  }
  let obj = {
    x: [getx[2]*1 , getx[4]*1],
    y: [gety[3]*1 , gety[5]*1],
    flight: getflight[2],
    x_par: x.slice(0,-1) ,
    y_par: y.slice(0,-1) ,
    type: type.slice(0,-1),
    Graph_Type: grapht.slice(0,-1),
    User: user.slice(0,-1)
  }
  grapher(obj);
}

function ProcessAndFilter(){
  let flight = (document.getElementById('file-select').value)
  let para1 = (document.getElementById('parameter-1').value)
  let para2 = (document.getElementById('parameter-2').value)
  let graphtype = (document.getElementById('GraphSelection').value)
  if((flight + para1 + para2 + graphtype) === ""){
    window.alert("Please apply at least one filter.");
    return;
  }else{

    d3.json("http://" + hostname + ":" + port + "/Anomalies.json")
      .then(json => {

        if(flight != ""){
         json = json.filter(function (el) {
          return el.flight === flight
          });
        }
        if(para1 != ""){
          json = json.filter(function (el) {
            return el.x_par === para1
          });
        }
        if(para2 != ""){
          json = json.filter(function (el) {
            return el.y_par === para2
          });
        }
        if(graphtype != ""){
          json = json.filter(function (el) {
            return el.Graph_Type === graphtype
          });
        }

        if(cur_chart){
          remove_children(cur_chart);
        }else{
          refresh_chart_tab_Ana();
        }
        let filterhold = document.createElement('div');
        for(var i = 0; i  < json.length; i++){
          let new_chart = document.createElement('div');
          new_chart.classList.add("pc","blue-trim");
          new_chart.innerHTML = "X range: " + json[i].x[0] + " => " + json[i].x[1] + "\n ";
          new_chart.innerHTML += "Y range: " + json[i].y[0] + " => " + json[i].y[1] + "\n ";
          new_chart.innerHTML += "Flight: " + json[i].flight + "\n ";
          new_chart.innerHTML += "X Parameter: " + json[i].x_par + "\n ";
          new_chart.innerHTML += "Y Parameter: " + json[i].y_par + "\n ";
          new_chart.innerHTML += "Anomaly: " + json[i].type + "\n ";
          new_chart.innerHTML += "Graph Type: " + json[i].Graph_Type + "\n ";
          new_chart.innerHTML += "Marked User: " + json[i].User + "\n ";
          let redraw = document.createElement('button');
          redraw.classList.add("bg-blue-500", "text-gray-50", "rounded-sm" ,"px-2");
          redraw.innerHTML = "Modify this Anomaly";
          redraw.onclick = () => {RedrawGraph(new_chart.innerHTML)};
          new_chart.appendChild(redraw);
          cur_chart.appendChild(new_chart);

        }


      })
      .catch(error => {
      console.error(error);
      });
  }
}
