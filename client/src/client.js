#!/usr/bin/env node
const WebSocket = require('ws')
// Get configuration
const config = require('./configuration').getAll()

// generated client id at the first run
if (!config.client_id) require('./init').run(config)

// Usage and validation of arguments
argv = global.argv = require('./args').getAll()

// Starting message
console.log(`Soaked Client ${config.client_version}
visit https://soaked.hulaorui.com for more information
`)

if (argv.verbose) {
    console.log(`Arguments`)
    console.log(argv)
    console.log(`WebSockets: Connecting to: ${argv.url}`)
}

// Initialize websockets
// const client = new WebSocket(argv.url)

// Setup heart beat and connection/close events
const wsClient = require('./wslib').setup(argv.url)

// Setup heart beat and connection/close events
const socketClient = require('./socketlib').setup(argv.host, argv.port)

const duplex = WebSocket.createWebSocketStream(wsClient, {
    encoding: 'utf8',
})

wsClient.on('message', function incoming (data) {
    if (argv.verbose) console.log(`WebSockets: RECEIVED: ${data}`)
    // If receive this command, then bridge to the configed socket.
    if (data === 'Please setup pipeline') {
        console.log("Creating Pipe")
        duplex.pipe(socketClient)
        // Cannot directly pipe, as it will pipe the end event. Please don't use redirect.pipe(duplex), instead, handle data event separately.
        /*
         * Don't pass the end event to the other end, it will break your websockets
         * readable.on('end', () => {
         *     writable.end();
         * });
         * You can test with command lines
         * duplex.pipe(process.stdout);
         * process.stdin.pipe(duplex,);
         */
        socketClient.on('data', (chunk) => {
            duplex.write(chunk)
        })
    }
})



