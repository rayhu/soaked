// Get configuration
const path = require('path')
const configFileFullName = path.join(__dirname, 'config.yml')
const config = require('./configuration').getAll(configFileFullName)

const ws_server = require('./ws_server')
global.wss = ws_server.start(config)

const api_server = require('./api_server')
api_server.listen(config.api_port, function () {
    console.log(`Restful API server listening on port ${config.api_port}`)
})
