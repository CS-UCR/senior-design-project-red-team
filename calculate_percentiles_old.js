const fs = require('fs');
const path = require('path');
const csv = require('csv/sync');

const flight_data_dir = 'Tail_677_CSVs/';

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

const bucket_size = 500;

function squares(percent, N) {
    let blocks = Math.floor(percent * N);
    let spaces = N - blocks;
    return '█'.repeat(blocks) + ' '.repeat(spaces);
}

function create_buckets(parameter) {
   let buckets = [];
   let filenames = fs.readdirSync(flight_data_dir).filter(filename => path.extname(filename) == '').slice(0, 10);
   let progress = 0, max_progress = filenames.length;
   for (const filename of filenames) {
       process.stdout.write("Creating buckets... " + parameter + " [" + squares(progress / max_progress, 10) + "]: " + progress + "/" + max_progress + " : " + filename);
       loadCSV(filename);
       const dists = dists_to_landing(true);
       for (let i = 0; i < (csv_cols[parameter]).length; i++) {
           const x = dists[i], y = csv_cols[parameter][i];
           if (x < 0) continue;
           let bucket = Math.floor(x / bucket_size);
           if (buckets[bucket]) {
               buckets[bucket].push(y);
           } else {
               buckets[bucket] = [y];
           }
       }
       progress += 1;
       process.stdout.clearLine(0);
       process.stdout.cursorTo(0);
   }
   process.stdout.write("Finished... " + parameter);
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
   for (let P of Ps) result.ys[P] = [];
   let buckets = create_buckets(parameter);
   for (let i = 0; i < buckets.length; i++) {
       if (buckets[i]) {
           result.x.push(i * bucket_size);
            let PRs = percentile(Ps, buckets[i].sort());
            for (let j = 0; j < PRs.length; j++) {
                result.ys[Ps[j]].push(PRs[j]);
            }
       }
   }
   return result;
}

function average(l) {
    let sum = 0;
    for (let e of l) sum += e;
    return sum / l.length;
}

function average_values(parameter) {
    let result = {
        x: [],
        ys: {
            '50': []
        }
    };
    let buckets = create_buckets(parameter);
    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i]) {
            result.x.push(i * bucket_size);
             let PR = average(buckets[i]);
             for (let j = 0; j < PRs.length; j++) {
                 result.ys['50'].push(PR);
             }
        }
    }
    return result;

}

// script
var info = {};
loadCSV(fs.readdirSync(flight_data_dir)[0]);
var parameters = Object.keys(csv_cols);
// for (let par of parameters.slice(1)) {
//     info[par] = percentile_values([10,50,90], par);
//     console.log(info[par].ys[50])
// }
let par_t = 'PRESSURE ALTITUDE LSP';
let par_result = percentile_values([10,50,90], par_t);
info[par_t] = par_result;
console.log(info[par_t].ys[50])

fs.writeFileSync('percentiles.json', JSON.stringify(info));
fs.writeFileSync('buckets_cache.json', JSON.stringify(buckets_cache));
process.stdout.clearLine(0);
process.stdout.cursorTo(0);
console.log('Complete.')