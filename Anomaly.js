

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
    document.getElementById('file-select').disabled = true;
    document.getElementById('DownAnonJson').hidden = false;
    document.getElementById('DownAnonCSV').hidden = false;
    document.getElementById('UpAnon').hidden = false;

    document.getElementById('TPC').style.border = "1px solid #000000";
    document.getElementById('DTRC').style.border = "1px solid #000000";
    document.getElementById('TS').style.border = "1px solid #000000";
    document.getElementById('PAIR').style.border = "1px solid #000000";
    document.getElementById('STAT').style.border = "1px solid #000000";
    document.getElementById('ONED').style.border = "1px solid #000000";
    document.getElementById('ANON').style.border = "1px solid #00ff00";

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
