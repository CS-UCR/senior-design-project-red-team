const fs = require("fs");

const pars = Object.keys(JSON.parse(fs.readFileSync('percentiles.json')));
console.log(pars);