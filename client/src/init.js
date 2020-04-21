const UuidGenerator = require("./UuidGenerator")
const configurationManager = require('./configuration')

module.exports = {
    run: (config) => {
        config.client_id  = UuidGenerator.generate()
        configurationManager.saveAll(config)
        configurationManager.getAll()
    }
}