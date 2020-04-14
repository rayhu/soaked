function noop () { }

function heartbeat () {
    this.isAlive = true
}

function serviced (ws, req) {
    const client_ip = req.connection.remoteAddress
    const proxy_header_ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0]

    console.log(`Connected from ${client_ip}`)
    console.log(`Proxy Header IP is  ${proxy_header_ip}`)

    ws.send(`Your public ip is: ${client_ip}`)

    ws.isAlive = true
    ws.on('pong', heartbeat)

    ws.on('message', function incoming (message) {
        console.log('received: %s', message)
    })
}

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 })
wss.on('connection', serviced)

const interval = setInterval(function ping () {
    wss.clients.forEach(function each (ws) {
        if (ws.isAlive === false) return ws.terminate()

        ws.isAlive = false
        ws.ping(noop) // Pong messages are automatically sent in response to ping messages as required by the spec.
    })
}, 30000)

wss.on('close', function close () {
    clearInterval(interval)
})
