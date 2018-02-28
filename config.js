"use strict"

const nconf = require('nconf');

nconf.file('./config.json');

nconf.defaults({
  "updatePeriod": 10,
  "windowWidth": 400,
  "windowHeight": 250,
  "windowOpenDevTools": false,
  "windowShowMenu": false,
  "windowIcon": __dirname + "/assets/spin.ico",
  "soundDailyKw" : __dirname + "/assets/Blastwave_FX_CashRegister_S08IN_92.wav",
  "soundLifetime10Kw" : __dirname + "",
  "soundLifetime100Kw": __dirname + "",
  "soundLifetime1Mw": __dirname + ""
});

module.exports = {
  get: function(key) {
    return nconf.get(key);
  }
};
