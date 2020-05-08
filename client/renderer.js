// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

function connect () {
    const host = txtHost.value ? txtHost:`localhost`
    const port = txtPort.value ? Number.parseInt(txtPort.value): 1110
    console.log(`connecting to ${host}:${port}`)
    let client = require('./src/client')
    client.run()
}

function localwatcher(){
    const local = require('./src/localwatch')
    const port = txtPort.value ? Number.parseInt(txtPort.value) : 1110

    if(btnWatcher.checked){
        local.listen(port)
    } else{
        local.close()
    }
}