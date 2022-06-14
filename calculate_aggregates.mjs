import * as fs from 'fs';
import {
    mean,
    median,
    min,
    max,
    deviation,
    variance
} from 'd3';

const dir = './truncated/'

const stat_funcs = [
    mean, 
    median, 
    min, 
    max, 
    deviation, 
    variance
]

let final = {}
for (let flight of fs.readdirSync(dir)) {
    console.log('Doing flight ' + flight)
    let obj = JSON.parse(fs.readFileSync(dir + flight));
    for (let par in obj) {
        let l = obj[par];
        let res = {};
        for (let f of stat_funcs)
            res[f.name] = f(l);
        obj[par] = res;
    }
    final[flight] = obj;
}
fs.writeFileSync('./aggregates.json', JSON.stringify(final))