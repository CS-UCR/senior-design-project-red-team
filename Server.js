const http = require('http');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync'); // NodeJS 16
const stringify = require('csv-stringify');
const createCsvWriter = require('csv-writer')
const json2csv = require('json2csv').parse;
const csv_append = require("csv-append");
// const { strictEqual } = require('assert');

/*const csvWriter = createCsvWriter({
    path: 'Anomalies.csv',
    header: [
        {id: 'x_initial', title: 'x_initial'},
        {id: 'x_final', title: 'x_final'},
        {id: 'y_inital', title: 'y_inital'},
        {id: 'y_final', title: 'y_final'},
        {id: 'flight', title: 'flight'},
        {id: 'x_parameter', title: 'x_parameter'},
        {id: 'y_parameter', title: 'y_parameter'},
        {id: 'Anomaly_type', title: 'Anomaly_type'},
        {id: 'Graph_Type', title: 'Graph_Type'},
    ]
});*/

const flight_data_dir = 'truncated/';

const getFlights = () => fs.readdirSync(flight_data_dir);
const getParameters = () => {
    let keys = Object.keys(csv_cols);
    if (keys.length > 0) return keys;
    console.log(keys);
    loadCSV(getFlights()[0]);
    return Object.keys(csv_cols);
}

var csv_cols = {};
var curr_csv = '';


function loadCSV(filename) {
    // let data = fs.readFileSync(flight_data_dir + filename);
    // let csv_data = csv.parse(data);
    // csv_cols = {};
    // curr_csv = filename;
    // for (let col_num = 0; col_num < csv_data[0].length; col_num++) {
    //     let col_name = csv_data[0][col_num];
    //     csv_cols[col_name] = [];
    //     for (let i = 1; i < csv_data.length; i++) {
    //         let val = csv_data[i][col_num];
    //         csv_cols[col_name].push(val.includes('.') ? parseFloat(val) : parseInt(val));
    //     }
    // }
    // // console.log(csv_cols);
    // // console.log(l_csv_cols)
    csv_cols = JSON.parse(fs.readFileSync(flight_data_dir + filename));
    curr_csv = filename;
}

function range(start, end) {
    let res = [];
    for (let i = start; i < end; i++) {
        res.push(i);
    }
    return res;
}

function dists_to_landing(feet = false, l_csv_cols = csv_cols) {
    if (l_csv_cols['Dists']) return l_csv_cols['Dists'];
    var dists = new Array(l_csv_cols['GROUND SPEED LSP'].length);
    // let q = sql('SELECT touchdown-index FROM meta-data M WHERE flight-number = ${flightnum}');
    let touchdown_index = ((l) => {
        for (let i = l.length - 1; i >= 0; i--) {
            if (l[i] == 1) return i;
        }
        return -1;
    })(l_csv_cols['WEIGHT ON WHEELS']);
    let converter = feet ? 1.68780986 : 0.000319660958; // 1.68780986 for ft, 0.000319660958 for miles
    let sum = 0;
    for (let i = touchdown_index; i >= 0; i--) {
        dists[i] = sum;
        sum += l_csv_cols['GROUND SPEED LSP'][i] * converter;
    }
    sum = 0;
    for (let i = touchdown_index; i < l_csv_cols['GROUND SPEED LSP'].length; i++) {
        dists[i] = sum;
        sum -= l_csv_cols['GROUND SPEED LSP'][i] * converter;
    }
    l_csv_cols['Dists'] = dists;
    return dists;
}


function percentile_values(Ps, parameter) {
    if (Ps.length == 0) return {};
    let json = JSON.parse(fs.readFileSync('percentiles.json'))[parameter];
    for (let key in json.ys) {
        if (!Ps.includes(key)) {
            delete json.ys[key];
        }
    }
    return json;
}


