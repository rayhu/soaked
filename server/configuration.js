const fs = require('fs')
const path = require('path')

let configurations = {
    getAll() {
        // if it was already loaded, then return it from memory
        if (global.configuration_manager_config_values)
            return global.configuration_manager_config_values

        // if not, read the YML file and return it from there
        const configFileFullName = path.join(__dirname, 'config.yml')
        let configFileStream = fs.readFileSync(configFileFullName, 'utf8')
        // try loading and parsing config file
        try {
            const yaml = require('js-yaml')
            let config = yaml.safeLoad(configFileStream)

            global.configuration_manager_config_values = config
            return global.configuration_manager_config_values
        } catch (error) {
            console.error(JSON.stringify(error))
            throw 'Failed to load configuration file'
        }
    },
}
module.exports = configurations
