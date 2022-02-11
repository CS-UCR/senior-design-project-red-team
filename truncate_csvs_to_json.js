const fs = require('fs');
const path = require('path');
const csv = require('csv/sync');

const flight_data_dir = 'Tail_677_CSVs/';

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

function dists_to_landing(feet = true) {
    if (csv_cols['Dists']) return csv_cols['Dists'];
    var dists = new Array(csv_cols['GROUND SPEED LSP'].length);
    // let q = sql('SELECT touchdown-index FROM meta-data M WHERE flight-number = ${flightnum}');
    let touchdown_index = ((l) => {
        for (let i = l.length - 1; i >= 0; i--) {
            if (l[i] == 1) return i;
        }
        return -1;
    })(csv_cols['WEIGHT ON WHEELS']);
    let converter = feet ? 1.68780986 : 0.000319660958; // 1.68780986 for ft, 0.000319660958 for miles
    let sum = 0;
    for (let i = touchdown_index; i >= 0; i--) {
        dists[i] = sum;
        sum += csv_cols['GROUND SPEED LSP'][i] * converter;
    }
    sum = 0;
    for (let i = touchdown_index; i < csv_cols['GROUND SPEED LSP'].length; i++) {
        dists[i] = sum;
        sum -= csv_cols['GROUND SPEED LSP'][i] * converter;
    }
    csv_cols['MILES FROM TOUCHDOWN'] = dists;
    return dists;
}

const MILE_LIMIT = 20;

for (let filename of fs.readdirSync(flight_data_dir)) {
    let result = {};
    loadCSV(filename);
    console.log('starting ' + filename);
    let dists = dists_to_landing(false);
    for (let parameter in csv_cols) {
        result[parameter] = [];
        for (let i = 0; i < dists.length; i++) {
            if (dists[i] < MILE_LIMIT && dists[i] > 0) {
                result[parameter].push(csv_cols[parameter][i]);
            }
        }
    }
    fs.writeFileSync('truncated/' + filename, JSON.stringify(result));
}