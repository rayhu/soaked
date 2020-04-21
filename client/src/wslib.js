
// Heart beat
const config = require('./configuration').getAll()
const WebSocket = require('ws')

module.exports = {
    setup: (url) => {
        const ws = new WebSocket(url)
        let heart_timer

        function heartbeat () {
            if (global.argv.verbose) console.log('WebSockets: HEARTBEAT')
            clearTimeout(heart_timer)
            /*
             * Use `WebSocket#terminate()`, which immediately destroys the connection,
             * instead of `WebSocket#close()`, which waits for the close timer.
             * Delay should be equal to the interval at which your server
             * sends out pings plus a conservative assumption of the latency.
             */
            heart_timer = setTimeout(() => {
                console.log('WebSockets: Heartbeat not received, disconnecting...')
                ws.terminate()
            }, config.ping_interval)
        }

        ws.on('ping', heartbeat)

        ws.on('close', function clear () {
            clearTimeout(this.heart_timer)
        })
        ws.on('error', function error (error) {
            console.log(`WebSockets: Error: ${error}`)
        })

        ws.on('open', function open () {
            heartbeat()
            if (global.argv.verbose) console.log('WebSockets: Connected')
            const start_message = `Hello, Soaked Client`.concat(
                config.send_client_version ? `version: ${config.client_version}` : ''
            )
            ws.send(start_message)

            /*
             * You can also send binary data
             * const array = new Float32Array(50)
             * for (var i = 0; i < array.length; ++i) {
             *     array[i] = i * 2
             * }
             * client.send(array)
             */
        })
        return ws
    },

}