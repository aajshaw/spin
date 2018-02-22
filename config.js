"use strict"

const nconf = require('nconf');

nconf.file('./config.json');

nconf.defaults({
  "updatePeriod": 10,
  "windowWidth": 400,
  "windowHeight": 200,
  "windowOpenDevTools": false,
  "windowShowMenu": false,
  "windowIcon": __dirname + "./assets/spin.ico"
});

module.exports = {
  get: function(key) {
    return nconf.get(key);
  }
};
