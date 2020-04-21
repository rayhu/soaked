module.exports = {
    getAll: () => {
        const config = require('./configuration').getAll()
        let argv = require('yargs').usage(
            '$0 <socket> [url]',
            `Soaked Client creates bridge between the TCP socket <host:port> and
            the WebSockets url. After it is established, this local socket is
            reachable securely by any webpage in browsers from Internet.

            It makes your network service discoverable, reachable, and secure. 

            Default url is ${config.server_url}/<your_token>`,
            (yargs) => {
                yargs
                    .positional('socket', {
                        describe: `TCP socket endpoint, usually a local host:port.
                            Example localhost:3389`,
                        type: 'string',
                    })
                    .positional('url', {
                        describe: `WebSockets to visit from Internet 
                            Example ws://host/path`,
                        type: 'string',
                        default: config.server_url,
                    })
                    .option('token', {
                        alias: 't',
                        type: 'string',
                        describe: `Desied token.
                            It has to be one of the tokens previously generated 
                            using the current client id.`,
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
        const host = socket[0]
        const port = Number(socket[1])
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            console.log('Provided port is invalid')
            process.exit(1)
        }
        argv.host = host
        argv.port = port

        // Validate url argument
        if (!argv.url) {
            argv.url = config.server_url
        }
        const validUrl = require('valid-url')
        if (!validUrl.isUri(argv.url)) {
            console.log('Provided url is not valid')
            process.exit(1)
        }
        return argv
    },
}