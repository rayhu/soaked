let server;

module.exports = {
    listen (port) {
        const net = require('net')

        server = net.createServer(function (socket) {
            console.log('Local Watcher server\r\n')
            socket.pipe(process.stdout)
            process.stdin.pipe(socket)
        })
        server.listen(port ? port : 1110)
    },
    close(){
        server.close()
    }

}