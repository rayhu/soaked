//const uuid=require("uuid")
const config = require('./configuration').getAll()
const port = config.server_port

const WebSocket = require('ws')
const ws_server = new WebSocket.Server({ port: `${port}` })

function noop () { }

function heartbeat () {
    this.isAlive = true
}

function serviced (ws, req) {
    const client_ip = req.connection.remoteAddress
    console.log(`Connected from ${client_ip}`)
    if (req.headers['x-forwarded-for']) {
        const proxy_header_ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]
        console.log(`Proxy Header IP is  ${proxy_header_ip}`)
    }
    ws.send(`Soaked Server, version 0.0.1`)
    ws.send(`Your public ip is: ${client_ip}`)

    ws.isAlive = true
    ws.on('pong', heartbeat)

    ws.send("Please setup pipeline")

    ws.on('message', function incoming (message) {
        console.log('received: %s', message)
    })
    ws.send("Test Message")

}



ws_server.on('connection', function connection (ws, req) {

    ws.on('message', function incoming (message) {
        console.log('received: %s', message);
    })

    const client_ip = req.connection.remoteAddress
    console.log(`Connected from ${client_ip}`)
    if (req.headers['x-forwarded-for']) {
        const proxy_header_ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]
        console.log(`Proxy Header IP is  ${proxy_header_ip}`)
    }
    ws.send(`Soaked Server, version 0.0.1`)
    ws.send(`Your public ip is: ${client_ip}`)

    ws.isAlive = true
    ws.on('pong', heartbeat)

    ws.send("Please setup pipeline")

}
)

const interval = setInterval(function ping () {
    console.log(`Pinging ${ws_server.clients.size} clients...`)
    ws_server.clients.forEach(function each (ws) {
        if (ws.isAlive === false) return ws.terminate()

        ws.isAlive = false
        ws.ping(noop) // Pong messages are automatically sent in response to ping messages as required by the spec.
    })
}, 5000)

ws_server.on('close', function close () {
    clearInterval(interval)
})
console.log("Soaked Server Started!")
console.log("visit https://soaked.hulaorui.com for more information")
