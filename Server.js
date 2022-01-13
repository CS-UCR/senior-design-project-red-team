const http = require('http')
const fs = require('fs')
const csv = require('csv-parse/sync')

const flight_data_dir = 'flight-data/'

function getFlights() {
    return fs.readdirSync(flight_data_dir)
}

var csv_data = []
var curr_csv = ''

function loadCSV(filename) {
    let data = fs.readFileSync(flight_data_dir + filename)
    csv_data = csv.parse(data, { columns: true })
    curr_csv = filename

}

function getColumn(colname) {
    console.log('Column ' + colname + ' requested')
    var result = []
    csv_data.forEach(x => {
        result.push(x[colname])
    })
    return result;
}

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')

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
                res.write(JSON.stringify(getFlights()))
                break
            case 'flight':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1])
                console.log([{
                    x: getColumn(requested_data[2]),
                    y: getColumn(requested_data[3])
                }])
                res.write(JSON.stringify([{
                    x: getColumn(requested_data[2]),
                    y: getColumn(requested_data[3])
                }]))
                break
            case 'pairwise':
                if (requested_data[1] != curr_csv)
                    loadCSV(requested_data[1])
                console.log([{
                    w: getColumn(requested_data[2]),
                    x: getColumn(requested_data[3]),
                    y: getColumn(requested_data[4]),
                    z: getColumn(requested_data[5])
                }])
                res.write(JSON.stringify([{
                    w: getColumn(requested_data[2]),
                    x: getColumn(requested_data[3]),
                    y: getColumn(requested_data[4]),
                    z: getColumn(requested_data[5])
                }]))

                break
        }

    } else {
        res.statusCode = 500
    }
    res.end()
})

const hostname = '127.0.0.1';
const port = 8080;
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
