/*
 * Const uuid=require("uuid")
 * Get configuration
 */

const ws_server = {
    start(config) {
        // Log Start Message
        console.log(
            `Soaked Server ${config.server_version} started on port: ${config.server_port}`
        )
        console.log('visit https://soaked.hulaorui.com for more information')

        // Initialize websockets
        const WebSocket = require('ws')
        const port = config.server_port
        const wss = new WebSocket.Server({port: `${port}`})
        // Heart beat
        function noop() {}
        function heartbeat() {
            this.isAlive = true
        }

        // Ping all clients every 30 seconds
        const interval = setInterval(function ping() {
            console.log(`PING ${wss.clients.size} clients...`)
            wss.clients.forEach(function each(ws) {
                if (ws.isAlive === false) {
                    return ws.terminate()
                }

                ws.isAlive = false
                ws.ping(noop) // Pong messages are automatically sent in response to ping messages as required by the spec.
            })
        }, config.poll_interval)
        wss.on('close', function close() {
            clearInterval(interval)
        })

        // Handle on connection to server
        wss.on('connection', function connection(ws, req) {
            ws.on('message', function incoming(message) {
                console.log(`RECEIVED: ${message}`)
            })
            let proxy_header_ip
            if (req.headers['x-forwarded-for']) {
                proxy_header_ip = req.headers['x-forwarded-for'].split(
                    /\s*,\s*/
                )[0]
                console.log(`Proxy Header IP is  ${proxy_header_ip}`)
            }

            let client_ip 
            client_ip = proxy_header_ip ? proxy_header_ip : req.connection.remoteAddress
            console.log(`Connected from ${client_ip}`)
            ws.client_ip = client_ip
            ws.send(
                `Soaked Server ${
                    config.send_server_version
                        ? `version: ${config.server_version}`
                        : ''
                }`
            )
            ws.send(`Your public ip is: ${client_ip}`)

            ws.isAlive = true
            ws.on('pong', heartbeat)
            console.log('Please create pipeline')
            ws.send('Please setup pipeline')
        })

        return wss
    },
}
module.exports = ws_server
