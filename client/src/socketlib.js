const net = require('net')

module.exports = {
    setup: (host, port)=>{
        const socket = net.createConnection(port, host)
        socket.on('error', function (error) {
            console.log(
                `SOCKET: Connection to ${host}:${port} failed with error: ${error}`
            )
            //ws.send(`Pipeline creation failed: ${error}`)
        })

        socket.on('connect', function () {
            console.log(`SOCKET: Connected to socket ${host}:${port}`)

        })

        return socket;
    }
}


