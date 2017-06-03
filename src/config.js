// keep config outside src
let CONFIG = require('../config.json');

console.log(CONFIG);

if(!CONFIG) throw Error("config file not found");

module.exports = CONFIG;