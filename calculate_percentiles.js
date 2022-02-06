const fs = require('fs');
const path = require('path');
const csv = require('csv/sync');

const flight_data_dir = 'Tail_677_CSVs/';

var csv_cols = {};

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
   csv_cols['Dists'] = dists;
   return dists;
}

const bucket_size = 100;

function squares(percent, N) {
    let blocks = Math.floor(percent * N);
    let spaces = N - blocks;
    return '#'.repeat(blocks) + '.'.repeat(spaces);
}

function pad(str, n) {
    let diff = n - str.length;
    if (diff > 0) {
        return str + ' '.repeat(diff);
    }
    else return str.slice(0, n);
}

function create_buckets(parameters) {
   let buckets = {};
   for (const parameter of parameters) buckets[parameter] = [];
   let filenames = fs.readdirSync(flight_data_dir).filter(filename => path.extname(filename) == '').slice(0, 20);
   let file_progress = 1, max_file_progress = filenames.length, max_par_progress = parameters.length;
   for (const filename of filenames) {
       loadCSV(filename);
       const dists = dists_to_landing(true);
       let par_progress = 1;
       for (const parameter of parameters) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
           process.stdout.write("Creating buckets... [" + squares(par_progress / max_par_progress, 10) + "] Parameter: " + par_progress + "/" + max_par_progress);
           process.stdout.write(" [" + squares(file_progress/max_file_progress, 10) + "]: " + file_progress + "/" + max_file_progress + " : " + filename);
           for (let i = 0; i < (csv_cols[parameter]).length; i++) {
               const x = dists[i], y = csv_cols[parameter][i];
               if (x < 0) continue;
               let bucket = Math.floor(x / bucket_size);
               if (buckets[parameter][bucket]) {
                   buckets[parameter][bucket].push(y);
               } else {
                   buckets[parameter][bucket] = [y];
               }
           }
           par_progress += 1;
       }
       file_progress += 1;
    }
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("Buckets complete. Doing percentile calculations...");
    return buckets;
}

function percentile(Ps, l) {
   let N = l.length;
   return Ps.map(P => l[Math.floor(P/100 * N)]);
}

function percentile_values(Ps, parameter) {
//    let result = {
//        x: [],
//        ys: {}
//    };
   let result = {};
   result.x = []
   result.ys = {}
   let par_buckets = buckets[parameter];
   for (let P of Ps) result.ys[P] = [];
   for (let i = 0; i < par_buckets.length; i++) {
       if (par_buckets[i]) {
           result.x.push(i * bucket_size);
            let PRs = percentile(Ps, par_buckets[i].sort());
            for (let j = 0; j < PRs.length; j++) {
                result.ys[Ps[j]].push(PRs[j]);
            }
       }
   }
   return result;
}

// script
var info = {};
loadCSV(fs.readdirSync(flight_data_dir)[0]);
var parameters = Object.keys(csv_cols).slice(1);
const buckets = create_buckets(parameters);
let lengths = [];
for (const b of buckets['PRESSURE ALTITUDE LSP']) {
    if (!b) continue;
    lengths.push(b.length);
}
fs.writeFileSync('lengths.json', JSON.stringify(lengths));
let progress = 1, max_progress = parameters.length;
for (let par of parameters) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write("Calculating percentiles... [" + squares(progress/max_progress, 10) + "]: " + progress + "/" + max_progress + ": " + par);
    info[par] = percentile_values([10,50,90], par);
    progress += 1;
}
// let par_t = 'WINDSHEAR WARNING';
// let par_result = percentile_values([10,50,90], par_t);
// info[par_t] = par_result;
// console.log(info[par_t].ys[50])

fs.writeFileSync('percentiles.json', JSON.stringify(info));
process.stdout.clearLine(0);
process.stdout.cursorTo(0);
console.log('Complete.')