const server = http.createServer((req, res) => {

    // POSSIBLE REQUESTS
    // GET /flights -> responds with all csv names in ./flight_data as string[]
    // GET /flight/[flight]/[par1]/[par2] -> responds with JSON object {x: number[], y: number[]}, where x is csv_cols[par1] and y is csv_cols[par2]
    // GET /dist/[flight]/[par1] (todo) -> responds with JSON object {x: number[], y: number[]}, where x is distances from runway and y is par1 at those respective distances

    if (req.method == 'GET') {
        res.statusCode = 200;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        // console.log(req.url);
        let requested_data =
            (req.url)
                .split('/')
                .filter(x => x != '')
                .map(x => x
                    .replace(/%[0-9]+/g, match => String.fromCharCode(parseInt(match.slice(1), 16)))
                );
        console.log(requested_data)
        switch (requested_data[0]) {
            case 'parameters':
                // console.log(getParameters())
                res.end(JSON.stringify(getParameters()))
                break;
            case 'flights':
                res.end(JSON.stringify(getFlights()));
                break;
            case 'two-parameter':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1]);
                res.end(JSON.stringify({
                    x: csv_cols[requested_data[2]],
                    y: csv_cols[requested_data[3]]
                }));
                break;
            case 'dtr':
                let Ps = requested_data.slice(3);
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1]);
                res.end(JSON.stringify({
                    main: {
                        x: csv_cols['MILES FROM TOUCHDOWN'],
                        y: csv_cols[requested_data[2]]
                    },
                    percentiles: percentile_values(Ps, requested_data[2])
                }));
                break;
            case 'time-series':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1]);
                res.end(JSON.stringify({
                    x: range(0, csv_cols[requested_data[2]].length),
                    y: csv_cols[requested_data[2]]
                }));
                break;
            case 'login':
              let ans = "";
              let forwarded = req.headers['x-forwarded-for']
              let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
              console.log("USER IP: " + ip);
              let logs = fs.readFileSync('User_Info.json');
              let users_info = JSON.parse(logs);
              //console.log(JSON.stringify(users_info));
              users_info.forEach(function(item){
                if(ip === item.address){
                  ans = item.login;
                }
              })
              res.end(ans);
              break;
            case undefined:
                res.setHeader('Content-Type', 'text/html');
                let html = fs.readFileSync('Client.html');
                res.end(html);
                break;
            default:
                //let file = requested_data[0];

                let file = requested_data.join('/')
                fs.readFile(file, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.statusCode = 500;
                    }
                    else {
                        switch (path.extname(file)) {
                            case '.js': res.setHeader('Content-Type', 'application/javascript'); break;
                            case '.css': res.setHeader('Content-Type', 'text/css'); break;
                            case '.json': res.setHeader('Content-Type', 'application/json'); break;
                            case '.csv': res.setHeader('Content-Type', 'text/csv'); break;
                        }
                        res.end(data);
                        //console.log("CSV SENT");
                    }

                });
        }

    } else if (req.method == 'POST') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      let posted_data =
          (req.url)
              .split('/')
              .filter(x => x != '')
              .map(x => x
                  .replace(/%[0-9]+/g, match => String.fromCharCode(parseInt(match.slice(1), 16)))
              );
      console.log(posted_data)
      switch(posted_data[0]){
        case 'Anomaly_mark':
      let body = "";
      req.on('data' , chunk => {
        body += chunk;
      });
      req.on('end', () => {
        var ana = fs.readFileSync('Anomalies.json');
        if (ana == '') ana = [];
        var obj = JSON.parse(ana);
        var to_csv_obj = JSON.parse(body);
        obj.push(JSON.parse(body));
        var converted = JSON.stringify(obj,null,4);
        fs.writeFile('Anomalies.json', converted, err => {
      // error checking
        if (err) throw err;
        //console.log(to_csv_obj.type);
        console.log(to_csv_obj.Graph_Type);
        var csv_obj = {x_initial:to_csv_obj.x[0] ,
                      x_final: to_csv_obj.x[1] ,
                       y_inital:to_csv_obj.y[0],
                       y_final:to_csv_obj.y[1],
                       flight:to_csv_obj.flight ,
                       x_parameter:to_csv_obj.x_par ,
                       y_parameter:to_csv_obj.y_par ,
                       Anomaly_Type:to_csv_obj.type ,
                       Graph_Type:to_csv_obj.Graph_Type + "",
                       User: to_csv_obj.User + ""
                     }
        //console.log(csv_obj.Anomaly_Type);
        //console.log(csv_obj.Graph_Type);
        fs.appendFileSync('Anamolies.csv', json2csv([csv_obj], {header:false})+'\r\n');
        //fs.appendFileSync('Anomalies.csv' , stringify({x_initial:converted.x[0] , x_final: converted.x[1] , y_inital:converted.y[0], y_final:converted.y[1], flight:converted.flight , x_parameter:converted.x_par , y_parameter:converted.y_par , Anomaly_Type:converted.type , Graph_Type:converted.Graph_type}));
        res.end("DATA RECIEVED. UPLOAD SUCCESSFUL\n");
      });
    });
    break;
    case 'login':
      let bod = "";
      req.on('data' , chunk => {
        bod += chunk;
      });
      //console.log(bod + "");

      req.on('end', () =>{
        bod = JSON.parse(bod);
        console.log("after parse");
        console.log(bod.user);
      let forwarded = req.headers['x-forwarded-for']
      let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;
      obj = {
        login: bod.user,
        address: ip
      }
      let logs = fs.readFileSync('User_Info.json');
      let info = JSON.parse(logs);
      info.push(obj);
      logs = JSON.stringify(info, null, 4);
      fs.writeFileSync("User_Info.json",logs,"utf-8");
      res.end("Login established");
    })

      break;

    case 'anoup_csv':
    //let bo = [Buffer.alloc(0, "", 'base64')];
    let bo = [];
    req.on('data' , chunk => {
      bo.push(chunk)
    });

    req.on('end', () => {
      //first put it into csv
      /*let csv_input = Buffer.concat(bo);
      csv_input = csv.parse(csv_input.toString(), {from_line:2 , relax_quotes: true});
      csv_append.append('Anamolies.csv', csv_input);*/
      let csv_input = csv.parse(stringify.stringify(bo[0]), {from_line:2 , relax_quotes: true});
      fs.appendFileSync('Anamolies.csv', stringify.stringify(csv_input) + '\r\n');
      //let total = csv.parse(bo, {from_line:2});
    /*  fs.appendFileSync('Anamolies.csv', stringify.stringify(csv_input, {
        cast: {object: function(value){
          return JSON.stringify(value)
        }}}) + '\r\n');*/
      res.end("works");
    })
    break;

    case 'anoup_json':
    let da = [Buffer.alloc(0)];
    req.on('data' , chunk => {
      da.push(chunk);
    });
    req.on('end', () =>{

      var ano = fs.readFileSync('Anomalies.json');
      if (ano == '') ano = [];
      var orig = JSON.parse(ano);
      //console.log(da);
      var tot = Buffer.concat(da);
      tot = JSON.parse(tot)
      //console.log(tot);
      for(let i = 0; i < tot.length; i++){
        let j = tot[i];
        //console.log(j)
        orig.push(j);

        var convert = {x_initial:j.x[0] ,
                      x_final: j.x[1] ,
                       y_inital:j.y[0],
                       y_final:j.y[1],
                       flight:j.flight ,
                       x_parameter:j.x_par ,
                       y_parameter:j.y_par ,
                       Anomaly_Type:j.type ,
                       Graph_Type:j.Graph_Type + "",
                       User: j.User + ""
                     }
        fs.appendFileSync('Anamolies.csv', json2csv([convert], {header:false})+'\r\n');
      }


      fs.writeFileSync('Anomalies.json', JSON.stringify(orig, null, 4));
      res.end("Data received. Upload SUCCESSFUL");
    })
    break;

    case undefined:
      res.statusCode = 500;
      res.end();
      break;
    default:
    res.statusCode = 500;
    res.end();
    break;

}
    } else {
        res.statusCode = 500;
        res.end();
    }
})

const hostname = '127.0.0.1';
const port = 8080;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// function loglist(l) { for (let e of l) console.log(e); }

// loadCSV('677200105090350');
// for (let e of csv_cols['GROUND SPEED LSP']) console.log(e);
// for (let i = 3000; i < 3300; i++) {
//     console.log(i, ':', csv_cols['PRESSURE ALTITUDE LSP'][i]);
// }
// loglist(dists_to_landing(true));
// console.log(calculate_mean('LONGITUDINAL ACCELERATION'));
