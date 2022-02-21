const fs = require('fs');
const path = require('path');

const flight_data_dir = 'truncated/';

var csv_cols = {};

function loadCSV(filename) {
    csv_cols = JSON.parse(fs.readFileSync('truncated/' + filename));
}

const bucket_size = 0.4;

function squares(percent, N) {
    let blocks = Math.floor(percent * N);
    let spaces = N - blocks;
    return '#'.repeat(blocks) + '.'.repeat(spaces);
}

function create_buckets(parameters) {
   let buckets = {};
   for (const parameter of parameters) buckets[parameter] = [];
   let filenames = fs.readdirSync(flight_data_dir).filter(filename => path.extname(filename) == '');
   let file_progress = 1, max_file_progress = filenames.length, max_par_progress = parameters.length;
   for (const filename of filenames) {
       loadCSV(filename);
       let par_progress = 1;
       for (const parameter of parameters) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
           process.stdout.write("Creating buckets... [" + squares(par_progress / max_par_progress, 10) + "] Parameter: " + par_progress + "/" + max_par_progress);
           process.stdout.write(" [" + squares(file_progress/max_file_progress, 10) + "]: " + file_progress + "/" + max_file_progress + " : " + filename);
           for (let i = 0; i < (csv_cols[parameter]).length; i++) {
               const x = csv_cols['MILES FROM TOUCHDOWN'][i], y = csv_cols[parameter][i];
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
   let result = {};
   result.x = []
   result.ys = {}
   let par_buckets = buckets[parameter];
   for (let P of Ps) result.ys[P] = [];
   for (let i = 0; i < par_buckets.length; i++) {
       if (par_buckets[i]) {
           result.x.push(i * bucket_size);
            let PRs = percentile(Ps, par_buckets[i].sort((a,b) => a - b));
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
