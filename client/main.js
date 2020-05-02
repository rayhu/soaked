// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

const client = require('./src/client')

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({})

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', () => {
    console.log(process.argv)
    // Default arguments array is below. Anything more than that are treated as command line.
    // [
    //     'electron.exe',
    //     '.'
    // ]
    let isCalledViaCLI = process.argv && process.argv.length > 2
    isCalledViaCLI
        ? console.log('Starting command line')
        : console.log('Starting GUI')
    let mainWindow
    if (isCalledViaCLI) {
        client.run()
        mainWindow = new BrowserWindow({show: false, width: 0, height: 0})
    } else {
        mainWindow = new BrowserWindow({
            show: true,
            width: 1050,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
        })
    }

    mainWindow.once('ready-to-show', () => {
        if (isCalledViaCLI) {
            mainWindow.hide()
        } else {
            mainWindow.show()
            mainWindow.maximize()
        }
    })
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// const {app, BrowserWindow} = require('electron')

// //const client = require('./src/client')

// function createWindow() {
//     let win = new BrowserWindow({
//         width: 800,
//         height: 600,
//         webPreferences: {
//             nodeIntegration: true,
//         },
//     })

//     win.loadFile('index.html')
// }
//app.whenReady().then(createWindow)
