const WebSocket = require('ws')

function heartbeat() {
    clearTimeout(this.pingTimeout)

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    this.pingTimeout = setTimeout(() => {
        this.terminate()
    }, 30000 + 1000)
}

const config = require('../configuration').getAll()
const url = config.server_url

const client = new WebSocket(url)


client.on('open', function open() {
    console.log(`WebSocket connected`)
    const array = new Float32Array(5)

    for (var i = 0; i < array.length; ++i) {
        array[i] = i / 2
    }
    client.send(array)
})

client.on('open', heartbeat)
client.on('ping', heartbeat)
client.on('close', function clear() {
    clearTimeout(this.pingTimeout)
})
client.on('error', function error (error) {
    console.log(`WebSocket error: ${error}`)
})
client.on('message', function incoming (data) {
    console.log(`Received: ${data}`)
    if (data == 'console') {
        const duplex = WebSocket.createWebSocketStream(client, {
            encoding: 'utf8',
        })

        duplex.pipe(process.stdout)
        process.stdin.pipe(duplex)
    }
})
