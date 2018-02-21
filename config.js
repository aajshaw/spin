"use strict"

const nconf = require('nconf');

nconf.file('./config.json');

nconf.defaults({
  "updatePeriod": 10,
  "windowWidth": 400,
  "windowHeight": 200,
  "windowOpenDevTools": false,
  "windowShowMenu": false
});

module.exports = {
  get: function(key) {
    return nconf.get(key);
  }
};
