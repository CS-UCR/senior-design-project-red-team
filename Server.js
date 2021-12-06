const http = require('http');
const fs = require('fs');
const csv = require('csv-parse/sync'); // NodeJS 16
// const csv = require('csv-parse/lib/sync.js'); // NodeJS 12

const flight_data_dir = 'flight-data/';

const getFlights = () => fs.readdirSync(flight_data_dir);
const getParameters = () => {
    try {
        return csv_cols.keys();
    } catch {
        return fs.readFileSync(flight_data_dir + getFlights()[0]).toString().split('\n')[0].split(',');
    }
}

var csv_cols = {};
var curr_csv = '';


function loadCSV(filename) {
    let data = fs.readFileSync(flight_data_dir + filename);
    let csv_data = csv.parse(data); // NodeJS 16
    // let csv_data = csv(data); // NodeJS 12
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
}

// function DTR_graph_data(parameter) { // for reduced flight-data files
    
// }

function transpose(ls) {
    var result = [];
    for (var i = 0; i < ls[0].length; i++) {
        var tmp = [];
        for (var j = 0; j < ls.length; j++) {
            tmp.push(ls[j][i]);
        }
        result.push(tmp);
    }
    return result;
}

function range(start, end) {
    res = [];
    for (let i = start; i < end; i++) {
        res.push(i);
    }
    return res;
}

function integral(list) {
    res = [1];
    sum = 1;
    list.forEach((x) => {
        sum += x;
        res.push(sum);
    })
    return res;
}

var parameter_mean = [];

function calculate_mean(col_name) {
    buckets = [];
    let insert_bucket = (x, y) => {
        for (let bucket in buckets) {
            if (x == bucket[0]) {
                bucket[1].push(y);
                return;
            }
        }
        buckets.push([x, [y]]);

    }
    for (let filename of getFlights()) {
        if (filename.split('.')[1] == 'pkl') continue;
        loadCSV(filename);
        let data = {
            x: integral(csv_cols['GROUND SPEED LSP']).map((x) => (x - csv_cols['GROUND SPEED LSP'][csv_cols['GROUND SPEED LSP'].length - 1]) / 5280),
            y: csv_cols[col_name]
        };
        for (let i = 0; i < data.x.length; i++) {
            insert_bucket(data.x[i], data.y[i]);
        }
    }
    
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // POSSIBLE REQUESTS
    // GET /flights -> responds with all csv names in ./flight_data as string[]
    // GET /flight/[flight]/[par1]/[par2] -> responds with JSON object {x: number[], y: number[]}, where x is csv_cols[par1] and y is csv_cols[par2]
    // GET /dist/[flight]/[par1] (todo) -> responds with JSON object {x: number[], y: number[]}, where x is distances from runway and y is par1 at those respective distances

    if (req.method == 'GET') {
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
                res.write(JSON.stringify(getParameters()))
                break;
            case 'flights':
                res.write(JSON.stringify(getFlights()));
                break;
            case 'two-parameter':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1]);
                res.write(JSON.stringify({
                    x: csv_cols[requested_data[2]],
                    y: csv_cols[requested_data[3]]
                }));
                break;
            case 'dtr':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1]);
                // console.log(integral(csv_cols['GROUND SPEED LSP']))
                res.write(JSON.stringify({
                    x: integral(csv_cols['GROUND SPEED LSP']).map((x) => (x - csv_cols['GROUND SPEED LSP'][csv_cols['GROUND SPEED LSP'].length - 1]) / 5280),
                    y: csv_cols[requested_data[2]]
                }));
                break;
            case 'time-series':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1]);
                res.write(JSON.stringify({
                    x: range(0, csv_cols[requested_data[2]].length),
                    y: csv_cols[requested_data[2]]
                }));
                break;
        }
            
    } else {
        res.statusCode = 500;
    }
    res.end();
})

const hostname = '127.0.0.1';
const port = 8080;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// loadCSV('654200108221320.csv');
// console.log(csv_cols);