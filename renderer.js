"use strict"

const http = require('http');
const parseString = require('xml2js-parser').parseString;

// Use edge-js rather than edge because it tracks node version much better
// Use electron version of edge-js
const edge = require('electron-edge-js');
// Call out to .net to play a sound effect
let play = edge.func(function() {/*
  async (input) => {
    var player = new System.Media.SoundPlayer((string)input);
    player.PlaySync();
    return null;
  }
*/})

const config = require('./config');

let updatePeriod = config.get('updatePeriod');

var app = new Vue({
  el: '#app',
  data: {
    outputPower: 0.000,
    energyToday: 0.00,
    hoursToday: 0,
    minutesToday: 0,
    energyYesterday: 0.00,
    hoursYesterday: 0,
    minutesYesterday: 0,
    energyLifetime: 0.00,
    hoursLifetime: 0,
    minutesLifetime: 0,
    averageDailyProduction: 0.00,
    daysProducing: 0
  },
  methods: {updatex() { this.header = 'that was easy'; }}
});

let status = { initialised: false};

function update() {
  http.request({
    host: 'enasolar-gt',
    method: 'GET',
    path: '/meters.xml'
  }, function (response) {
    response.setEncoding('utf8');
    response.on('readable', function () {
      let xml = response.read();
      if (xml) {
        parseString(xml, (err, result) => {
          if (!err) {
            app.outputPower = (result.response.OutputPower * 1.0).toFixed(3);
          }
        });
      }
    });
  }).end();

  http.request({
    host: 'enasolar-gt',
    method: 'GET',
    path: '/data.xml'
  }, function (response) {
    response.setEncoding('utf8');
    response.on('readable', function () {
      let xml = response.read();
      if (xml) {
        parseString(xml, (err, result) => {
          if (!err) {
            app.energyToday = (parseInt(result.response.EnergyToday, 16) / 100.0).toFixed(2);
            app.hoursToday = Math.floor(result.response.HoursExportedToday / 60);
            app.minutesToday = result.response.HoursExportedToday % 60;
            app.energyYesterday = (parseInt(result.response.EnergyYesterday, 16) / 100.0).toFixed(2);
            app.hoursYesterday = Math.floor(result.response.HoursExportedYesterday / 60);
            app.minutesYesterday = result.response.HoursExportedYesterday % 60;
            app.energyLifetime = (parseInt(result.response.EnergyLifetime, 16) / 100.0).toFixed(2);
            app.hoursLifetime = Math.floor(parseInt(result.response.HoursExportedLifetime, 16) / 60);
            app.minutesLifetime = parseInt(result.response.HoursExportedLifetime, 16) % 60;
            app.daysProducing = parseInt(result.response.DaysProducing, 16);
            app.averageDailyProduction = (app.energyLifetime / app.daysProducing).toFixed(2);

            if (status.initialised) {
              if (Math.floor(app.energyToday) > Math.floor(status.energyToday)) {
                play(config.get('soundDailyKw'));
              }
              let energy = Math.floor(app.energyLifetime);
              if (energy % 10 == 0 && energy > Math.floor(status.energyLifetime)) {
                if (energy % 1000 == 0) {
                  play(config.get('soundLifetime1Mw'));
                } else if (energy % 100 == 0) {
                  play(config.get('soundLifetime100Kw'));
                } else if (energy % 10 == 0) {
                  play(config.get('soundLifetime10Kw'));
                }
              }
              status.energyToday = app.energyToday;
              status.energyLifetime = app.energyLifetime;
            } else {
              status.energyToday = app.energyToday;
              status.energyLifetime = app.energyLifetime;
              status.initialised = true;
            }
          }
        });
      }
    });
  }).end();

  setTimeout(update, updatePeriod * 1000);
}

update();
