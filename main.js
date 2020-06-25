const electron = require('electron');
const path = require('path');
const url = require('url');

const { app, BrowserWindow, Menu, screen, ipcMain } = electron;

let mainWin;

app.on("ready", () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    //App
    mainWin = new BrowserWindow({
        width,
        height,
        frame: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true
        },
        icon: __dirname + './public/images/icon.png'
    });

    mainWin.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))
})

app.on('activate', () => {
    if (mainWin === null) {

    }
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        mainWin = null;
        popupdWin = null;
        app.quit();
    }
})

//Main process
ipcMain.on('channel', (event, arg) => {
    console.log(arg);
    const MongodbConn = require('./data/mongodb.js');
    const mongodb = new MongodbConn();
    mongodb.connectDB(arg);
    event.sender.send('channel-reply', 'Customer data is inserted');
});