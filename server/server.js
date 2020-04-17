//const uuid=require("uuid")
// Get configuration
const path = require('path')
const configFileFullName = path.join(__dirname, 'config.yml')
const config = require('../configuration').getAll(configFileFullName)

// Log Start Message
console.log(`Soaked Server ${config.server_version} started on port: ${config.server_port}`)
console.log("visit https://soaked.hulaorui.com for more information")

// Initialize websockets
const WebSocket = require('ws')
const port = config.server_port
const ws_server = new WebSocket.Server({ port: `${port}` })
global.ws_server = ws_server
// Heart beat
function noop () { }
function heartbeat () {
    this.isAlive = true
}

// Ping all clients every 30 seconds
const interval = setInterval(function ping () {
    console.log(`PING ${ws_server.clients.size} clients...`)
    ws_server.clients.forEach(function each (ws) {
        if (ws.isAlive === false) return ws.terminate()

        ws.isAlive = false
        ws.ping(noop) // Pong messages are automatically sent in response to ping messages as required by the spec.
    })
}, config.poll_interval)

ws_server.on('close', function close () {
    clearInterval(interval)
})


// Handle on connection to server
ws_server.on('connection', function connection (ws, req) {

    ws.on('message', function incoming (message) {
        console.log(`RECEIVED: ${message}`);
    })

    const client_ip = req.connection.remoteAddress
    console.log(`Connected from ${client_ip}`)
    if (req.headers['x-forwarded-for']) {
        const proxy_header_ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]
        console.log(`Proxy Header IP is  ${proxy_header_ip}`)
    }
    ws.send(`Soaked Server ${config.send_server_version? ("version: " + config.server_version): ""}`)
    ws.send(`Your public ip is: ${client_ip}`)

    ws.isAlive = true
    ws.on('pong', heartbeat)
    console.log("Please create pipeline")
    ws.send("Please setup pipeline")

}
)

var api_server = require('./api_server');

api_server.listen(config.api_port, function () {
    console.log(`API server listening on port ${config.api_port}`);
});