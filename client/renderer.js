// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const client = require('./src/client')

const txtHost = document.getElementById('txtHost')
const txtPort = document.getElementById('txtPort')
const btnWatcher = document.getElementById('btnWatcher')

window.addEventListener('DOMContentLoaded', () => {
    // node version
    const replaceText = (selector, text) => {
        // eslint-disable-next-line no-undef
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }

    // add onclick event for connect button
    document.getElementById('btnConnect').addEventListener('click', connect)
    document
        .getElementById('btnWatcher')
        .addEventListener('click', localwatcher)
})

function connect() {
    const host = txtHost.value ? txtHost : `localhost`
    const port = txtPort.value ? Number.parseInt(txtPort.value) : 1110
    console.log(`connecting to ${host}:${port}`)
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
