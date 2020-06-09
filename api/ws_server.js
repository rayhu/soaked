/*
 */

// expect client to send this prefix and then the actual ID
const clientIdPrefix = 'ClientID: '
const ipAddr = require('ipaddr.js')
const ws_server = {
    start(config) {
        // Log Start Message
        console.log(
            `Soaked Server ${config.server_version} started on port: ${config.server_port}`
        )
        console.log(`visit ${config.soaked_web} for more information`)

        // Initialize websockets
        const WebSocket = require('ws')
        const port = config.server_port
        const wss = new WebSocket.Server({port: port})
        // Heart beat
        function noop() {}
        function heartbeat() {
            this.isAlive = true
        }

        // Ping all clients every 30 seconds
        const interval = setInterval(function ping() {
            console.log(`Sending HEARTBEAT to ${wss.clients.size} clients...`)
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
            // keep client HEARTBEAT
            ws.on('pong', heartbeat)

            // log the client message
            ws.on('message', function incoming(message) {
                console.log(`RECEIVED: ${message}`)
                try {
                    if (message.startsWith(clientIdPrefix)) {
                        ws.client_id = message.substr(clientIdPrefix.length)
                        console.log(`detected id:${ws.client_id}`)
                    }
                } catch (e) {
                    console.log(message)
                }
            })

            // fine the client real IP, if deployed behind reverse proxy
            let proxy_header_ip
            if (req.headers['x-forwarded-for']) {
                proxy_header_ip = req.headers['x-forwarded-for'].split(
                    /\s*,\s*/
                )[0]
                console.log(`Proxy Header IP is  ${proxy_header_ip}`)
            }

            let client_ip = proxy_header_ip
                ? proxy_header_ip
                : req.connection.remoteAddress

            const ip = ipAddr.parse(client_ip)
            console.log(`ipv4 is ${ip.toIPv4Address()}`)
            // save both ipv4 and ipv6 versions
            if (ip.kind === 'ipv4') {
                ws.client_ip = client_ip
                ws.client_ipv6 = `::ffff:${client_ip}`
            } else {
                ws.client_ip = ip.toIPv4Address().toString()
                ws.client_ipv6 = client_ip
            }

            console.log(`Connected from ${ws.client_ip}`)

            ws.send(
                `Soaked Server ${
                    config.send_server_version
                        ? `version: ${config.server_version}`
                        : ''
                }`
            )
            ws.send(`Your public ip is: ${client_ip}`)

            ws.isAlive = true
            console.log('Please create pipeline')
            ws.send('Please setup pipeline')
        })

        return wss
    },
}
module.exports = ws_server
