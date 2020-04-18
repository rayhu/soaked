#!/usr/bin/env node

const WebSocket = require('ws')
const net = require('net')
const path = require('path')
// Const uuid=require("uuid")

// Get configuration
const configFileFullName = path.join(__dirname, 'config.yml')
const config = require('./configuration').getAll(configFileFullName) // Log Start Message
console.log(
    `Soaked Client ${config.client_version}, bridge non-HTTP protocol to websockets!`
)
console.log('visit https://soaked.hulaorui.com for more information')

// Initialize websockets
const url = config.server_url
console.log(`Connecting to: ${url}`)
const client = new WebSocket(url)

// Heart beat
let heart_timer
function heartbeat() {
    console.log('HEARTBEAT')
    clearTimeout(heart_timer)

    /*
     * Use `WebSocket#terminate()`, which immediately destroys the connection,
     * instead of `WebSocket#close()`, which waits for the close timer.
     * Delay should be equal to the interval at which your server
     * sends out pings plus a conservative assumption of the latency.
     */
    heart_timer = setTimeout(() => {
        console.log('Heartbeat not received, disconnecting...')
        client.terminate()
    }, config.ping_interval)
}

client.on('ping', heartbeat)
client.on('close', function clear() {
    clearTimeout(this.pingTimeout)
})
client.on('error', function error(error) {
    console.log(`WebSocket error: ${error}`)
})

// Create connection to server
client.on('open', function open() {
    heartbeat()
    console.log('WebSocket connected')
    client.send(
        `Hello, Soaked Client ${
            config.send_client_version
                ? `version: ${config.client_version}`
                : ''
        }`
    )

    /*
     * You can also send binary data
     * const array = new Float32Array(50)
     * for (var i = 0; i < array.length; ++i) {
     *     array[i] = i * 2
     * }
     * client.send(array)
     */
})

client.on('message', function incoming(data) {
    console.log(`RECEIVED: ${data}`)
    // If receive this command, then bridge to the configed socket.
    if (data === 'Please setup pipeline') {
        const duplex = WebSocket.createWebSocketStream(client, {
            encoding: 'utf8',
        })
        console.log('Creating pipeline')

        const redirect = net.createConnection(
            config.pipe_port,
            config.pipe_host
        )
        redirect.on('error', function (error) {
            console.log(
                `Connection to ${config.pipe_host}:${config.pipe_port} failed with error: ${error}`
            )
            client.send(`Pipeline creation failed: ${error}`)
        })
        redirect.on('connect', function () {
            duplex.pipe(redirect)
            // Cannot directly pipe, as it will pipe the end event. Please don't use redirect.pipe(duplex), instead, handle data event separately.
            redirect.on('data', (chunk) => {
                duplex.write(chunk)
            })

            /*
             * Don't pass the end event to the other end, it will break your websockets
             * readable.on('end', () => {
             *     writable.end();
             * });
             * You can test with command lines
             * duplex.pipe(process.stdout);
             * process.stdin.pipe(duplex,);
             */
        })
    }
})
