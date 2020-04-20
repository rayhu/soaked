#!/usr/bin/env node

const WebSocket = require('ws')
const net = require('net')
const path = require('path')
// Const uuid=require("uuid")

// Get configuration
const configFileFullName = path.join(__dirname, 'config.yml')
const config = require('./configuration').getAll(configFileFullName) // Log Start Message

// Usage
const argv = require('yargs').usage(
    '$0 <socket> [url]',
    `Soaked Client creates bridge between the TCP socket <host:port> and the WebSockets url. After it is established, your local socket is reachable from Internet by a webpage to ${config.server_url}/<your_token>`,
    (yargs) => {
        yargs
            .positional('socket', {
                describe: `the TCP socket endpoint you want to bridge`,
                type: 'string',
            })
            .positional('url', {
                describe: `the url that your bridge will publish to`,
                type: 'string',
                default: config.server_url,
            })
            .option('verbose', {
                alias: 'v',
                type: 'boolean',
                description: 'Run with verbose logging',
            })
    }
).argv

// Validate socket argument
const socket = argv.socket.split(':')
if (socket.length != 2) {
    console.log('Provided socket is invalid')
    process.exit(1)
}
const pipe_host = socket[0]
const pipe_port = Number(socket[1])
console.log(Number.isInteger(pipe_port))
if (!Number.isInteger(pipe_port) || pipe_port < 1 || pipe_port > 65535) {
    console.log('Provided port is invalid')
    process.exit(1)
}

// Validate url argument
const url = argv.url ? argv.url : config.server_url
const validUrl = require('valid-url')
if (!validUrl.isUri(url)) {
    console.log('Provided url is not valid')
    process.exit(1)
}

// Starting message
console.log(
    `Soaked Client ${config.client_version}, bridge non-HTTP protocol to websockets!`
)
console.log('visit https://soaked.hulaorui.com for more information')

// Initialize websockets
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
    const start_message = `Hello, Soaked Client`.concat(
        config.send_client_version ? `version: ${config.client_version}` : ''
    )
    client.send(start_message)

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

        const redirect = net.createConnection(pipe_port, pipe_host)
        redirect.on('error', function (error) {
            console.log(
                `Connection to ${pipe_host}:${pipe_port} failed with error: ${error}`
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
