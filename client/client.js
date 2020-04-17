const WebSocket = require('ws')
const net = require('net')
let heart_timer 

function heartbeat() {
    console.log("Heart beating")
    clearTimeout(heart_timer)
    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    heart_timer = setTimeout(() => {
        console.log("Heartbeat not received, disconnecting...")
        client.terminate()
    }, 10000 + 2000)
}

console.log("Soaked Client, bridge non-HTTP protocol to websockets!")
console.log("visit https://soaked.hulaorui.com for more information")

const config = require('./configuration').getAll()
const url = config.server_url
console.log("Connecting to: "+ url)
const client = new WebSocket(url)
client.on('open', heartbeat);
client.on('ping', heartbeat)
client.on('close', function clear () {
    clearTimeout(this.pingTimeout)
})
client.on('error', function error (error) {
    console.log(`WebSocket error: ${error}`)
})

client.on('open', function open() {
    heartbeat()
    console.log(`WebSocket connected`)
    client.send("Hello")

    // You can also send binary data
    // const array = new Float32Array(50)
    // for (var i = 0; i < array.length; ++i) {
    //     array[i] = i * 2
    // }
    // client.send(array)
})

client.on('message', function incoming (data) {
    console.log(`Received: ${data}`)
    // if receive this command, then bridge to the configed socket.
    if (data == 'Please setup pipeline') {
        const duplex = WebSocket.createWebSocketStream(client, {
            encoding: 'utf8',
        })
        console.log("pipeline triggered")

        let redirect = net.createConnection(config.pipe_port, config.pipe_host)
        redirect.on('error', function (error) {
            console.log(`Connection to ${config.pipe_host}:${config.pipe_port} failed `);
            client.send("failed")

        })
        redirect.on('connect', function (connect) {
            duplex.pipe(redirect)
            // cannot directly pipe, as it will pipe the end event. Please don't use redirect.pipe(duplex), instead, handle data event separately.
            redirect.on('data', (chunk) => {
                duplex.write(chunk);
            });
            // Don't pass the end event to the other end, it will break your websockets
            // readable.on('end', () => {
            //     writable.end();
            // });
            // You can test with command lines
            // duplex.pipe(process.stdout);
            // process.stdin.pipe(duplex,);
        })
    }
})
