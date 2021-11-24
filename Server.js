const http = require('http');
const fs = require('fs');
const csv = require('csv-parse/sync');

const flight_data_dir = 'flight-data/';

const getFlights = () => fs.readdirSync(flight_data_dir);

var csv_cols;
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
            case 'flights':
                res.write(JSON.stringify(getFlights()));
                break;
            case 'flight':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1]);
                res.write(JSON.stringify({
                    x: csv_cols[requested_data[2]],
                    y: csv_cols[requested_data[3]]
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