const net = require('net')

const server = net.createServer(function (socket) {
    console.log('Local Watcher server\r\n')
    socket.pipe(process.stdout)
    process.stdin.pipe(socket)
})

server.listen(1110)
