const http = require('http');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync'); // NodeJS 16
// const { strictEqual } = require('assert');

const flight_data_dir = 'Tail_677_CSVs/';

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
    let data = fs.readFileSync(flight_data_dir + filename);
    let csv_data = csv.parse(data);
    csv_cols = {};
    curr_csv = filename;
    for (let col_num = 0; col_num < csv_data[0].length; col_num++) {
        let col_name = csv_data[0][col_num];
        csv_cols[col_name] = [];
        for (let i = 1; i < csv_data.length; i++) {
            let val = csv_data[i][col_num];
            csv_cols[col_name].push(val.includes('.') ? parseFloat(val) : parseInt(val));
        }
    }
    // console.log(csv_cols);
    // console.log(l_csv_cols)
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

const DISTANCE_LIMIT = 100; // in miles

function percentile_values(Ps, parameter, feet = false) {
    if (Ps.length == 0) return {};
    let json = JSON.parse(fs.readFileSync('percentiles.json'))[parameter];
    if (!feet) {
        json.x = json.x.map(dist => dist / 5280);
    }
    let limit_index = 0;
    for (let i = 0; i < json.x.length; i++) {
        if (json.x[i] > DISTANCE_LIMIT) {
            limit_index = i;
            break;
        }
    }
    console.log(limit_index);
    json.x = json.x.slice(0, limit_index);
    for (let key in json.ys) {
        if (!Ps.includes(key)) {
            delete json.ys[key];
        } else {
            json.ys[key].slice(0, limit_index);
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
                        x: dists_to_landing(),
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
            case undefined:
                res.setHeader('Content-Type', 'text/html');
                let html = fs.readFileSync('Client.html');
                res.end(html);
                break;
            default:
                let file = requested_data[0];
                fs.readFile(file, (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                    }
                    else {
                        switch (path.extname(file)) {
                            case '.js': res.setHeader('Content-Type', 'application/javascript'); break;
                            case '.css': res.setHeader('Content-Type', 'text/css'); break;
                        }
                        res.write(data);
                    }
                    res.end();
                });
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