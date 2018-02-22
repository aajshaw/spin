"use strict"

const electron = require('electron');
const app = electron.app;
const browserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const config = require('./config')

let windowWidth = config.get('windowWidth');
let windowHeight = config.get('windowHeight');
let windowOpenDevTools = config.get('windowOpenDevTools');
let windowShowMenu = config.get('windowShowMenu');
let windowIcon = config.get('windowIcon');

let window; // Keep reference so window does not close

function createWindow() {
  var windowOptions = {
    width: windowWidth,
    height: windowHeight
  };
  if (windowIcon) {
    windowOptions.icon = windowIcon;
  }
//  let window = new browserWindow({width: windowWidth, height: windowHeight, icon: __dirname + './assets/spin.ico'});
  let window = new browserWindow(windowOptions);
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  }));
  if (!windowShowMenu) {
    window.setMenu(null);
  }
  if (windowOpenDevTools) {
    window.webContents.openDevTools();
  }
  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
