const electron = require('electron');
const app = electron.app;
const browserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let window; // Keep reference so window does not close

function createWindow() {
  var window = new browserWindow({width: 400, height: 200});
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'app.html'),
    protocol: 'file:',
    slashes: true
  }));
  window.setMenu(null);
//  window.webContents.openDevTools();
  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
